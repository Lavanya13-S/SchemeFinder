import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SavedSchemesProvider } from './contexts/SavedSchemesContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SchemesPage from './pages/SchemesPage';
import SchemeDetailPage from './pages/SchemeDetailPage';
import StatesPage from './pages/StatesPage';
import MinistriesPage from './pages/MinistriesPage';
import EligibilityPage from './pages/EligibilityPage';
import SavedSchemesDashboard from './pages/SavedSchemesDashboard';

function App() {
  return (
    <AuthProvider>
      <SavedSchemesProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/schemes" element={<SchemesPage />} />
                <Route path="/scheme/:id" element={<SchemeDetailPage />} />
                <Route path="/schemes/:id" element={<SchemeDetailPage />} />
                <Route path="/states" element={<StatesPage />} />
                <Route path="/ministries" element={<MinistriesPage />} />
                <Route path="/eligibility" element={<EligibilityPage />} />
                <Route path="/saved-schemes" element={<SavedSchemesDashboard />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </SavedSchemesProvider>
    </AuthProvider>
  );
}

export default App;
