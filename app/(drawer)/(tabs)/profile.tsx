// app/(drawer)/profile.tsx
import { FIREBASE_AUTH } from '@/FirebaseConfig';
import Colors from '@/constants/Colors';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useMemo } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';

import { useUserProfile } from '@/components/UserProfileContext';

const PROFILE_IMAGE_SIZE = 150;
const BORDER_WIDTH = 3;

export default function ProfileScreen() {
  // All hooks must be called at the top level
  const { 
    profileImage, 
    setProfileImage, 
    userName, 
    userEmail, 
    isLoading,
    setUserName, 
    setUserEmail 
  } = useUserProfile();
  const colorScheme = useColorScheme();

  // Memoize theme colors to prevent unnecessary recalculations
  const colors = useMemo(() => ({
    border: Colors[colorScheme ?? 'light'].border,
    primary: Colors[colorScheme ?? 'light'].primary,
    text: Colors[colorScheme ?? 'light'].text,
    background: Colors[colorScheme ?? 'light'].background,
    card: Colors[colorScheme ?? 'light'].card || Colors[colorScheme ?? 'light'].background,
  }), [colorScheme]);

  const user = FIREBASE_AUTH.currentUser;

  // Safe early return after all hooks are declared
  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>Please sign in</Text>
        </View>
      </View>
    );
  }

  // User-dependent values after the check
  const displayName = userName || user?.displayName || user?.email?.split('@')[0] || 'User';
  const displayEmail = userEmail || user?.email || 'user@example.com';

  const pickImage = useCallback(async () => {
    if (isLoading) return; // Use context loading state

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'We need camera roll permissions to update your profile picture.',
          [{ text: 'OK' }]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        try {
          await setProfileImage(result.assets[0].uri);
          Alert.alert('Success', 'Profile picture updated successfully!');
        } catch (error) {
          console.error('Profile image upload error:', error);
          
          // More specific error messages based on error type
          let errorMessage = 'Failed to upload profile picture. Please try again.';
          if (error instanceof Error) {
            if (error.message.includes('storage/unknown')) {
              errorMessage = 'Storage error. Please check your internet connection and Firebase settings.';
            } else if (error.message.includes('User not authenticated')) {
              errorMessage = 'Please sign in again to update your profile picture.';
            }
          }
          
          Alert.alert('Upload Failed', errorMessage);
        }
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  }, [setProfileImage, isLoading]);

  const handleOptionPress = useCallback((optionKey: string) => {
    console.log(`Option pressed: ${optionKey}`);
    
    switch (optionKey) {
      case 'editProfile':
        // TODO: Navigate to edit profile screen
        Alert.alert('Coming Soon', 'Edit profile feature will be available soon!');
        break;
      case 'notifications':
        // TODO: Navigate to notifications settings
        Alert.alert('Coming Soon', 'Notification settings will be available soon!');
        break;
      case 'paymentMethods':
        // TODO: Navigate to payment methods
        Alert.alert('Coming Soon', 'Payment methods will be available soon!');
        break;
      case 'travelHistory':
        // TODO: Navigate to travel history
        Alert.alert('Coming Soon', 'Travel history will be available soon!');
        break;
      case 'savedRoutes':
        // TODO: Navigate to saved routes
        Alert.alert('Coming Soon', 'Saved routes will be available soon!');
        break;
      case 'helpSupport':
        // TODO: Navigate to help & support
        Alert.alert('Coming Soon', 'Help & support will be available soon!');
        break;
      default:
        console.log('Unknown option:', optionKey);
    }
  }, []);

  const profileOptions = [
    {
      key: 'editProfile',
      icon: '👤',
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
    },
    {
      key: 'notifications',
      icon: '🔔',
      title: 'Notifications',
      subtitle: 'Manage your notification preferences',
    },
    {
      key: 'paymentMethods',
      icon: '💳',
      title: 'Payment Methods',
      subtitle: 'Manage your payment options',
    },
    {
      key: 'travelHistory',
      icon: '🎫',
      title: 'Travel History',
      subtitle: 'View your past journeys',
    },
    {
      key: 'savedRoutes',
      icon: '⭐',
      title: 'Saved Routes',
      subtitle: 'Your favorite bus routes',
    },
    {
      key: 'helpSupport',
      icon: '❓',
      title: 'Help & Support',
      subtitle: 'Get help with your account',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContent}>          
          {/* Profile Card */}
          <View style={[styles.profileCard, { 
            backgroundColor: colors.card,
            shadowColor: colorScheme === 'dark' ? colors.text : '#000'
          }]}>
            <TouchableOpacity 
              style={[styles.profilePictureContainer, { borderColor: colors.border }]} 
              onPress={pickImage}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <Image 
                source={profileImage}
                style={styles.profilePicture}
                contentFit="cover"
              />
              <View style={[styles.cameraOverlay, { 
                backgroundColor: colors.primary,
                borderColor: colorScheme === 'dark' ? '#1c1c1e' : 'white'
              }]}>
                {isLoading ? (
                  <Text style={styles.cameraIcon}>⏳</Text>
                ) : (
                  <Text style={styles.cameraIcon}>📷</Text>
                )}
              </View>
            </TouchableOpacity>
            
            <Text style={[styles.profileTitle, { color: colors.text }]}>
              {displayName}
            </Text>
            <Text style={[styles.profileSubtitle, { 
              color: colorScheme === 'dark' ? '#8E8E93' : '#666' 
            }]}>
              {displayEmail}
            </Text>
            
            {isLoading && (
              <Text style={[styles.uploadingText, { color: colors.primary }]}>
                Uploading profile picture...
              </Text>
            )}
          </View>

          {/* Profile Options */}
          <View style={[
            styles.profileOptions, 
            { backgroundColor: colors.card },
            Platform.select({
              ios: { shadowColor: colorScheme === 'dark' ? colors.text : '#000' },
              android: { elevation: 3 }
            })
          ]}>
            {profileOptions.map((option, index) => (
              <TouchableOpacity 
                key={option.key}
                style={[styles.optionItem, { 
                  borderBottomColor: index === profileOptions.length - 1 ? 'transparent' : colors.border 
                }]}
                onPress={() => handleOptionPress(option.key)}
                activeOpacity={0.7}
              >
                <Text style={styles.optionIcon}>{option.icon}</Text>
                <View style={styles.optionTextContainer}>
                  <Text style={[styles.optionTitle, { color: colors.text }]}>
                    {option.title}
                  </Text>
                  <Text style={[styles.optionSubtitle, { 
                    color: colorScheme === 'dark' ? '#8E8E93' : '#666' 
                  }]}>
                    {option.subtitle}
                  </Text>
                </View>
                <Text style={[styles.chevron, { 
                  color: colorScheme === 'dark' ? '#48484A' : '#C7C7CC' 
                }]}>
                  ›
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loadingText: { 
    fontSize: 16, 
    fontFamily: 'Outfit-Regular' 
  },
  scrollContent: { 
    paddingBottom: 100 
  },
  mainContent: { 
    padding: 20 
  },
  profileCard: {
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  profilePictureContainer: {
    position: 'relative',
    borderRadius: PROFILE_IMAGE_SIZE / 2,
    width: PROFILE_IMAGE_SIZE,
    height: PROFILE_IMAGE_SIZE,
    borderWidth: BORDER_WIDTH,
    marginBottom: 16,
  },
  profilePicture: {
    borderRadius: (PROFILE_IMAGE_SIZE - BORDER_WIDTH * 2) / 2,
    width: PROFILE_IMAGE_SIZE - BORDER_WIDTH * 2,
    height: PROFILE_IMAGE_SIZE - BORDER_WIDTH * 2,
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  cameraIcon: { 
    fontSize: 18 
  },
  profileTitle: {
    fontSize: 24,
    fontFamily: 'Outfit-Bold',
    fontWeight: '600',
    marginBottom: 4,
  },
  profileSubtitle: { 
    fontSize: 16, 
    fontFamily: 'Outfit-Regular' 
  },
  uploadingText: {
    fontSize: 14,
    fontFamily: 'Outfit-Regular',
    marginTop: 8,
    fontStyle: 'italic',
  },
  profileOptions: {
    borderRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionIcon: { 
    fontSize: 24, 
    marginRight: 16, 
    width: 30 
  },
  optionTextContainer: { 
    flex: 1 
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    fontWeight: '600',
    marginBottom: 2,
  },
  optionSubtitle: { 
    fontSize: 14, 
    fontFamily: 'Outfit-Regular' 
  },
  chevron: { 
    fontSize: 24, 
    fontWeight: 'bold' 
  },
});