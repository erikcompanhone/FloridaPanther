import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1 className="hero-title">🐆 Florida Panther Tracker</h1>
        <p className="hero-subtitle">
          Interactive data visualization for Florida panther telemetry and mortality records
        </p>
        <div className="hero-stats">
          <div className="stat-card">
            <span className="stat-number">40k+</span>
            <span className="stat-label">Telemetry Records</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">600+</span>
            <span className="stat-label">Mortality Records</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">1949</span>
            <span className="stat-label">Data Since</span>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2 className="section-title">Explore the Data</h2>
        <div className="features-grid">
          <Link to="/telemetry" className="feature-card">
            <div className="feature-icon">📍</div>
            <h3 className="feature-title">Telemetry Data</h3>
            <p className="feature-description">
              Visualize GPS tracking data with interactive heatmaps and timeline analysis
            </p>
            <span className="feature-link">Explore →</span>
          </Link>

          <Link to="/mortality" className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">Mortality Analysis</h3>
            <p className="feature-description">
              Analyze causes of death, geographic distribution, and trends over time
            </p>
            <span className="feature-link">Explore →</span>
          </Link>
        </div>
      </div>

      <div className="about-section">
        <h2 className="section-title">About This Project</h2>
        <p className="about-text">
          This tool provides researchers, conservationists, and the public with access to 
          comprehensive Florida panther data collected by the Florida Fish and Wildlife 
          Conservation Commission. Use advanced filters to explore patterns in panther 
          movements, habitat usage, and mortality causes.
        </p>
      </div>
    </div>
  );
}

export default Home;
