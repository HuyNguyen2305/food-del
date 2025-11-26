import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';

const OrderScreen = () => {
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  
  // Your Google Maps API key
  const GOOGLE_MAPS_API_KEY = 'AIzaSyDQLtXig0yiN7QXBgg7wImbNEH6tMvR7m0';
  
  // Client location (random coordinate in Ho Chi Minh City area)
  const clientLocation = { lat: 10.7829, lng: 106.6958 }; // Example client location

  // Get user's current location
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'Please enable location services to show your current position on the map.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setUserLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
      
      console.log('User location:', location.coords);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Location Error', 'Unable to get your current location. Using default location.');
    }
  };
  
  const createMapHTML = () => {
    const shipperLat = userLocation?.lat || 10.7769;
    const shipperLng = userLocation?.lng || 106.6917;
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Delivery Navigation</title>
      <style>
        body { margin: 0; padding: 0; }
        #map { height: 100vh; width: 100vw; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      
      <script>
        function initMap() {
          const map = new google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: { lat: ${shipperLat}, lng: ${shipperLng} }
          });
          
          // Add shipper marker
          new google.maps.Marker({
            position: { lat: ${shipperLat}, lng: ${shipperLng} },
            map: map,
            title: 'Your Location',
            icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
          });
          
          // Add client marker
          new google.maps.Marker({
            position: { lat: ${clientLocation.lat}, lng: ${clientLocation.lng} },
            map: map,
            title: 'Client Location',
            icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
          });
          
          // Draw route
          drawRoute(map);
        }
        
        function drawRoute(map) {
          try {
            const directionsService = new google.maps.DirectionsService();
            const directionsRenderer = new google.maps.DirectionsRenderer({
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: '#4285f4',
                strokeWeight: 4,
                strokeOpacity: 0.8
              }
            });
            
            directionsRenderer.setMap(map);
            
            directionsService.route({
              origin: { lat: ${shipperLat}, lng: ${shipperLng} },
              destination: { lat: ${clientLocation.lat}, lng: ${clientLocation.lng} },
              travelMode: google.maps.TravelMode.DRIVING
            }, function(result, status) {
              if (status === 'OK' && result) {
                directionsRenderer.setDirections(result);
              } else {
                // Fallback: Simple polyline
                const line = new google.maps.Polyline({
                  path: [
                    { lat: ${shipperLat}, lng: ${shipperLng} },
                    { lat: ${clientLocation.lat}, lng: ${clientLocation.lng} }
                  ],
                  geodesic: true,
                  strokeColor: '#FF6B6B',
                  strokeOpacity: 1.0,
                  strokeWeight: 3
                });
                
                line.setMap(map);
              }
            });
          } catch (error) {
            // If anything fails, just show the fallback line
            const line = new google.maps.Polyline({
              path: [
                { lat: ${shipperLat}, lng: ${shipperLng} },
                { lat: ${clientLocation.lat}, lng: ${clientLocation.lng} }
              ],
              geodesic: true,
              strokeColor: '#FF6B6B',
              strokeOpacity: 1.0,
              strokeWeight: 3
            });
            
            line.setMap(map);
          }
        }
      </script>
      
      <script async defer
        src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap">
      </script>
    </body>
    </html>
    `;
  };

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ html: createMapHTML() }}
        style={styles.webView}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        bounces={false}
        scrollEnabled={false}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  webView: {
    flex: 1,
  },
});

export default OrderScreen;
