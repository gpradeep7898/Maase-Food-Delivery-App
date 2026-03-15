import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { UserLocation } from '../types';

const LOCATION_KEY = '@maase_location';

export function useLocation() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(LOCATION_KEY).then(raw => {
      if (raw) {
        try { setLocation(JSON.parse(raw)); } catch { /* ignore */ }
      }
    });
  }, []);

  async function requestLocation(): Promise<UserLocation | null> {
    setLoading(true);
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        return null;
      }
      const coords = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const geocode = await Location.reverseGeocodeAsync({
        latitude: coords.coords.latitude,
        longitude: coords.coords.longitude,
      });
      const place = geocode[0];
      const userLoc: UserLocation = {
        lat: coords.coords.latitude,
        lng: coords.coords.longitude,
        area: place?.district ?? place?.subregion ?? place?.city ?? 'Your area',
        city: place?.city ?? 'Hyderabad',
      };
      await saveLocation(userLoc);
      return userLoc;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to get location');
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function saveLocation(loc: UserLocation) {
    setLocation(loc);
    await AsyncStorage.setItem(LOCATION_KEY, JSON.stringify(loc));
  }

  async function clearLocation() {
    setLocation(null);
    await AsyncStorage.removeItem(LOCATION_KEY);
  }

  return { location, loading, error, requestLocation, saveLocation, clearLocation };
}
