import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '@/contexts/CartContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/contexts/AuthContext';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function CheckoutScreen() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const { cart, total, clearCart } = useCart();
  const router = useRouter();
  const { user } = useAuth();

  const handleCheckout = async () => {
    console.log('handleCheckout called, address:', address);
    if (!address) {
      console.log('Address is empty');
      Alert.alert('Error', 'Please enter your address');
      return;
    }

    setLoading(true);
    try {
      // Save order to Firestore
      await addDoc(collection(db, 'orders'), {
        userId: user?.uid,
        userEmail: user?.email,
        items: cart,
        total,
        address,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      
      console.log('About to show success alert');
      if (typeof window !== 'undefined') {
        window.alert('Order placed successfully!');
        clearCart();
        router.replace('/');
      } else {
        Alert.alert('Success', 'Order placed successfully!', [
          {
            text: 'OK',
            onPress: () => {
              console.log('OK pressed, clearing cart');
              clearCart();
              router.replace('/');
            },
          },
        ]);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      if (typeof window !== 'undefined') {
        window.alert('Failed to place order');
      } else {
        Alert.alert('Error', 'Failed to place order');
      }
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    router.replace('/products');
    return null;
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <Text style={styles.logo}>📦</Text>
          <Text style={styles.title}>Checkout</Text>
          <Text style={styles.subtitle}>Complete your order</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📍</Text>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Enter your full address"
            placeholderTextColor="#999"
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(300)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🛒</Text>
            <Text style={styles.sectionTitle}>Order Summary</Text>
          </View>
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Items</Text>
              <Text style={styles.summaryValue}>{cart.length}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₹{total}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery</Text>
              <Text style={styles.summaryValue}>FREE</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{total}</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(500).delay(400)}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.loadingText}>Placing order...</Text>
            </View>
          ) : (
            <Pressable style={styles.button} onPress={handleCheckout}>
              <Text style={styles.buttonIcon}>✓</Text>
              <Text style={styles.buttonText}>Place Order</Text>
            </Pressable>
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
  section: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1a1a1a',
    minHeight: 120,
  },
  summary: {
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#4CAF50',
  },
  button: {
    marginHorizontal: 16,
    backgroundColor: '#4CAF50',
    padding: 18,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 24,
  },
  buttonIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  loadingContainer: {
    marginHorizontal: 16,
    backgroundColor: '#4CAF50',
    padding: 18,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  footer: {
    height: 24,
  },
});
