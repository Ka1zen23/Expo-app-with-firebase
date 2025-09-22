import Colors from "@/constants/Colors";
import { UserSettings, userSettingsService } from "@/services/userSettingsService";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Alert,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";

export default function SettingsScreen() {
  const systemColorScheme = useColorScheme();
  
  const [settings, setSettings] = useState<UserSettings>({
    allowNotifications: false,
    darkMode: false,
  });

  // Use settings.darkMode if explicitly set, otherwise fall back to system preference
  const activeColorScheme = settings.darkMode === true ? "dark" : 
                            settings.darkMode === false ? "light" :
                            (systemColorScheme ?? "light");

  const colors = useMemo(
    () => ({
      border: Colors[activeColorScheme].border,
      primary: Colors[activeColorScheme].primary,
      text: Colors[activeColorScheme].text,
      background: Colors[activeColorScheme].background,
      card:
        Colors[activeColorScheme].card ||
        Colors[activeColorScheme].background,
    }),
    [activeColorScheme]
  );

  // Load & subscribe to Firestore settings
  useEffect(() => {
    const unsub = userSettingsService.subscribe((snap) => {
      if (snap) {
        setSettings(snap);
      }
    });
    return unsub;
  }, []);

  // Handler for toggles
  const handleToggle = useCallback(
    async (field: keyof UserSettings, value: boolean) => {
      try {
        setSettings((prev) => ({ ...prev, [field]: value }));
        await userSettingsService.update({ [field]: value });
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Failed to update settings");
        // Revert the local state change on error
        setSettings((prev) => ({ ...prev, [field]: !value }));
      }
    },
    []
  );

  const handleOptionPress = (optionKey: string) => {
    switch (optionKey) {
      case "about":
        Alert.alert("About", "Bus App v1.0");
        break;
      default:
        Alert.alert("Coming Soon", `${optionKey} settings coming soon!`);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#007bff" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        </View>   

        <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.mainContent}>
                <Text style={[styles.sectionHeader, { color: colors.text }]}>
                    Preferences
                </Text>
                <View style={styles.settingsContainer}>
                    {/* Allow Notifications */}
                    <View
                        style={[
                        styles.card,
                        { backgroundColor: colors.card, borderColor: colors.border },
                        ]}
                    >
                        <View style={styles.optionRowTouchable}>
                            <View style={styles.optionTextContainer}>
                                <Text style={[styles.optionTitle, { color: colors.text }]}>
                                Allow Notifications
                                </Text>
                                <Text
                                style={[
                                    styles.optionSubtitle,
                                    { color: activeColorScheme === "dark" ? "#8E8E93" : "#666" },
                                ]}
                                >
                                Receive notifications about bus routes
                                </Text>
                            </View>
                            <Switch
                                trackColor={{ false: "#767577", true: colors.primary }}
                                thumbColor={Platform.OS === "android" ? "#fff" : undefined}
                                value={settings.allowNotifications}
                                onValueChange={(value) =>
                                handleToggle("allowNotifications", value)
                                }
                            />
                        </View>
                    </View>

                    {/* Dark Mode */}
                    <View
                        style={[
                        styles.card,
                        { backgroundColor: colors.card, borderColor: colors.border },
                        ]}
                    >
                        <View style={styles.optionRowTouchable}>
                            <View style={styles.optionTextContainer}>
                                <Text style={[styles.optionTitle, { color: colors.text }]}>
                                Dark Mode
                                </Text>
                                <Text
                                style={[
                                    styles.optionSubtitle,
                                    { color: activeColorScheme === "dark" ? "#8E8E93" : "#666" },
                                ]}
                                >
                                Override system theme preference
                                </Text>
                            </View>
                            <Switch
                                trackColor={{ false: "#767577", true: colors.primary }}
                                thumbColor={Platform.OS === "android" ? "#fff" : undefined}
                                value={settings.darkMode ?? false} 
                                onValueChange={(value) =>
                                handleToggle("darkMode", value)
                                }
                            />
                        </View>
                    </View>
                </View>


                {/* Other Settings Section */}
                <Text style={[styles.sectionHeader, { color: colors.text, marginTop: 30 }]}>
                    More
                </Text>
                <View
                    style={[
                    styles.card,
                    { backgroundColor: colors.card, borderColor: colors.border },
                    ]}
                >
                    <TouchableOpacity
                    style={styles.optionRowTouchable}
                    onPress={() => handleOptionPress("about")}
                    >
                    <Text style={styles.optionIcon}>ℹ️</Text>
                    <View style={styles.optionTextContainer}>
                        <Text style={[styles.optionTitle, { color: colors.text }]}>
                        About
                        </Text>
                        <Text
                        style={[
                            styles.optionSubtitle,
                            { color: activeColorScheme === "dark" ? "#8E8E93" : "#666" },
                        ]}
                        >
                        App info, version and terms
                        </Text>
                    </View>
                    <Text
                        style={[
                        styles.chevron,
                        { color: activeColorScheme === "dark" ? "#48484A" : "#C7C7CC" },
                        ]}
                    >
                        ›
                    </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 40,
        position: 'relative',
        marginBottom: 20,
        zIndex: 10,
        paddingHorizontal: 20,
        ...Platform.select({
            ios: {
            paddingTop: 20,
            },
            android: {
            paddingTop: (StatusBar.currentHeight || 0) + 20
            },
        }),
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#007bff',
        fontFamily: 'Outfit-Medium',
    },
    scrollContent: {
        paddingBottom: 100,
    },
    mainContent: {
        padding: 20,
    },
    sectionHeader: {
        fontSize: 14,
        fontWeight: "600",
        textTransform: "uppercase",
        marginBottom: 10,
        letterSpacing: 0.5,
    },
    settingsContainer: {
        gap: 15,
        marginBottom: 20,
    },
    card: {
        borderRadius: 16,
        borderWidth: StyleSheet.hairlineWidth,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        overflow: "hidden",
    },
    optionRowTouchable: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 0, // no divider for single row
    },
    optionIcon: {
        fontSize: 22,
        marginRight: 12,
        width: 28,
        textAlign: "center",
    },
    optionTextContainer: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: "600",
    },
    optionSubtitle: {
        fontSize: 13,
        marginTop: 2,
    },
    chevron: {
        fontSize: 24,
        fontWeight: "bold",
        marginLeft: 8,
    },
});
