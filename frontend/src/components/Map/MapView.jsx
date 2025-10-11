import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import { projectToLatLon } from '../../utils/coordinates';
import { MAP_CONFIG, HEATMAP_CONFIG, CLUSTER_CONFIG } from '../../utils/constants';
import './MapView.css';

// Component to handle map updates
function MapUpdater({ data, mode = 'heatmap' }) {
  const map = useMap();
  const heatLayerRef = useRef(null);
  const clusterLayerRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Clear existing layers
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }
    if (clusterLayerRef.current) {
      map.removeLayer(clusterLayerRef.current);
      clusterLayerRef.current = null;
    }

    // Process data
    const processedData = data
      .map(point => {
        const coords = projectToLatLon(point.X || point.x, point.Y || point.y);
        if (!coords) return null;
        return {
          ...point,
          lat: coords[0],
          lon: coords[1],
          intensity: point.VisitCount || point.visit_count || point.CauseCount || point.cause_count || 1
        };
      })
      .filter(Boolean);

    if (processedData.length === 0) return;

    if (mode === 'heatmap') {
      // Heatmap mode
      const heatData = processedData.map(p => [
        p.lat,
        p.lon,
        p.intensity
      ]);

      heatLayerRef.current = L.heatLayer(heatData, {
        radius: HEATMAP_CONFIG.RADIUS,
        blur: HEATMAP_CONFIG.BLUR,
        maxZoom: HEATMAP_CONFIG.MAX_ZOOM,
        minOpacity: HEATMAP_CONFIG.MIN_OPACITY,
        max: Math.max(...heatData.map(p => p[2] || 1), 1),
        gradient: HEATMAP_CONFIG.GRADIENT
      }).addTo(map);
    } else {
      // Cluster mode (better for large datasets)
      clusterLayerRef.current = L.markerClusterGroup({
        maxClusterRadius: CLUSTER_CONFIG.MAX_CLUSTER_RADIUS,
        disableClusteringAtZoom: CLUSTER_CONFIG.DISABLED_AT_ZOOM,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true
      });

      processedData.forEach(point => {
        const marker = L.circleMarker([point.lat, point.lon], {
          radius: 6,
          fillColor: '#FFD700',
          color: '#fff',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.7
        });

        // Add popup with data
        const popupContent = `
          <div class="marker-popup">
            <strong>Location:</strong> ${point.lat.toFixed(4)}°N, ${Math.abs(point.lon).toFixed(4)}°W<br>
            ${point.intensity > 1 ? `<strong>Count:</strong> ${point.intensity}<br>` : ''}
            ${point.Cause || point.cause ? `<strong>Cause:</strong> ${point.Cause || point.cause}` : ''}
          </div>
        `;
        marker.bindPopup(popupContent);

        clusterLayerRef.current.addLayer(marker);
      });

      map.addLayer(clusterLayerRef.current);
    }

    // Fit bounds to show all data
    if (processedData.length > 0) {
      const bounds = L.latLngBounds(processedData.map(p => [p.lat, p.lon]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    // Cleanup
    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
      }
      if (clusterLayerRef.current) {
        map.removeLayer(clusterLayerRef.current);
      }
    };
  }, [data, mode, map]);

  return null;
}

function MapView({ data, mode = 'heatmap' }) {
  return (
    <div className="map-view-container">
      <MapContainer
        center={MAP_CONFIG.CENTER}
        zoom={MAP_CONFIG.DEFAULT_ZOOM}
        minZoom={MAP_CONFIG.MIN_ZOOM}
        maxZoom={MAP_CONFIG.MAX_ZOOM}
        className="map-view"
        scrollWheelZoom={true}
      >
        <TileLayer
          url={MAP_CONFIG.TILE_URL}
          attribution={MAP_CONFIG.ATTRIBUTION}
        />
        <MapUpdater data={data} mode={mode} />
      </MapContainer>
      {data && data.length > 0 && (
        <div className="map-legend">
          <strong>{data.length}</strong> data points
        </div>
      )}
    </div>
  );
}

export default MapView;
