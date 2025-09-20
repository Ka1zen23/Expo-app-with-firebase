import { FIREBASE_AUTH, FIREBASE_STORAGE } from '@/FirebaseConfig';
import { updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface UserProfileContextType {
  profileImage: any;
  setProfileImage: (uri: string) => Promise<void>;
  userName: string;
  userEmail: string;
  setUserName: (name: string) => void;
  setUserEmail: (email: string) => void;
  isLoading: boolean;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

interface UserProfileProviderProps {
  children: ReactNode;
}

export const UserProfileProvider = ({ children }: UserProfileProviderProps) => {
  const [profileImage, setProfileImageState] = useState(require('@/assets/images/profile.png'));
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Upload image and return download URL
  const uploadProfileImage = async (uri: string, userId: string) => {
    try {
      console.log('Starting upload for user:', userId);
      const storageRef = ref(FIREBASE_STORAGE, `profileImages/${userId}.jpg`);

      // Convert local URI to blob
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }
      
      const blob = await response.blob();
      console.log('Blob created, size:', blob.size);

      // Upload to Firebase Storage
      const uploadResult = await uploadBytes(storageRef, blob);
      console.log('Upload successful:', uploadResult.metadata.name);

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);
      console.log('Download URL obtained:', downloadURL);
      
      return downloadURL;
    } catch (error) {
      console.error('Detailed upload error:', error);
      throw error;
    }
  };

  // Save profile image (upload + update Firebase Auth + update state)
  const setProfileImage = async (uri: string) => {
    const currentUser = FIREBASE_AUTH.currentUser;
    if (!currentUser) {
      console.error('No authenticated user');
      throw new Error('User not authenticated');
    }

    setIsLoading(true);
    try {
      console.log('Uploading image for user:', currentUser.uid);
      
      // Upload to storage
      const downloadURL = await uploadProfileImage(uri, currentUser.uid);
      
      // Update Firebase Auth profile
      await updateProfile(currentUser, {
        photoURL: downloadURL,
      });

      // Update local state
      setProfileImageState({ uri: downloadURL });
      
      console.log('Profile image updated successfully');
    } catch (error) {
      console.error('Error saving profile image:', error);
      // Show local image temporarily, but don't save it as "uploaded"
      setProfileImageState({ uri });
      throw error; // Re-throw so the UI can handle it
    } finally {
      setIsLoading(false);
    }
  };

  // Single useEffect to handle auth state changes
  useEffect(() => {
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged((user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
      
      if (user) {
        // User is signed in - load their profile
        if (user.photoURL) {
          console.log('Loading user photo from:', user.photoURL);
          setProfileImageState({ uri: user.photoURL });
        } else {
          console.log('No user photo, using default');
          setProfileImageState(require('@/assets/images/profile.png'));
        }
        
        const displayName = user.displayName || user.email?.split('@')[0] || 'User';
        const email = user.email || '';
        
        setUserName(displayName);
        setUserEmail(email);
        
        console.log('Profile loaded - Name:', displayName, 'Email:', email);
      } else {
        // User is signed out - reset to defaults
        console.log('Resetting profile to defaults');
        setProfileImageState(require('@/assets/images/profile.png'));
        setUserName('');
        setUserEmail('');
      }
    });

    return unsubscribe;
  }, []); // Empty dependency array - this effect should only run once

  const contextValue = {
    profileImage,
    setProfileImage,
    userName,
    userEmail,
    setUserName,
    setUserEmail,
    isLoading,
  };

  return (
    <UserProfileContext.Provider value={contextValue}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};