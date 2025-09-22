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

  const colors = useMemo(() => ({
    border: Colors[colorScheme ?? 'light'].border,
    primary: Colors[colorScheme ?? 'light'].primary,
    text: Colors[colorScheme ?? 'light'].text,
    background: Colors[colorScheme ?? 'light'].background,
    card: Colors[colorScheme ?? 'light'].card || Colors[colorScheme ?? 'light'].background,
    secondaryText: colorScheme === 'dark' ? '#8E8E93' : '#666',
    chevron: colorScheme === 'dark' ? '#48484A' : '#C7C7CC',
    shadow: colorScheme === 'dark' ? Colors[colorScheme].text : '#000',
    cameraOverlayBorder: colorScheme === 'dark' ? '#1c1c1e' : 'white',
  }), [colorScheme]);

  // Dynamic styles
  const dynamicStyles = useMemo(() => StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    loadingText: {
      color: colors.text,
    },
    profileCard: {
      backgroundColor: colors.card,
      shadowColor: colors.shadow,
    },
    profilePictureContainer: {
      borderColor: colors.border,
    },
    cameraOverlay: {
      backgroundColor: colors.primary,
      borderColor: colors.cameraOverlayBorder,
    },
    profileTitle: {
      color: colors.text,
    },
    profileSubtitle: {
      color: colors.secondaryText,
    },
    uploadingText: {
      color: colors.primary,
    },
    profileOptions: {
      backgroundColor: colors.card,
      ...Platform.select({
        ios: { shadowColor: colors.shadow },
        android: {},
      }),
    },
    optionTitle: {
      color: colors.text,
    },
    optionSubtitle: {
      color: colors.secondaryText,
    },
    chevron: {
      color: colors.chevron,
    },
    optionItemBorder: {
      borderBottomColor: colors.border,
    },
  }), [colors]);

  const user = FIREBASE_AUTH.currentUser;

  if (!user) {
    return (
      <View style={[staticStyles.container, dynamicStyles.container]}>
        <View style={staticStyles.loadingContainer}>
          <Text style={[staticStyles.loadingText, dynamicStyles.loadingText]}>Please sign in</Text>
        </View>
      </View>
    );
  }

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
        Alert.alert('Coming Soon', 'Edit profile feature will be available soon!');
        break;
      case 'notifications':
        Alert.alert('Coming Soon', 'Notification settings will be available soon!');
        break;
      case 'paymentMethods':
        Alert.alert('Coming Soon', 'Payment methods will be available soon!');
        break;
      case 'travelHistory':
        Alert.alert('Coming Soon', 'Travel history will be available soon!');
        break;
      case 'savedRoutes':
        Alert.alert('Coming Soon', 'Saved routes will be available soon!');
        break;
      case 'helpSupport':
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
    <View style={[staticStyles.container, dynamicStyles.container]}>
      <ScrollView 
        contentContainerStyle={staticStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={staticStyles.mainContent}>          
          <View style={[staticStyles.profileCard, dynamicStyles.profileCard]}>
            <TouchableOpacity 
              style={[staticStyles.profilePictureContainer, dynamicStyles.profilePictureContainer]} 
              onPress={pickImage}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <Image 
                source={profileImage}
                style={staticStyles.profilePicture}
                contentFit="cover"
              />
              <View style={[staticStyles.cameraOverlay, dynamicStyles.cameraOverlay]}>
                {isLoading ? (
                  <Text style={staticStyles.cameraIcon}>⏳</Text>
                ) : (
                  <Text style={staticStyles.cameraIcon}>📷</Text>
                )}
              </View>
            </TouchableOpacity>
            
            <Text style={[staticStyles.profileTitle, dynamicStyles.profileTitle]}>
              {displayName}
            </Text>
            <Text style={[staticStyles.profileSubtitle, dynamicStyles.profileSubtitle]}>
              {displayEmail}
            </Text>
            
            {isLoading && (
              <Text style={[staticStyles.uploadingText, dynamicStyles.uploadingText]}>
                Uploading profile picture...
              </Text>
            )}
          </View>

          <View style={[staticStyles.profileOptions, dynamicStyles.profileOptions]}>
            {profileOptions.map((option, index) => (
              <TouchableOpacity 
                key={option.key}
                style={[
                  staticStyles.optionItem, 
                  index === profileOptions.length - 1 ? null : dynamicStyles.optionItemBorder
                ]}
                onPress={() => handleOptionPress(option.key)}
                activeOpacity={0.7}
              >
                <Text style={staticStyles.optionIcon}>{option.icon}</Text>
                <View style={staticStyles.optionTextContainer}>
                  <Text style={[staticStyles.optionTitle, dynamicStyles.optionTitle]}>
                    {option.title}
                  </Text>
                  <Text style={[staticStyles.optionSubtitle, dynamicStyles.optionSubtitle]}>
                    {option.subtitle}
                  </Text>
                </View>
                <Text style={[staticStyles.chevron, dynamicStyles.chevron]}>
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

// Static styles
const staticStyles = StyleSheet.create({
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
