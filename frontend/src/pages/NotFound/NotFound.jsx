import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="not-found-icon">🐆</div>
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-message">
          The panther trail has gone cold. This page doesn't exist.
        </p>
        <Link to="/" className="home-button">
          Return Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
