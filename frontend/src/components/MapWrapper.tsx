import { useState } from 'react';
import Map, { Source, Layer, LayerProps, Marker, MarkerProps } from 'react-map-gl';
import { MapMouseEvent } from 'react-map-gl/dist/esm/types';
import { Feature } from 'geojson';
import { getRandomPoints } from '../requests/randomPoints';

export default function MapWrapper() {
  const [isDragged, setIsDragged] = useState(false);
  const [areaRectStart, setAreaRectStart] = useState([0, 0]);
  const [areaRectEnd, setAreaRectEnd] = useState([0, 0]);
  const [vertices, setVertices] = useState([[[0, 0]]]);
  const [markers, setMarkers] = useState<MarkerProps[]>([]);

  const onMapMouseDown = (event: MapMouseEvent) => {
    // Check if the right mouse button is pressed
    if (event.originalEvent.button === 2) {
      event.preventDefault();
      setAreaRectStart([event.lngLat.lng, event.lngLat.lat]);
      setAreaRectEnd([event.lngLat.lng, event.lngLat.lat]);
      setIsDragged(true);
    }
  };

  const onMapMouseMove = (event: MapMouseEvent) => {
    if (isDragged) {
      setAreaRectEnd([event.lngLat.lng, event.lngLat.lat]);
      updateAreaRectPoints();
    }
  };

  const onMapMouseUp = async (event: MapMouseEvent) => {
    // Check if the right mouse button is pressed
    if (event.originalEvent.button === 2) {
      setIsDragged(false);

      const randomMarkers = await getRandomPoints(areaRectStart, areaRectEnd, 5);
      
      setMarkers(randomMarkers);
    }
  };

  const updateAreaRectPoints = () => {
    // https://www.rfc-editor.org/rfc/rfc7946#section-3.1.6
    setVertices([[
      areaRectStart,
      [areaRectStart[0], areaRectEnd[1]],
      areaRectEnd,
      [areaRectEnd[0], areaRectStart[1]],
      areaRectStart,
    ]]);
  };

  const geojson: Feature = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: vertices
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
      style = {{ height: '100vh' }}
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

      { markers.map((markerData, idx) => 
        <Marker {...markerData} key = {idx} />
      )}
    </Map>
  );
}
