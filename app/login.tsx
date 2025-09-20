// app/login.tsx
import Colors from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native'
import { defaultStyles } from '../constants/Styles'
import { FIREBASE_AUTH } from '../FirebaseConfig'

const colorScheme = useColorScheme()

const textColor = Colors[colorScheme ?? 'light'].text;
const borderColor = Colors[colorScheme ?? 'light'].border;
const backgroundColor = Colors[colorScheme ?? 'light'].background;
const surfaceColor = Colors[colorScheme ?? 'light'].surface || backgroundColor;


const Page = () => {
  const { type } = useLocalSearchParams<{type: string}>();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    setLoading(true)
    try {
      const user = await signInWithEmailAndPassword(auth, email, password)
      if (user) router.replace('/(drawer)/(tabs)')
    } catch (error: any) {
      console.log(error)
      alert('Sign in failed: ' + error.message);
    }
    setLoading(false)
  }

  const signUp = async () => {
    setLoading(true)
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password)
      if (user) router.replace('/(drawer)/(tabs)')
    } catch (error: any) {
      console.log(error)
      alert('Sign in failed: ' + error.message);
    }
    setLoading(false)
  }

  return (
    <View style={styles.container}>
        <View>
            <Image source={require('@/assets/images/bus_cover.png')} style={styles.bgLogin}/>
            <View style={{padding: 20}}>
                <Text style={styles.heading}>Your all-in-one travel companion for Brunei's public buses.</Text>
            </View>
        </View>

        <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={1}
        >
        {loading && (
            <View style={defaultStyles.loadingOverlay}>
            <ActivityIndicator size='large' color='#fff'/>
            </View>
        )}

        <Text style={styles.title}>
            {type === 'login' ? 'Welcome back' : 'Create your account'}
        </Text>

        <View style={styles.formContainer}>
            <View style={{position: 'relative', marginBottom: 20}}>
                <TextInput
                autoCapitalize='none'
                placeholder='Email'
                style={styles.inputField}
                value={email}
                onChangeText={setEmail}
                />
            </View>

            <View style={{position: 'relative', marginBottom: 20}}>
                <TextInput
                autoCapitalize='none'
                placeholder='Password'
                style={styles.inputField}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                />
            </View>

            {type === 'login' ? (
            <TouchableOpacity onPress={signIn} style={[defaultStyles.btn, styles.btnPrimary]}>
            <Text style={styles.btnPrimaryText}>Login</Text>
            </TouchableOpacity>
            ) : (
            <TouchableOpacity onPress={signUp} style={[defaultStyles.btn, styles.btnPrimary]}>
            <Text style={styles.btnPrimaryText}>Create account</Text>
            </TouchableOpacity>
            )}
        </View>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
        </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  logo: {
    width: 60,
    height: 60,
    alignSelf: 'center',
    marginVertical: 80,
  },
  bgLogin: {
    width: '100%',
    height: 200,
    marginTop: 60,
    resizeMode: 'cover',
    borderRadius: 20,
    },
  heading: {
    fontSize: 14,
    fontFamily: 'Outfit-Bold',
    textAlign: 'center',
    color: textColor,
    },
  title: {
    fontFamily: 'Outfit-Bold',
    fontSize: 30,
    alignSelf: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
    color: textColor,
  },
  formContainer: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 30,
    backgroundColor: surfaceColor,
    shadowColor: '#000000',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5
    },
  inputField: {
    borderBottomWidth: 1,
    borderBottomColor: borderColor,
    paddingVertical: 15,
    paddingHorizontal: 0,
    fontSize: 16,
    color: textColor
  },
  btnPrimary: {
    backgroundColor: "#007bff",
    marginVertical: 4,
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 16,
  },
  backButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  backText: {
    marginLeft: 6,
    fontSize: 16,
    fontFamily: "Outfit-Medium",
    color: "#007bff",
  },
})

export default Page;