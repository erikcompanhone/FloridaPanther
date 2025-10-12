import { callSupabaseRPC } from './supabase';
import { ERROR_MESSAGES } from './constants';

/**
 * Centralized API utility for making Supabase RPC calls
 */
class ApiService {
  /**
   * Telemetry Query 1: Top visited locations by sex
   */
  async fetchTelemetryHeatmap(sex) {
    if (!sex) {
      throw new Error('Sex parameter is required');
    }

    try {
      const data = await callSupabaseRPC('telemetry_query_1', { sex_param: sex });
      console.log('=== TELEMETRY HEATMAP DATA ===');
      console.log('Total records:', data.length);
      console.log('First 3 records:', data.slice(0, 3));
      console.log('Lat range:', Math.min(...data.map(d => d.latitude)), 'to', Math.max(...data.map(d => d.latitude)));
      console.log('Lon range:', Math.min(...data.map(d => d.longitude)), 'to', Math.max(...data.map(d => d.longitude)));
      console.log('==============================');
      return data;
    } catch (error) {
      console.error('Error fetching telemetry heatmap:', error);
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }
  }

  /**
   * Telemetry Query 2: Observation count per year
   */
  async fetchTelemetryTimeline(minAge, maxAge, sex) {
    if (!minAge || !maxAge || !sex) {
      throw new Error('All parameters (minAge, maxAge, sex) are required');
    }

    try {
      const data = await callSupabaseRPC('telemetry_query_2', { 
        min_age: minAge, 
        max_age: maxAge, 
        sex_param: sex 
      });
      
      console.log('=== TELEMETRY TIMELINE DATA ===');
      console.log('Total records:', data.length);
      console.log('First 3 records:', data.slice(0, 3));
      console.log('===============================');
      
      // Transform snake_case to PascalCase for chart compatibility
      return data.map(row => ({
        Year: row.year,
        ObservationCount: row.observation_count
      }));
    } catch (error) {
      console.error('Error fetching telemetry timeline:', error);
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }
  }

  /**
   * Mortality Query 1: Mortality locations heatmap
   */
  async fetchMortalityHeatmap(minAge, maxAge, sex, minYear, maxYear) {
    if (!minAge || !maxAge || !sex || !minYear || !maxYear) {
      throw new Error('All parameters (minAge, maxAge, sex, minYear, maxYear) are required');
    }

    try {
      const data = await callSupabaseRPC('mortality_query_1', { 
        min_age: minAge, 
        max_age: maxAge, 
        sex_param: sex,
        min_year: minYear,
        max_year: maxYear
      });
      
      console.log('=== MORTALITY HEATMAP DATA ===');
      console.log('Total records:', data.length);
      console.log('First 5 records:', data.slice(0, 5));
      if (data.length > 0) {
        console.log('Lat range:', Math.min(...data.map(d => d.latitude)), 'to', Math.max(...data.map(d => d.latitude)));
        console.log('Lon range:', Math.min(...data.map(d => d.longitude)), 'to', Math.max(...data.map(d => d.longitude)));
      }
      console.log('==============================');
      
      return data;
    } catch (error) {
      console.error('Error fetching mortality heatmap:', error);
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }
  }

  /**
   * Mortality Query 2: Top causes of death
   */
  async fetchMortalityCauses(minAge, maxAge, sex) {
    if (!minAge || !maxAge || !sex) {
      throw new Error('All parameters (minAge, maxAge, sex) are required');
    }

    try {
      const data = await callSupabaseRPC('mortality_query_2', { 
        min_age: minAge, 
        max_age: maxAge, 
        sex_param: sex 
      });
      
      console.log('=== MORTALITY CAUSES DATA ===');
      console.log('Total records:', data.length);
      console.log('All records:', data);
      console.log('=============================');
      
      // Transform snake_case to PascalCase for chart compatibility
      return data.map(row => ({
        Cause: row.cause,
        CauseCount: row.cause_count
      }));
    } catch (error) {
      console.error('Error fetching mortality causes:', error);
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }
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
