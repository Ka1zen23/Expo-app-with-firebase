import Colors from "@/constants/Colors";
import { busRouteService } from "@/services/busService";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddRouteScreen() {
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

  const styles = useMemo(() => StyleSheet.create({
    safeArea: { flex: 1 },
    container: { flex: 1, padding: 20 },
    mainTitle: { 
      fontSize: 28, 
      fontWeight: "bold", 
      marginBottom: 20,
      color: colors.text
    },
    input: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingVertical: 15,
      paddingHorizontal: 0,
      fontSize: 16,
      color: colors.text
    },
    addButton: {
      marginTop: 20,
      padding: 15,
      borderRadius: 20,
      alignItems: "center",
      backgroundColor: "#5C6BC0",
    },
    buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  }), [colors]);
  
  const [routeNumber, setRouteNumber] = useState("");
  const [routeName, setRouteName] = useState("");
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState("");
  const [fare, setFare] = useState("");

  const addRoute = async () => {
    const est = Number(estimatedDuration);
    const price = Number(fare);

    if (!routeNumber || !routeName || !startLocation || !endLocation || isNaN(est) || isNaN(price)) {
      alert("Please fill all fields correctly");
      return;
    }

    await busRouteService.create({
      routeNumber,
      routeName,
      startLocation,
      endLocation,
      estimatedDuration: est,
      fare: price,
    });

    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.mainTitle}>Add New Route</Text>

        <TextInput placeholder="Route No." value={routeNumber} onChangeText={setRouteNumber} style={styles.input} />
        <TextInput placeholder="Name" value={routeName} onChangeText={setRouteName} style={styles.input} />
        <TextInput placeholder="Start" value={startLocation} onChangeText={setStartLocation} style={styles.input} />
        <TextInput placeholder="End" value={endLocation} onChangeText={setEndLocation} style={styles.input} />
        <TextInput placeholder="Duration (mins)" value={estimatedDuration} onChangeText={setEstimatedDuration} keyboardType="numeric" style={styles.input} />
        <TextInput placeholder="Fare" value={fare} onChangeText={setFare} keyboardType="numeric" style={styles.input} />

        <TouchableOpacity style={styles.addButton} onPress={addRoute}>
          <Text style={styles.buttonText}>Save Route</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
