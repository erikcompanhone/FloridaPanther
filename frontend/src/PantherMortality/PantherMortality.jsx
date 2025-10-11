import './PantherMortality.css';
import { useState } from 'react';
import BarGraph from '../components/BarGraph/BarGraph.jsx';
import MapView from '../components/Map/MapView.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import ErrorMessage from '../components/ui/ErrorMessage.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { useApi } from '../hooks/useApi.js';
import { useFilters } from '../hooks/useFilters.js';
import { apiService } from '../utils/api.js';
import { SEX_OPTIONS, FILTER_CONSTRAINTS } from '../utils/constants.js';

function PantherMortality() {
  const [activeQuery, setActiveQuery] = useState(null);

  // Query 1: Mortality Heatmap
  const query1Filters = useFilters({
    minAge1: '',
    maxAge1: '',
    sex1: '',
    minYear1: '',
    maxYear1: ''
  });

  const query1 = useApi((...args) => apiService.fetchMortalityHeatmap(...args));

  // Query 2: Mortality Causes
  const query2Filters = useFilters({
    minAge2: '',
    maxAge2: '',
    sex2: ''
  });

  const query2 = useApi((...args) => apiService.fetchMortalityCauses(...args));

  const handleQuery1Submit = async () => {
    const { minAge1, maxAge1, sex1, minYear1, maxYear1 } = query1Filters.filters;

    if (!query1Filters.validateFilters(['minAge1', 'maxAge1', 'sex1', 'minYear1', 'maxYear1'])) {
      return;
    }

    setActiveQuery('query1');
    await query1.execute(minAge1, maxAge1, sex1, minYear1, maxYear1);
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
    <div className="mortality-page">
      <div className="page-header">
        <h1 className="page-title">Mortality Data Analysis</h1>
        <p className="page-subtitle">
          Explore geographic distribution and causes of Florida panther mortality
        </p>
      </div>

      <div className="queries-container">
        {/* Query 1: Mortality Heatmap */}
        <div className="query-section">
          <div className="query-header">
            <h2 className="query-title">📍 Mortality Heatmap</h2>
            <p className="query-description">
              Visualize geographic distribution of panther mortality by age, sex, and year range
            </p>
          </div>

          <div className="filters-grid">
            <input
              type="number"
              placeholder="Min Age"
              value={query1Filters.filters.minAge1}
              onChange={(e) => query1Filters.updateFilter('minAge1', e.target.value)}
              className={`filter-input ${query1Filters.errors.minAge1 ? 'error' : ''}`}
              min={FILTER_CONSTRAINTS.MIN_AGE}
              max={FILTER_CONSTRAINTS.MAX_AGE}
            />
            <input
              type="number"
              placeholder="Max Age"
              value={query1Filters.filters.maxAge1}
              onChange={(e) => query1Filters.updateFilter('maxAge1', e.target.value)}
              className={`filter-input ${query1Filters.errors.maxAge1 ? 'error' : ''}`}
              min={FILTER_CONSTRAINTS.MIN_AGE}
              max={FILTER_CONSTRAINTS.MAX_AGE}
            />
            <input
              type="number"
              placeholder="Min Year"
              value={query1Filters.filters.minYear1}
              onChange={(e) => query1Filters.updateFilter('minYear1', e.target.value)}
              className={`filter-input ${query1Filters.errors.minYear1 ? 'error' : ''}`}
              min={FILTER_CONSTRAINTS.MIN_YEAR}
              max={FILTER_CONSTRAINTS.MAX_YEAR}
            />
            <input
              type="number"
              placeholder="Max Year"
              value={query1Filters.filters.maxYear1}
              onChange={(e) => query1Filters.updateFilter('maxYear1', e.target.value)}
              className={`filter-input ${query1Filters.errors.maxYear1 ? 'error' : ''}`}
              min={FILTER_CONSTRAINTS.MIN_YEAR}
              max={FILTER_CONSTRAINTS.MAX_YEAR}
            />
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
              {query1.loading ? 'Loading...' : 'Generate Map'}
            </button>
          </div>

          <div className="result-container">
            {query1.loading && <LoadingSpinner message="Loading mortality data..." />}
            {query1.error && <ErrorMessage error={query1.error} onRetry={handleQuery1Submit} />}
            {!query1.loading && !query1.error && query1.data && query1.data.length === 0 && (
              <EmptyState
                icon="🗺️"
                title="No Data Found"
                message="Try adjusting your filters to see results."
              />
            )}
            {!query1.loading && !query1.error && query1.data && query1.data.length > 0 && (
              <MapView data={query1.data} mode="heatmap" />
            )}
          </div>
        </div>

        {/* Query 2: Top Mortality Causes */}
        <div className="query-section">
          <div className="query-header">
            <h2 className="query-title">📊 Top Mortality Causes</h2>
            <p className="query-description">
              Analyze leading causes of death by age and sex demographics
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
              {query2.loading ? 'Loading...' : 'Analyze Causes'}
            </button>
          </div>

          <div className="result-container">
            {query2.loading && <LoadingSpinner message="Analyzing mortality causes..." />}
            {query2.error && <ErrorMessage error={query2.error} onRetry={handleQuery2Submit} />}
            {!query2.loading && !query2.error && query2.data && query2.data.length === 0 && (
              <EmptyState
                icon="📊"
                title="No Data Found"
                message="Try adjusting your filters to see results."
              />
            )}
            {!query2.loading && !query2.error && query2.data && query2.data.length > 0 && (
              <BarGraph data={query2.data} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PantherMortality;
