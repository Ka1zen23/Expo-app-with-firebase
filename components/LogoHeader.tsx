import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function LogoHeader() {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? 'light'].background;

  const navigation = useNavigation();
    
  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer())
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={openDrawer}
        activeOpacity={0.7}
        style={styles.menuButton}
      >
        <Ionicons name="menu" size={36} color={Colors[colorScheme ?? 'light'].text}
        />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>Bus4BN</Text>
      </View>

      <Image 
        source={require('@/assets/images/logo.png')}
        style={styles.logoImage}
      />
    </View>
  );
}
  
const styles = StyleSheet.create({ 
  container: {
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
  menuButton: {
    marginRight: 10,
    padding: 5,
  },
  logoContainer: {
    position: 'absolute',
    right: 20,
    zIndex: 1,
  }, 
  logoImage: {
    width: 60,
    height: 40,
    resizeMode: 'contain',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontFamily: 'Outfit-Bold',
    fontWeight: '600',
  },
});