import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

interface AddressPickerProps {
  onAddressSelect: (address: string, coordinates: { latitude: number; longitude: number }) => void;
}

export default function AddressPicker({ onAddressSelect }: AddressPickerProps) {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState({
    latitude: 13.0827,
    longitude: 80.2707,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const handleGeocode = async () => {
    setLoading(true);
    try {
      // Using OpenStreetMap Nominatim API (free)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        setRegion({
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        onAddressSelect(display_name, { latitude: parseFloat(lat), longitude: parseFloat(lon) });
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter address to search"
        value={address}
        onChangeText={setAddress}
      />
      <Pressable style={styles.button} onPress={handleGeocode} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Search Location</Text>
        )}
      </Pressable>
      
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        <Marker
          coordinate={{ latitude: region.latitude, longitude: region.longitude }}
          draggable
          onDragEnd={(e) => {
            setRegion({
              ...region,
              latitude: e.nativeEvent.coordinate.latitude,
              longitude: e.nativeEvent.coordinate.longitude,
            });
          }}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  map: {
    flex: 1,
    borderRadius: 8,
  },
});
