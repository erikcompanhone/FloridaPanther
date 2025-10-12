import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <img 
            src="/panther icon.png" 
            alt="Panther Icon" 
            className="logo-icon"
            style={{ width: '32px', height: '32px' }}
          />
          <span className="logo-text">Florida Panther Tracker</span>
        </Link>

        <nav className="header-nav">
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/telemetry"
            className={`nav-link ${isActive('/telemetry') ? 'active' : ''}`}
          >
            Telemetry
          </Link>
          <Link
            to="/mortality"
            className={`nav-link ${isActive('/mortality') ? 'active' : ''}`}
          >
            Mortality
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;

