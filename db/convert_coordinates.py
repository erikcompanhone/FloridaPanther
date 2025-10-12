#!/usr/bin/env python3
"""
Coordinate conversion script using pyproj library.
Converts State Plane Florida East (feet) to WGS84 lat/lon.
"""
import sys
from pyproj import Transformer

# Create transformer from State Plane Florida East (NAD83 HARN, US Survey feet) to WGS84
# EPSG:3087 = NAD83(HARN) / Florida GDL Albers (meters)
# EPSG:4326 = WGS84 (latitude, longitude)
transformer = Transformer.from_crs("EPSG:3087", "EPSG:4326", always_xy=True)

def convert_stateplane_to_latlon(x, y):
    """
    Convert State Plane Florida East coordinates (feet) to lat/lon.
    
    Args:
        x: Easting in feet
        y: Northing in feet
    
    Returns:
        tuple: (latitude, longitude)
    """
    # Transform expects (x, y) and returns (lon, lat) when always_xy=True
    lon, lat = transformer.transform(x, y)
    return lat, lon

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python convert_coordinates.py <x> <y>")
        sys.exit(1)
    
    x = float(sys.argv[1])
    y = float(sys.argv[2])
    
    lat, lon = convert_stateplane_to_latlon(x, y)
    
    # Output format: latitude,longitude
    print(f"{lat},{lon}")
