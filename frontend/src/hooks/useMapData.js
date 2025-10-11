import { useState, useEffect, useCallback } from 'react';
import { batchProjectToLatLon } from '../utils/coordinates';

/**
 * Custom hook for managing map data with projection and optimization
 */
export function useMapData(rawData) {
  const [projectedData, setProjectedData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!rawData || rawData.length === 0) {
      setProjectedData([]);
      return;
    }

    setIsProcessing(true);

    // Use requestIdleCallback for non-blocking processing
    const processData = () => {
      try {
        const projected = batchProjectToLatLon(rawData);
        setProjectedData(projected);
      } catch (error) {
        console.error('Error processing map data:', error);
        setProjectedData([]);
      } finally {
        setIsProcessing(false);
      }
    };

    // Process in next frame to avoid blocking UI
    if (window.requestIdleCallback) {
      window.requestIdleCallback(processData);
    } else {
      setTimeout(processData, 0);
    }
  }, [rawData]);

  const clearData = useCallback(() => {
    setProjectedData([]);
  }, []);

  return {
    data: projectedData,
    isProcessing,
    clearData,
    count: projectedData.length,
  };
}

export default useMapData;
