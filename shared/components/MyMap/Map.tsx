import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  Polyline,
} from '@react-google-maps/api';
import { environment } from '@/environments/environment';
import { mashkorMap } from '@/shared/constants/mapStyle';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '12px',
  overflow: 'hidden',
};

type Props = {
  center:
    | {
        lat: number;
        lng: number;
      }
    | {
        lat: number;
        lng: number;
      }[];
  style?: any;
  showRoute?: boolean;
  pickupIcon?: string;
  dropoffIcon?: string;
};

export default function MyMap({
  center,
  style = mashkorMap,
  showRoute = true,
  pickupIcon = '/images/pickupIcon.png',
  dropoffIcon = '/images/dropoffIcon.png',
}: Props) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: environment.GOOGLE_KEY!,
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 29.3759, lng: 47.9774 });
  const [zoom, setZoom] = useState(12);

  const isArray = Array.isArray(center);

  useEffect(() => {
    if (isArray && center.length >= 2 && mapRef.current) {
      const bounds = new google.maps.LatLngBounds();

      center.forEach((point) => {
        if (point.lat && point.lng) {
          bounds.extend(new google.maps.LatLng(point.lat, point.lng));
        }
      });

      mapRef.current.fitBounds(bounds, {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
      });
    } else if (!isArray && center.lat && center.lng) {
      setMapCenter({ lat: center.lat, lng: center.lng });
      setZoom(15);
    }
    console.log(center);
  }, [center, isArray]);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    console.log('Map Ready:', map);
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  // Prepare route coordinates if showing route and have multiple points
  const routePath =
    isArray && showRoute && center.length >= 2
      ? center.map((point) => ({ lat: point.lat, lng: point.lng }))
      : [];

  const polylineOptions = {
    strokeColor: '#4F46E5',
    strokeOpacity: 0.8,
    strokeWeight: 1,
    fillColor: '#4F46E5',
    fillOpacity: 0.1,
  };

  if (!isLoaded) {
    if (!window.google?.maps) return;
    return (
      <div
        style={containerStyle}
        className="flex items-center justify-center bg-gray-100"
      >
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-gray-600 text-sm">Loading map...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={zoom}
        options={{
          scrollwheel: false,
          disableDefaultUI: false,
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP,
          },
          mapTypeControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT,
          },
          fullscreenControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP,
          },
          styles: style,
          gestureHandling: 'greedy',
        }}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* Pickup Marker (first marker or single marker) */}
        <Marker
          position={{
            lat: isArray
              ? (center[0]?.lat ?? 29.3759)
              : (center.lat ?? 29.3759),
            lng: isArray
              ? (center[0]?.lng ?? 47.9774)
              : (center.lng ?? 47.9774),
          }}
          icon={{
            url: isArray ? pickupIcon : '/images/dropoffIcon.png',
            scaledSize: new google.maps.Size(40, 40),
            anchor: new google.maps.Point(20, 40),
          }}
          title={isArray ? 'Pickup Location' : 'Location'}
          animation={google.maps.Animation.DROP}
        />

        {/* Dropoff Marker (only if array with multiple locations) */}
        {isArray && center.length >= 2 && (
          <Marker
            position={{
              lat: center[1]?.lat ?? 29.3759,
              lng: center[1]?.lng ?? 47.9774,
            }}
            icon={{
              url: dropoffIcon,
              scaledSize: new google.maps.Size(40, 40),
              anchor: new google.maps.Point(20, 40),
            }}
            title="Dropoff Location"
            animation={google.maps.Animation.DROP}
          />
        )}

        {/* Additional markers if more than 2 locations */}
        {isArray &&
          center.length > 2 &&
          center.slice(2).map((point, index) => (
            <Marker
              key={`additional-${index}`}
              position={{
                lat: point.lat,
                lng: point.lng,
              }}
              icon={{
                url: '/images/map-marker.svg',
                scaledSize: new google.maps.Size(30, 30),
                anchor: new google.maps.Point(15, 30),
              }}
              title={`Waypoint ${index + 1}`}
              animation={google.maps.Animation.DROP}
            />
          ))}

        {/* Route polyline */}
        {routePath.length >= 2 && (
          <Polyline path={routePath} options={polylineOptions} />
        )}
      </GoogleMap>
    </div>
  );
}
