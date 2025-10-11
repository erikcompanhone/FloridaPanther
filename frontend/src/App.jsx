import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header.jsx';
import ErrorBoundary from './components/ui/ErrorBoundary.jsx';
import Home from './pages/Home/Home.jsx';
import PantherMortality from './PantherMortality/PantherMortality.jsx';
import PantherTelemetry from './PantherTelemetry/PantherTelemetry.jsx';
import NotFound from './pages/NotFound/NotFound.jsx';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import './styles/variables.css';
import './styles/responsive.css';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/mortality" element={<PantherMortality />} />
              <Route path="/telemetry" element={<PantherTelemetry />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

