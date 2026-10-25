import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Alert, Image, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/contexts/AuthContext';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function DealerScreen() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [wholesalePrice, setWholesalePrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const { user, role } = useAuth();
  const router = useRouter();

  if (role !== 'dealer') {
    return (
      <View style={styles.container}>
        <Animated.View entering={FadeIn.duration(500)} style={styles.errorContainer}>
          <Text style={styles.errorIcon}>🔒</Text>
          <Text style={styles.errorText}>Access Denied</Text>
          <Text style={styles.errorSubtext}>Dealer access only</Text>
        </Animated.View>
      </View>
    );
  }

  const handleAddProduct = async () => {
    if (!name || !price || !imageUrl) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      await addDoc(collection(db, 'products'), {
        name,
        price: parseFloat(price),
        wholesalePrice: wholesalePrice ? parseFloat(wholesalePrice) : Math.round(parseFloat(price) * 0.8),
        imageUrl,
        dealerId: user?.uid,
        createdAt: new Date().toISOString(),
      });
      Alert.alert('Success', 'Product added successfully');
      setName('');
      setPrice('');
      setWholesalePrice('');
      setImageUrl('');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <Text style={styles.logo}>📦</Text>
          <Text style={styles.title}>Add New Product</Text>
          <Text style={styles.subtitle}>Fill in the details below</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Product Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter product name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Retail Price (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter retail price"
              placeholderTextColor="#999"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Wholesale Price (₹) - Optional</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter wholesale price (default: 20% off)"
              placeholderTextColor="#999"
              value={wholesalePrice}
              onChangeText={setWholesalePrice}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Image URL</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter image URL"
              placeholderTextColor="#999"
              value={imageUrl}
              onChangeText={setImageUrl}
              autoCapitalize="none"
            />
          </View>

          {imageUrl ? (
            <Animated.View entering={FadeInUp.duration(400)} style={styles.previewContainer}>
              <Text style={styles.previewLabel}>Preview</Text>
              <Image source={{ uri: imageUrl }} style={styles.preview} />
            </Animated.View>
          ) : null}

          <Animated.View entering={FadeInUp.duration(500).delay(400)}>
            <Pressable style={styles.button} onPress={handleAddProduct}>
              <Text style={styles.buttonText}>Add Product</Text>
            </Pressable>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(500).delay(500)}>
            <Pressable style={styles.bulkButton} onPress={() => router.push('/products')}>
              <Text style={styles.bulkButtonText}>Browse & Order in Bulk</Text>
            </Pressable>
          </Animated.View>
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
    fontSize: 28,
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
  previewContainer: {
    marginBottom: 24,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
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
  bulkButton: {
    backgroundColor: '#2196F3',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 24,
  },
  bulkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F44336',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 16,
    color: '#666',
  },
  footer: {
    height: 24,
  },
});
