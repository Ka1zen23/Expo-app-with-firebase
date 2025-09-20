# Expo-app-with-firebase

### Description

An incomplete expo app (Bus4BN) used for real-time bus tracking, booking, and routing. Now comes with Firebase.

## Features

- Firebase Authentication
- Firestore Database
- Tabs
- Drawer

## Tech Stack

- TypeScript
- React Native (Expo)
- Firebase (Authentication)
  - Email
- Firestore

# Setup
#### Simulation/Device Setup
If you haven't used Expo before, follow this [expo documentation](https://docs.expo.dev/get-started/set-up-your-environment/?platform=ios&device=simulated&mode=development-build) to setup simulators and device setups.

#### Clone the Repo
```bash
  [git clone https://github.com/andepants/app-ship.git my-app](https://github.com/Ka1zen23/Expo-app-with-firebase.git)
  cd Bus4BN-firebase
  npx expo install
  npx expo prebuild
  npx expo run:android
```

#### Generate Firebase credentials
1. Go to [firebase](https://firebase.google.com/)
2. Go to console
3. Add Project
4. Enter project name. Skip Analytics. Create Project
5. Click Project Settings (gear icon) in the top left
6. Scroll to "Your apps". Select the web app icon.
7. Input app nickname, hit "register".
8. Copy and Paste FirebaseConfig variables into FirebaseConfig.ts in the root directory of the repository.

#### Turn on Firebase Authentication
1. Go to Firebase console, under the "Build" section on the left menu, click Authentication.
2. Click "Get Started"
3. Enable Email/Password. Click Save.

#### Turn on Firestore
1. In the Firebase console, under the "Build" section on the left menu, click Firestore Database.
2. Click Create Database.
3. Start in production mode (requires rules setup)
4. Choose a Cloud Firestore location and click Enable
5. Your Firestore database is ready. You can add collections and documents or configure security rules in the Rules tab.
