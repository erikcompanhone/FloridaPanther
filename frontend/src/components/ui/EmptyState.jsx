import './EmptyState.css';

function EmptyState({ 
  icon = '📊', 
  title = 'No Data Available', 
  message = 'Try adjusting your filters to see results.',
  action
}) {
  return (
    <div className="empty-state-container">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      {action && (
        <button onClick={action.onClick} className="empty-state-button">
          {action.label}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
