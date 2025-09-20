// app/(drawer)/(tabs)/index.tsx
import Colors from '@/constants/Colors';
import { router } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import MapView from 'react-native-maps';

export default function HomeScreen() {
  const colorScheme = useColorScheme();

  const textColor = Colors[colorScheme ?? 'light'].text;
  const borderColor = Colors[colorScheme ?? 'light'].border;
  const backgroundColor = Colors[colorScheme ?? 'light'].background;
  const cardColor = Colors[colorScheme ?? 'light'].card || backgroundColor;

  const handleFeaturePress = (feature: string) => {
    console.log(`Feature pressed: ${feature}`);
    
    switch (feature) {
      case 'routes':
        router.push('/(drawer)/(tabs)/routes');
        break;
      case 'tickets':
        router.push('/(drawer)/(tabs)/tickets');
        break;
      default:
        console.log(`No route defined for feature: ${feature}`);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting Section */}
        <View style={styles.greetingContainer}>
          <Text style={[styles.greeting, { color: textColor }]}>Welcome back 👋</Text>
          <Text style={[styles.subGreeting, { color: textColor }]}>Find your next bus journey</Text>
        </View>

        {/* Map Section */}
        <View style={styles.mapContainer}>
          <MapView
            style={[styles.map, { borderColor }]}
            initialRegion={{
              latitude: 4.977386714102847,
              longitude: 114.89991961316908,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            mapType="standard"
            showsUserLocation={true}
            showsMyLocationButton={true}
          />
        </View>

        {/* Feature Grid */}
        <View style={styles.featureGrid}>
          {[
            { label: '🚌 Bus Routes', desc: 'Find the best routes', key: 'routes' },
            { label: '🕒 Schedules', desc: 'Check real-time schedules', key: 'schedules' },
            { label: '📍 Stops', desc: 'Locate nearby stops', key: 'stops' },
            { label: '🎫 Tickets', desc: 'Purchase & manage tickets', key: 'tickets' },
          ].map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.featureCard,
                { 
                  backgroundColor: cardColor, 
                  borderColor, 
                  shadowColor: colorScheme === 'dark' ? textColor : '#000'
                },
              ]}
              onPress={() => handleFeaturePress(item.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.featureTitle, { color: textColor }]}>{item.label}</Text>
              <Text style={[styles.featureDescription, { 
                color: colorScheme === 'dark' ? '#aaa' : '#555' 
              }]}>
                {item.desc}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  greetingContainer: {
    marginBottom: 25,
  },
  greeting: {
    fontSize: 28,
    fontFamily: 'Outfit-SemiBold',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    opacity: 0.7,
  },
  mapContainer: {
    marginBottom: 25,
  },
  map: {
    width: '100%',
    height: 300,
    borderWidth: 2,
    borderRadius: 16,
    overflow: 'hidden',
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  featureCard: {
    padding: 20,
    borderRadius: 16,
    width: '48%',
    marginBottom: 15,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 0.5,
  },
  featureTitle: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 22,
    fontFamily: 'Outfit-SemiBold',
  },
  featureDescription: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Outfit-Regular',
  },
});