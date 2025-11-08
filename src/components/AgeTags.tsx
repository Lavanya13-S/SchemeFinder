import { useState, useMemo } from 'react';
import { schemes } from '../data/schemes';

const DEFAULT_ORDER = [
  "0-10","11-20","21-30","31-40","41-50","51-60","61-70","71-80","81-90","91-100","101-110","All Ages"
];

interface AgeTagsProps {
  selectedAgeGroups?: string[];
  onAgeGroupSelect?: (ageGroup: string) => void;
}

export default function AgeTags({ selectedAgeGroups = [], onAgeGroupSelect }: AgeTagsProps) {
  const [showAll, setShowAll] = useState(false);

  // Extract and count age groups from schemes
  const ageGroupCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    
    schemes.forEach((scheme) => {
      // Count schemes for each age tag
      if (scheme.age_tags && Array.isArray(scheme.age_tags)) {
        scheme.age_tags.forEach((ageTag: string) => {
          counts[ageTag] = (counts[ageTag] || 0) + 1;
        });
      }
      
      // Also count for filter_age_group
      if (scheme.filter_age_group && typeof scheme.filter_age_group === 'string') {
        counts[scheme.filter_age_group] = (counts[scheme.filter_age_group] || 0) + 1;
      }
    });
    
    return counts;
  }, []);

  // Sort age groups according to DEFAULT_ORDER and filter out those with 0 schemes
  const sortedAgeGroups = useMemo(() => {
    return DEFAULT_ORDER.filter(ageGroup => (ageGroupCounts[ageGroup] || 0) > 0);
  }, [ageGroupCounts]);

  const displayedAgeGroups = showAll ? sortedAgeGroups : sortedAgeGroups.slice(0, 6);

  const handleAgeGroupClick = (ageGroup: string) => {
    if (onAgeGroupSelect) {
      onAgeGroupSelect(ageGroup);
    }
  };

  if (sortedAgeGroups.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter by Age Group</h3>
      
      <div className="flex flex-wrap gap-3 mb-4">
        {displayedAgeGroups.map((ageGroup) => {
          const count = ageGroupCounts[ageGroup] || 0;
          const isSelected = selectedAgeGroups.includes(ageGroup);
          
          return (
            <button
              key={ageGroup}
              onClick={() => handleAgeGroupClick(ageGroup)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                isSelected
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700'
              }`}
            >
              {ageGroup} ({count})
            </button>
          );
        })}
      </div>

      {sortedAgeGroups.length > 6 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-green-600 hover:text-green-700 text-sm font-medium"
        >
          {showAll ? 'Show Less' : `Show All ${sortedAgeGroups.length} Age Groups`}
        </button>
      )}
    </div>
  );
}