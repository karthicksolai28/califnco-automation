import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Alert, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'dealer' | 'admin'>('customer');
  const { signup } = useAuth();
  const router = useRouter();

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }

    try {
      await signup(email, password, role);
      Alert.alert('Success', 'Account created successfully');
      router.replace('/');
    } catch (error: any) {
      console.error('Signup error:', error);
      Alert.alert('Error', error.message || 'Signup failed');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(600)} style={styles.header}>
          <Text style={styles.logo}>🛒</Text>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Califnco today</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Create a password (min 6 characters)"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Select Role</Text>
            <View style={styles.roleContainer}>
              <Pressable
                style={[styles.roleButton, role === 'customer' && styles.roleButtonActive]}
                onPress={() => setRole('customer')}
              >
                <Text style={[styles.roleButtonText, role === 'customer' && styles.roleButtonTextActive]}>Customer</Text>
              </Pressable>
              <Pressable
                style={[styles.roleButton, role === 'dealer' && styles.roleButtonActive]}
                onPress={() => setRole('dealer')}
              >
                <Text style={[styles.roleButtonText, role === 'dealer' && styles.roleButtonTextActive]}>Dealer</Text>
              </Pressable>
              <Pressable
                style={[styles.roleButton, role === 'admin' && styles.roleButtonActive]}
                onPress={() => setRole('admin')}
              >
                <Text style={[styles.roleButtonText, role === 'admin' && styles.roleButtonTextActive]}>Admin</Text>
              </Pressable>
            </View>
          </View>

          <Animated.View entering={FadeInUp.duration(500).delay(400)}>
            <Pressable style={styles.button} onPress={handleSignup}>
              <Text style={styles.buttonText}>Create Account</Text>
            </Pressable>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(500).delay(500)} style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Pressable onPress={() => router.push('/login')}>
              <Text style={styles.link}>Login</Text>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1a1a1a',
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  roleButton: {
    flex: 1,
    padding: 14,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  roleButtonTextActive: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  link: {
    fontSize: 14,
    color: '#2196F3',
    fontWeight: '600',
  },
});
