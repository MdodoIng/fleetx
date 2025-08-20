import React, { useState, useCallback } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { environment } from '@/environments/environment';
import { mashkorMap } from '@/shared/constants/mapStyle';

const containerStyle = {
  width: '100%',
  height: '400px',
};

type Props = {
  center: {
    lat: number | undefined;
    lng: number | undefined;
  };
  style?: any;
};

export default function MyMap({ center, style = mashkorMap }: Props) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: environment.GOOGLE_KEY!,
  });

  if (!isLoaded) return <p>Loading...</p>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{
        lat: center.lat ?? 29.3759,
        lng: center.lng ?? 47.9774,
      }}
      zoom={12}
      options={{
        scrollwheel: true,
        disableDefaultUI: false,
        zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_TOP },
        styles: style,
      }}
      onLoad={(map) => console.log('Map Ready:', map)}
    >
      <Marker
        position={{
          lat: center.lat ?? 0,
          lng: center.lng ?? 0,
        }}
        draggable={true}
        icon="/images/map-marker.svg" // public/ folder
      />
    </GoogleMap>
  );
}
