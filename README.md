# 🚍 Expo-app-with-firebase (Bus4BN)

An Expo-based React Native app for real-time bus tracking, booking, and routing — now powered by Firebase.

---

## ✨ Features

- **Firebase Authentication** (Email/Password)
- **Firestore Database** for routes and future entities
- **Tabbed Navigation** & **Drawer Navigation** (React Navigation)
- Real-time updates ready

---

## 🛠 Tech Stack

- **TypeScript**
- **React Native (Expo)**
- **Firebase**  
  - Authentication (Email/Password)  
  - Cloud Firestore  

---

## 📦 Setup

### 1️⃣ Prerequisites  

- [Node.js 18+](https://nodejs.org/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- iOS Simulator / Android Emulator or physical device (see [Expo setup docs](https://docs.expo.dev/get-started/set-up-your-environment/?platform=ios&device=simulated&mode=development-build))
- Firebase project

### 2️⃣ Clone the Repository  

```bash
git clone https://github.com/Ka1zen23/Expo-app-with-firebase.git
cd Expo-app-with-firebase
npm install expo
npx expo install
npx expo prebuild
```

### 3️⃣ Run the App  

```bash
# Android
npx expo run:android

# iOS (on Mac)
npx expo run:ios
```

---

## 🔑 Firebase Setup

### Generate Firebase Credentials  

1. Go to [Firebase Console](https://firebase.google.com/).
2. Click **Add Project** → enter a project name (skip Analytics) → **Create Project**.
3. In project settings (gear icon top-left) scroll to **Your apps**.
4. Click the **Web App** icon → give it a nickname → register.
5. Copy the generated `firebaseConfig` object.
6. Paste into `FirebaseConfig.ts` in the root directory of this repo.

### Enable Firebase Authentication  

1. In the Firebase Console under **Build > Authentication**, click **Get Started**.
2. Enable **Email/Password** and click **Save**.

### Enable Firestore  

1. In the Firebase Console under **Build > Firestore Database**, click **Create Database**.
2. Start in **Production mode** (requires rules setup).
3. Choose a Cloud Firestore location → **Enable**.

---

## 🗂 Data Model

Currently only one collection is defined:

### `routes` Collection

| Field        | Type      | Description                         |
|--------------|-----------|-------------------------------------|
| `id`         | string    | Document ID (auto-generated or custom) |
| `name`       | string    | Route name (e.g., "Bus 42 Downtown") |
| `stops`      | array     | List of stops / coordinates         |
| `active`     | boolean   | Whether route is active             |
| `createdAt`  | timestamp | Creation date                       |

*(You can extend this to `bookings`, `users`, etc. as needed.)*

---

## 🔗 API / Firebase Endpoints

Because this is a Firebase-powered mobile app, there’s no custom backend. You interact with:

- **Firebase Authentication REST API** (handled by the Firebase SDK)
- **Firestore Database** (via Firebase SDK in the app)

Example Firestore usage:

```ts
import { collection, addDoc } from "firebase/firestore"; 
import { db } from "./FirebaseConfig";

await addDoc(collection(db, "routes"), {
  name: "Bus 42 Downtown",
  stops: ["Stop 1", "Stop 2"],
  active: true,
  createdAt: new Date(),
});
```

*(Add your own backend endpoints later if needed.)*

---

## 🚀 Deployment Notes

### Expo Managed Workflow  

- When ready for production:
  ```bash
  npx expo build:android
  npx expo build:ios
  ```
- See [Expo build docs](https://docs.expo.dev/build/introduction/) for signing and publishing to app stores.

### Firebase  

- Use **environment variables** or `.env` for API keys (via [`expo-constants`](https://docs.expo.dev/versions/latest/sdk/constants/)).
- Review **Firestore security rules** before production.
- Monitor usage in the Firebase Console.

### CI/CD  

- You can set up automatic builds using [EAS Build](https://docs.expo.dev/eas/) (Expo’s cloud build service).
- Store Firebase credentials securely in CI environment variables.

---

## 📜 License  

MIT (or your preferred license)
