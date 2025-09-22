import Colors from "@/constants/Colors";
import { BusRoute, busRouteService } from "@/services/busService";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RoutesScreen() {
  const colorScheme = useColorScheme();
  const [routes, setRoutes] = useState<BusRoute[]>([]);

  const colors = useMemo(() => {
    const scheme = colorScheme ?? 'light';
    return {
      text: Colors[scheme].text,
      border: Colors[scheme].border,
      background: Colors[scheme].background,
      card: Colors[scheme].card || Colors[scheme].background,
      secondaryText: colorScheme === 'dark' ? '#aaa' : '#666',
      shadow: colorScheme === 'dark' ? Colors[scheme].text : '#000',
    };
  }, [colorScheme]);

  // Dynamic styles that depend on theme/colors
  const dynamicStyles = useMemo(() => StyleSheet.create({
    safeArea: {
      backgroundColor: colors.background,
    },
    container: {
      backgroundColor: colors.background,
    },
    mainTitle: {
      color: colors.text,
    },
    routeContainer: {
      backgroundColor: colors.card,
      shadowColor: colors.shadow,
    },
    routeText: {
      color: colors.text,
    },
    subText: {
      color: colors.secondaryText,
    },
    emptyText: {
      color: colors.secondaryText,
    },
  }), [colors]);

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

  const renderRouteItem = ({ item }: { item: BusRoute }) => (
    <TouchableOpacity
      style={[staticStyles.routeContainer, dynamicStyles.routeContainer]}
      onPress={() => handleRoutePress(item)}
    >
      <Text style={[staticStyles.routeText, dynamicStyles.routeText]}>
        {item.routeNumber} - {item.routeName}
      </Text>
      <Text style={[staticStyles.subText, dynamicStyles.subText]}>
        {item.startLocation} → {item.endLocation} | ${item.fare}
      </Text>
    </TouchableOpacity>
  );

  const renderEmptyComponent = () => (
    <Text style={[staticStyles.emptyText, dynamicStyles.emptyText]}>
      No routes yet
    </Text>
  );

  return (
    <SafeAreaView style={[staticStyles.safeArea, dynamicStyles.safeArea]}>
      <View style={[staticStyles.container, dynamicStyles.container]}>
        <Text style={[staticStyles.mainTitle, dynamicStyles.mainTitle]}>
          Bus Routes
        </Text>

        <TouchableOpacity
          style={staticStyles.addButton}
          onPress={() => router.push("/addRoute")}
        >
          <Text style={staticStyles.buttonText}>+ Add Route</Text>
        </TouchableOpacity>

        <FlatList
          data={routes}
          renderItem={renderRouteItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={renderEmptyComponent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

// Static styles that never change regardless of theme
const staticStyles = StyleSheet.create({
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
    borderRadius: 10,
    marginVertical: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  routeText: { 
    fontSize: 18, 
    fontWeight: "600" 
  },
  subText: { 
    fontSize: 14, 
    marginTop: 5 
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
    fontFamily: 'Outfit-Regular',
  },
});
