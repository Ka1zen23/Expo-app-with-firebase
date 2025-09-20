import { BusRoute, busRouteService } from "@/services/busService";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function RouteDetailScreen() {
  const { routeId } = useLocalSearchParams<{ routeId: string }>();
  const [route, setRoute] = useState<BusRoute | null>(null);

  useEffect(() => {
    if (routeId) {
      fetchRoute();
    }
  }, [routeId]);

  const fetchRoute = async () => {
    if (routeId) {
      const data = await busRouteService.getById(routeId);
      if (data) setRoute(data as BusRoute);
    }
  };

  const deleteRoute = async () => {
    if (routeId) {
      await busRouteService.delete(routeId);
      router.back();
    }
  };

  const updateFare = async () => {
    if (route) {
      await busRouteService.update(route.id, { fare: route.fare + 1 });
      fetchRoute();
    }
  };

  if (!route) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>{route.routeNumber} - {route.routeName}</Text>
        <Text style={styles.subText}>From: {route.startLocation}</Text>
        <Text style={styles.subText}>To: {route.endLocation}</Text>
        <Text style={styles.subText}>Duration: {route.estimatedDuration} mins</Text>
        <Text style={styles.subText}>Fare: ${route.fare}</Text>

        <TouchableOpacity style={styles.button} onPress={updateFare}>
          <Text style={styles.buttonText}>Increase Fare</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: "red" }]} onPress={deleteRoute}>
          <Text style={styles.buttonText}>Delete Route</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 10 },
  subText: { fontSize: 16, marginVertical: 3 },
  button: {
    marginTop: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#5C6BC0",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
