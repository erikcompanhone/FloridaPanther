import './PantherTelemetry.css';
import { useState } from 'react';
import LineGraph from '../components/LineGraph/LineGraph.jsx';
import MapView from '../components/Map/MapView.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import ErrorMessage from '../components/ui/ErrorMessage.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { useApi } from '../hooks/useApi.js';
import { useFilters } from '../hooks/useFilters.js';
import { apiService } from '../utils/api.js';
import { SEX_OPTIONS, FILTER_CONSTRAINTS } from '../utils/constants.js';

function PantherTelemetry() {
  const [activeQuery, setActiveQuery] = useState(null);

  // Query 1: Top Visited Locations
  const query1Filters = useFilters({
    sex1: ''
  });

  const query1 = useApi((...args) => apiService.fetchTelemetryHeatmap(...args));

  // Query 2: Observation Timeline
  const query2Filters = useFilters({
    minAge2: '',
    maxAge2: '',
    sex2: ''
  });

  const query2 = useApi((...args) => apiService.fetchTelemetryTimeline(...args));

  const handleQuery1Submit = async () => {
    const { sex1 } = query1Filters.filters;

    if (!query1Filters.validateFilters(['sex1'])) {
      return;
    }

    setActiveQuery('query1');
    await query1.execute(sex1);
  };

  const handleQuery2Submit = async () => {
    const { minAge2, maxAge2, sex2 } = query2Filters.filters;

    if (!query2Filters.validateFilters(['minAge2', 'maxAge2', 'sex2'])) {
      return;
    }

    setActiveQuery('query2');
    await query2.execute(minAge2, maxAge2, sex2);
  };

  return (
    <div className="telemetry-page">
      <div className="page-header">
        <h1 className="page-title">Telemetry Data Analysis</h1>
        <p className="page-subtitle">
          Explore location patterns and temporal trends in Florida panther tracking data
        </p>
      </div>

      <div className="queries-container">
        {/* Query 1: Top Visited Locations */}
        <div className="query-section">
          <div className="query-header">
            <h2 className="query-title">📍 Top 100 Visited Locations</h2>
            <p className="query-description">
              Discover the most frequently visited locations by panthers with interactive clustering visualization
            </p>
          </div>

          <div className="filters-grid">
            <select
              value={query1Filters.filters.sex1}
              onChange={(e) => query1Filters.updateFilter('sex1', e.target.value)}
              className={`filter-select ${query1Filters.errors.sex1 ? 'error' : ''}`}
            >
              {SEX_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={handleQuery1Submit}
              disabled={query1.loading}
              className="submit-button"
            >
              {query1.loading ? 'Loading...' : 'Show Locations'}
            </button>
          </div>

          <div className="result-container">
            {query1.loading && <LoadingSpinner message="Loading telemetry data..." />}
            {query1.error && <ErrorMessage error={query1.error} onRetry={handleQuery1Submit} />}
            {!query1.loading && !query1.error && query1.data && query1.data.length === 0 && (
              <EmptyState
                icon="🗺️"
                title="No Data Found"
                message="Try adjusting your filters to see results."
              />
            )}
            {!query1.loading && !query1.error && query1.data && query1.data.length > 0 && (
              <MapView data={query1.data} mode="cluster" />
            )}
          </div>
        </div>

        {/* Query 2: Observation Timeline */}
        <div className="query-section">
          <div className="query-header">
            <h2 className="query-title">📈 Observation Timeline</h2>
            <p className="query-description">
              Analyze temporal patterns in panther observations by age and sex demographics
            </p>
          </div>

          <div className="filters-grid">
            <input
              type="number"
              placeholder="Min Age"
              value={query2Filters.filters.minAge2}
              onChange={(e) => query2Filters.updateFilter('minAge2', e.target.value)}
              className={`filter-input ${query2Filters.errors.minAge2 ? 'error' : ''}`}
              min={FILTER_CONSTRAINTS.MIN_AGE}
              max={FILTER_CONSTRAINTS.MAX_AGE}
            />
            <input
              type="number"
              placeholder="Max Age"
              value={query2Filters.filters.maxAge2}
              onChange={(e) => query2Filters.updateFilter('maxAge2', e.target.value)}
              className={`filter-input ${query2Filters.errors.maxAge2 ? 'error' : ''}`}
              min={FILTER_CONSTRAINTS.MIN_AGE}
              max={FILTER_CONSTRAINTS.MAX_AGE}
            />
            <select
              value={query2Filters.filters.sex2}
              onChange={(e) => query2Filters.updateFilter('sex2', e.target.value)}
              className={`filter-select ${query2Filters.errors.sex2 ? 'error' : ''}`}
            >
              {SEX_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={handleQuery2Submit}
              disabled={query2.loading}
              className="submit-button"
            >
              {query2.loading ? 'Loading...' : 'Generate Timeline'}
            </button>
          </div>

          <div className="result-container">
            {query2.loading && <LoadingSpinner message="Analyzing observation timeline..." />}
            {query2.error && <ErrorMessage error={query2.error} onRetry={handleQuery2Submit} />}
            {!query2.loading && !query2.error && query2.data && query2.data.length === 0 && (
              <EmptyState
                icon="📈"
                title="No Data Found"
                message="Try adjusting your filters to see results."
              />
            )}
            {!query2.loading && !query2.error && query2.data && query2.data.length > 0 && (
              <LineGraph data={query2.data} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PantherTelemetry;

