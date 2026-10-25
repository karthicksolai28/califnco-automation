import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/contexts/AuthContext';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function ServiceScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [issue, setIssue] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, role } = useAuth();
  const router = useRouter();

  const handleBookService = async () => {
    if (!name || !phone || !address || !issue || !preferredDate) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'services'), {
        userId: user?.uid,
        userEmail: user?.email,
        name,
        phone,
        address,
        issue,
        preferredDate,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      
      Alert.alert('Success', 'Service request submitted successfully', [
        {
          text: 'OK',
          onPress: () => {
            setName('');
            setPhone('');
            setAddress('');
            setIssue('');
            setPreferredDate('');
            router.back();
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to book service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <Text style={styles.logo}>🔧</Text>
          <Text style={styles.title}>Book Service</Text>
          <Text style={styles.subtitle}>Schedule a maintenance visit</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              placeholderTextColor="#999"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full address"
              placeholderTextColor="#999"
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Issue Description</Text>
            <TextInput
              style={styles.input}
              placeholder="Describe the issue with your purifier"
              placeholderTextColor="#999"
              value={issue}
              onChangeText={setIssue}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Preferred Date</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/YYYY"
              placeholderTextColor="#999"
              value={preferredDate}
              onChangeText={setPreferredDate}
            />
          </View>

          <Animated.View entering={FadeInUp.duration(500).delay(400)}>
            <Pressable style={styles.button} onPress={handleBookService} disabled={loading}>
              <Text style={styles.buttonText}>{loading ? 'Submitting...' : 'Book Service'}</Text>
            </Pressable>
          </Animated.View>

          {role === 'admin' && (
            <Animated.View entering={FadeInUp.duration(500).delay(500)}>
              <Text style={styles.adminNote}>Admin View: Service requests will appear in Service Desk</Text>
            </Animated.View>
          )}
        </Animated.View>

        <View style={styles.footer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 24,
    alignItems: 'center',
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
  },
  form: {
    paddingHorizontal: 16,
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
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1a1a1a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    backgroundColor: '#FF9800',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#FF9800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  adminNote: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 24,
  },
  footer: {
    height: 24,
  },
});
