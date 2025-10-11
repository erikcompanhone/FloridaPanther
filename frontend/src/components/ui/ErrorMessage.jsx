import './ErrorMessage.css';

function ErrorMessage({ error, onRetry }) {
  if (!error) return null;

  return (
    <div className="error-message-container">
      <div className="error-icon">⚠️</div>
      <h3 className="error-title">Oops! Something went wrong</h3>
      <p className="error-text">{error}</p>
      {onRetry && (
        <button onClick={onRetry} className="error-retry-button">
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
