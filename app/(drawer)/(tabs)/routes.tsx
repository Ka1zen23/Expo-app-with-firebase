import Colors from "@/constants/Colors";
import { BusRoute, busRouteService } from "@/services/busService";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const colorScheme = useColorScheme();

  const textColor = Colors[colorScheme ?? 'light'].text;
  const borderColor = Colors[colorScheme ?? 'light'].border;
  const backgroundColor = Colors[colorScheme ?? 'light'].background;
  const cardColor = Colors[colorScheme ?? 'light'].card || backgroundColor;


export default function RoutesScreen() {
  const [routes, setRoutes] = useState<BusRoute[]>([]);

  useEffect(() => {
    const unsubscribe = busRouteService.subscribe((data) => setRoutes(data));
    return () => unsubscribe();
  }, []);

  const handleRoutePress = (route: BusRoute) => {
    router.push({
      pathname: "/routeDetail",
      params: { routeId: route.id },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.mainTitle}>Bus Routes</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/addRoute")}
        >
          <Text style={styles.buttonText}>+ Add Route</Text>
        </TouchableOpacity>

        <FlatList
          data={routes}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.routeContainer}
              onPress={() => handleRoutePress(item)}
            >
              <Text style={styles.routeText}>
                {item.routeNumber} - {item.routeName}
              </Text>
              <Text style={styles.subText}>
                {item.startLocation} → {item.endLocation} | ${item.fare}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text>No routes yet</Text>}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1 
  },
  container: { 
    flex: 1, 
    padding: 20 
  },
  mainTitle: { 
    fontSize: 28,
    fontFamily: 'Outfit-SemiBold',
    fontWeight: "bold", 
    marginBottom: 10,
    alignSelf: 'center',
    color: textColor
  },
  addButton: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: "#007bff",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "600" 
  },
  routeContainer: {
    padding: 15,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    marginVertical: 8,
  },
  routeText: { 
    fontSize: 18, 
    fontWeight: "600" 
  },
  subText: { 
    fontSize: 14, 
    color: "#666", 
    marginTop: 5 
  },
});
