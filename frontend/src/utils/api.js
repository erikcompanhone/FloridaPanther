import { API_ENDPOINTS, HTTP_STATUS, ERROR_MESSAGES } from './constants';

/**
 * Centralized API utility for making HTTP requests
 */
class ApiService {
  /**
   * Generic POST request handler
   */
  async post(endpoint, data) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
      }
      throw error;
    }
  }

  /**
   * Telemetry Query 1: Top visited locations by sex
   */
  async fetchTelemetryHeatmap(sex) {
    if (!sex) {
      throw new Error('Sex parameter is required');
    }

    return this.post(API_ENDPOINTS.TELEMETRY_QUERY_1, { sex1: sex });
  }

  /**
   * Telemetry Query 2: Observation count per year
   */
  async fetchTelemetryTimeline(minAge, maxAge, sex) {
    if (!minAge || !maxAge || !sex) {
      throw new Error('All parameters (minAge, maxAge, sex) are required');
    }

    return this.post(API_ENDPOINTS.TELEMETRY_QUERY_2, { 
      minAge2: minAge, 
      maxAge2: maxAge, 
      sex2: sex 
    });
  }

  /**
   * Mortality Query 1: Mortality locations heatmap
   */
  async fetchMortalityHeatmap(minAge, maxAge, sex, minYear, maxYear) {
    if (!minAge || !maxAge || !sex || !minYear || !maxYear) {
      throw new Error('All parameters (minAge, maxAge, sex, minYear, maxYear) are required');
    }

    return this.post(API_ENDPOINTS.MORTALITY_QUERY_1, { 
      minAge1: minAge, 
      maxAge1: maxAge, 
      sex1: sex,
      minYear1: minYear,
      maxYear1: maxYear
    });
  }

  /**
   * Mortality Query 2: Top causes of death
   */
  async fetchMortalityCauses(minAge, maxAge, sex) {
    if (!minAge || !maxAge || !sex) {
      throw new Error('All parameters (minAge, maxAge, sex) are required');
    }

    return this.post(API_ENDPOINTS.MORTALITY_QUERY_2, { 
      minAge2: minAge, 
      maxAge2: maxAge, 
      sex2: sex 
    });
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export individual methods for convenience
export const {
  fetchTelemetryHeatmap,
  fetchTelemetryTimeline,
  fetchMortalityHeatmap,
  fetchMortalityCauses,
} = apiService;
