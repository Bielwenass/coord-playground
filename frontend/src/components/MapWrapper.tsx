import React, { useState } from 'react';
import Map, { Source, Layer, LayerProps } from 'react-map-gl';
import { MapMouseEvent } from 'react-map-gl/dist/esm/types';
import { Feature } from 'geojson';

export default function MapWrapper() {
  const [isDragged, isDraggedSet] = useState(false);
  const [areaRectStart, areaRectStartSet] = useState([0, 0]);
  const [areaRectEnd, areaRectEndSet] = useState([0, 0]);
  const [points, setPoints] = useState([[[0, 0]]]);

  const onMapMouseDown = (event: MapMouseEvent) => {
    // Check if the right mouse button is pressed
    if (event.originalEvent.button === 2) {
      event.preventDefault();
      areaRectStartSet([event.lngLat.lng, event.lngLat.lat]);
      isDraggedSet(true);
    }
  }

  const onMapMouseMove = (event: MapMouseEvent) => {
    if (isDragged) {
      areaRectEndSet([event.lngLat.lng, event.lngLat.lat]);
      updateAreaRectPoints();
    }
  }

  const onMapMouseUp = (event: MapMouseEvent) => {
    // Check if the right mouse button is pressed
    if (event.originalEvent.button === 2) {
      isDraggedSet(false);
    }
  }

  const updateAreaRectPoints = () => {
    // https://www.rfc-editor.org/rfc/rfc7946#section-3.1.6
    setPoints([[
      areaRectStart,
      [areaRectStart[0], areaRectEnd[1]],
      areaRectEnd,
      [areaRectEnd[0], areaRectStart[1]],
      areaRectStart,
    ]])
  }

  const geojson: Feature = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: points
    },
    properties: {}
  };

  const layerStyle: LayerProps = {
    id: 'area',
    type: 'fill',
    paint: {
      'fill-color': '#888800',
      'fill-opacity': 0.3
    }
  };

  return (
    <Map
      initialViewState = {{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14
      }}
      style = {{ height: "100vh" }}
      mapStyle = "mapbox://styles/mapbox/streets-v11"
      onMouseDown = {onMapMouseDown}
      onMouseMove = {onMapMouseMove}
      onMouseUp = {onMapMouseUp}
      pitchWithRotate = {false}
    >
      <Source
        type = "geojson"
        data = {geojson}>
        <Layer {...layerStyle} />
      </Source>
    </Map>
  );
}
