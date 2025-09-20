import AnimatedOutro from "@/components/AnimatedOutro";
import { FIREBASE_AUTH } from "@/FirebaseConfig";
import { useFocusEffect } from '@react-navigation/native';
import { router } from "expo-router";
import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';

export default function SignOut() {
  const handleSignOut = async () => {
    try {
      Alert.alert(
        'Sign Out',
        'Are you sure you want to sign out?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {
              // Navigate back to previous tab if user cancels
              router.back();
            }
          },
          {
            text: 'Sign Out',
            style: 'default',
            onPress: async () => {
              try {
                await FIREBASE_AUTH.signOut();
                router.replace('/');
              } catch (error) {
                Alert.alert('Error', 'Failed to sign out. Please try again.');
              }
            },
          },
          {
            text: 'Sign Out and Delete Account',
            style: 'default',
            onPress: async () => {
              try {
                await FIREBASE_AUTH.currentUser?.delete();
                router.replace('/login');
              } catch (error) {
                Alert.alert('Error', 'Failed to delete account. Please try again.');
              }
            },
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  // Show the sign out dialog every time the tab is focused
  useFocusEffect(
    React.useCallback(() => {
      handleSignOut();
    }, [])
  );

  return (
    <View style={styles.container}>
      <AnimatedOutro />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});