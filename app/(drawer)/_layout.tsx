// app/(drawer)/_layout.tsx
import { useUserProfile } from '@/components/UserProfileContext';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { router, usePathname } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { useEffect, useState } from 'react';
import { Image, StatusBarStyle, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const pathname = usePathname();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { profileImage, userName, userEmail } = useUserProfile();

  useEffect(() => {
    console.log(pathname);
  }, [pathname]);

  const menuItems = [
    {
      icon: 'ticket-outline',
      iconFocused: 'ticket',
      label: 'My Tickets',
      route: '/(drawer)/(tabs)/tickets',
    },
    {
      icon: 'map-outline',
      iconFocused: 'map',
      label: 'Routes',
      route: '/',
    },
    {
      icon: 'heart-outline',
      iconFocused: 'heart',
      label: 'Favorites',
      route: '/(drawer)/(tabs)/routes',
    },
    {
      icon: 'notifications-outline',
      iconFocused: 'notifications',
      label: 'Notifications',
      route: '/(drawer)/notifications',
    },
    {
      icon: 'settings-outline',
      iconFocused: 'settings',
      label: 'Settings',
      route: '/(drawer)/settings',
    },
    {
      icon: 'help-circle-outline',
      iconFocused: 'help-circle',
      label: 'About & Help',
      route: '/(drawer)/help',
    },
  ];

  const handleProfilePress = () => {
    router.push('/(drawer)/(tabs)/profile');
  };

  return (
    <DrawerContentScrollView {...props} style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* User Profile Section */}
      <TouchableOpacity 
        style={[styles.profileContainer, { borderBottomColor: colors.border }]} 
        onPress={handleProfilePress}
        activeOpacity={0.7}
      >
        <View style={styles.profileImageContainer}>
          {profileImage ? (
            <Image source={profileImage} style={styles.profileImage} />
          ) : (
            <View style={[styles.profileImagePlaceholder, { backgroundColor: colors.primary }]}>
              <Ionicons name="person" size={40} color="white" />
            </View>
          )}
        </View>
        <View style={styles.profileTextContainer}>
          <Text style={[styles.userName, { color: colors.text }]}>{userName || "User"}</Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{userEmail || "user@example.com"}</Text>
        </View>
      </TouchableOpacity>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <DrawerItem
            key={index}
            icon={({ color, focused }) => (
              <Ionicons
                name={focused ? item.iconFocused as any : item.icon as any}
                size={24}
                color={color}
              />
            )}
            label={item.label}
            labelStyle={[
              styles.navItemLabel,
              { color: pathname === item.route ? colors.primary : colors.text },
              pathname === item.route && styles.navItemLabelFocused
            ]}
            focused={pathname === item.route}
            activeTintColor={colors.primary}
            inactiveTintColor={colors.textSecondary}
            onPress={() => {
              router.push(item.route as any);
            }}
            style={[
              styles.drawerItem,
              pathname === item.route && { backgroundColor: `${colors.primary}15` }
            ]}
          />
        ))}
      </View>
    </DrawerContentScrollView>
  );
};

export default function Layout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [statusBarStyle] = useState<StatusBarStyle>(
    colorScheme === 'dark' ? 'light-content' : 'dark-content'
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer 
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerActiveTintColor: colors.primary,
          drawerInactiveTintColor: colors.tabIconDefault,
          drawerStyle: {
            backgroundColor: colors.surface,
            width: 280,
            shadowColor: colorScheme === 'dark' ? colors.text : '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: colorScheme === 'dark' ? 0.1 : 0.05,
            shadowRadius: 4,
            elevation: 8,
          },
          headerShown: false,
        }}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  profileImageContainer: {
    marginRight: 15,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profileImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileTextContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    opacity: 0.7,
  },
  menuContainer: {
    paddingTop: 10,
  },
  drawerItem: {
    borderRadius: 8,
    marginHorizontal: 10,
    marginVertical: 2,
  },
  navItemLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10, // Adjust spacing from icon
  },
  navItemLabelFocused: {
    fontWeight: '600',
  },
});