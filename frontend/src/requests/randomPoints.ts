import axios from 'axios';
import { MarkerProps } from 'react-map-gl';

export const getRandomPoints = async (
  vertexA: number[],
  vertexB: number[],
  count: number
): Promise<MarkerProps[]> => {
  const pointsResponse = await axios.get(`${process.env.REACT_APP_SERVER_URL}/random`, {
    params: {
      latA: vertexA[1],
      lngA: vertexA[0],
      latB: vertexB[1],
      lngB: vertexB[0],
      count
    }
  });

  if (pointsResponse.status === 200) {
    return pointsResponse.data.map((e: { lng: number; lat: number }) => {
      return {
        longitude: e.lng,
        latitude: e.lat
      };
    });
  } else {
    return [];
  }
};
