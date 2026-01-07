import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface SavedScheme {
  id?: string;
  scheme_id: string;
  title: string;
  details: string;
  benefits: string;
  classified_state: string;
  filter_scheme_category: string[];
  filter_gender: string;
  filter_caste: string;
  ministry?: string;
  [key: string]: any;
}

interface SavedSchemesContextType {
  savedSchemes: SavedScheme[];
  addSavedScheme: (scheme: SavedScheme) => Promise<void>;
  removeSavedScheme: (schemeId: string) => Promise<void>;
  isSchemeSaved: (schemeId: string) => boolean;
  loading: boolean;
}

const SavedSchemesContext = createContext<SavedSchemesContextType | undefined>(undefined);

export const useSavedSchemes = () => {
  const context = useContext(SavedSchemesContext);
  if (context === undefined) {
    throw new Error('useSavedSchemes must be used within a SavedSchemesProvider');
  }
  return context;
};

interface SavedSchemesProviderProps {
  children: React.ReactNode;
}

export const SavedSchemesProvider: React.FC<SavedSchemesProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [savedSchemes, setSavedSchemes] = useState<SavedScheme[]>([]);
  const [loading, setLoading] = useState(true);

  // Load saved schemes on component mount
  useEffect(() => {
    loadSavedSchemes();
  }, [user]);

  const loadSavedSchemes = async () => {
    try {
      setLoading(true);
      
      if (user) {
        // Load from Supabase if user is logged in
        await loadFromSupabase();
      } else {
        // Load from localStorage if user is not logged in
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error('Error loading saved schemes:', error);
      loadFromLocalStorage(); // Fallback to localStorage
    } finally {
      setLoading(false);
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem('schemeFinder_savedSchemes');
      if (saved) {
        const parsed = JSON.parse(saved);
        setSavedSchemes(Array.isArray(parsed) ? parsed : []);
      } else {
        setSavedSchemes([]);
      }
    } catch (error) {
      console.error('Error parsing localStorage:', error);
      setSavedSchemes([]);
    }
  };

  const loadFromSupabase = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('saved_schemes')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Supabase error:', error);
        loadFromLocalStorage(); // Fallback to localStorage
        return;
      }

      if (data && data.length > 0) {
        setSavedSchemes(data);
      } else {
        setSavedSchemes([]);
      }
    } catch (error) {
      console.error('Error loading from Supabase:', error);
      loadFromLocalStorage();
    }
  };

  const addSavedScheme = async (scheme: SavedScheme) => {
    try {
      // Check if already saved
      if (savedSchemes.some(s => s.scheme_id === scheme.scheme_id)) {
        console.log('Scheme already saved');
        return;
      }

      if (!user) {
        // Save to localStorage if user is not logged in
        const updated = [...savedSchemes, scheme];
        setSavedSchemes(updated);
        localStorage.setItem('schemeFinder_savedSchemes', JSON.stringify(updated));
        console.log('Scheme saved to localStorage');
        return;
      }

      // Save to Supabase if user is logged in
      const { error } = await supabase
        .from('saved_schemes')
        .insert([
          {
            user_id: user.id,
            scheme_id: scheme.scheme_id,
            scheme_data: scheme,
            created_at: new Date().toISOString(),
          },
        ]);

      if (error) {
        console.error('Supabase insert error:', error);
        // Fallback to localStorage
        const updated = [...savedSchemes, scheme];
        setSavedSchemes(updated);
        localStorage.setItem('schemeFinder_savedSchemes', JSON.stringify(updated));
        return;
      }

      setSavedSchemes([...savedSchemes, scheme]);
      console.log('Scheme saved to Supabase');
    } catch (error) {
      console.error('Error saving scheme:', error);
      // Fallback to localStorage
      const updated = [...savedSchemes, scheme];
      setSavedSchemes(updated);
      localStorage.setItem('schemeFinder_savedSchemes', JSON.stringify(updated));
    }
  };

  const removeSavedScheme = async (schemeId: string) => {
    try {
      if (!user) {
        // Remove from localStorage if user is not logged in
        const updated = savedSchemes.filter(s => s.scheme_id !== schemeId);
        setSavedSchemes(updated);
        localStorage.setItem('schemeFinder_savedSchemes', JSON.stringify(updated));
        console.log('Scheme removed from localStorage');
        return;
      }

      // Remove from Supabase if user is logged in
      const { error } = await supabase
        .from('saved_schemes')
        .delete()
        .eq('user_id', user.id)
        .eq('scheme_id', schemeId);

      if (error) {
        console.error('Supabase delete error:', error);
        // Fallback to localStorage
        const updated = savedSchemes.filter(s => s.scheme_id !== schemeId);
        setSavedSchemes(updated);
        localStorage.setItem('schemeFinder_savedSchemes', JSON.stringify(updated));
        return;
      }

      setSavedSchemes(savedSchemes.filter(s => s.scheme_id !== schemeId));
      console.log('Scheme removed from Supabase');
    } catch (error) {
      console.error('Error removing scheme:', error);
      // Fallback to localStorage
      const updated = savedSchemes.filter(s => s.scheme_id !== schemeId);
      setSavedSchemes(updated);
      localStorage.setItem('schemeFinder_savedSchemes', JSON.stringify(updated));
    }
  };

  const isSchemeSaved = (schemeId: string): boolean => {
    return savedSchemes.some(s => s.scheme_id === schemeId);
  };

  const value = {
    savedSchemes,
    addSavedScheme,
    removeSavedScheme,
    isSchemeSaved,
    loading,
  };

  return (
    <SavedSchemesContext.Provider value={value}>
      {children}
    </SavedSchemesContext.Provider>
  );
};
