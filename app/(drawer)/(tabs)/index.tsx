// app/(drawer)/(tabs)/index.tsx
import Colors from '@/constants/Colors';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
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

  const colors = useMemo(() => {
    const scheme = colorScheme ?? 'light';
    return {
      text: Colors[scheme].text,
      border: Colors[scheme].border,
      background: Colors[scheme].background,
      card: Colors[scheme].card || Colors[scheme].background,
      secondary: colorScheme === 'dark' ? '#aaa' : '#555',
      shadow: colorScheme === 'dark' ? Colors[scheme].text : '#000',
    };
  }, [colorScheme]);

  // dynamic styles
  const dynamicStyles = useMemo(() => StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    greeting: {
      color: colors.text,
    },
    subGreeting: {
      color: colors.text,
    },
    map: {
      borderColor: colors.border,
    },
    featureCard: {
      backgroundColor: colors.card,
      borderColor: colors.border,
      shadowColor: colors.shadow,
    },
    featureTitle: {
      color: colors.text,
    },
    featureDescription: {
      color: colors.secondary,
    },
  }), [colors]);

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
    <View style={[styles.container, dynamicStyles.container]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting Section */}
        <View style={styles.greetingContainer}>
          <Text style={[styles.greeting, dynamicStyles.greeting]}>Welcome back 👋</Text>
          <Text style={[styles.subGreeting, dynamicStyles.subGreeting]}>Find your next bus journey</Text>
        </View>

        {/* Map Section */}
        <View style={styles.mapContainer}>
          <MapView
            style={[styles.map, dynamicStyles.map]}
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
              style={[styles.featureCard, dynamicStyles.featureCard]}
              onPress={() => handleFeaturePress(item.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.featureTitle, dynamicStyles.featureTitle]}>{item.label}</Text>
              <Text style={[styles.featureDescription, dynamicStyles.featureDescription]}>
                {item.desc}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// Static styles
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
