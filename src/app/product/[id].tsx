import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Alert, ScrollView } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { addToCart } = useCart();
  const { role } = useAuth();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() });
      }
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDisplayPrice = () => {
    if (role === 'dealer') {
      return product.wholesalePrice || Math.round(product.price * 0.8);
    }
    return product.price;
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: getDisplayPrice(),
      imageUrl: product.imageUrl,
    });
    Alert.alert('Success', 'Added to cart');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Animated.View entering={FadeIn.duration(500)} style={styles.loadingContainer}>
          <Text style={styles.loadingEmoji}>🔄</Text>
          <Text style={styles.loadingText}>Loading product...</Text>
        </Animated.View>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Animated.View entering={FadeIn.duration(500)} style={styles.errorContainer}>
          <Text style={styles.errorIcon}>❌</Text>
          <Text style={styles.errorText}>Product not found</Text>
        </Animated.View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View entering={FadeInDown.duration(600)}>
        <Image source={{ uri: product.imageUrl }} style={styles.image} />
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>NEW</Text>
          </View>
          <View>
            <Text style={styles.price}>₹{getDisplayPrice()}</Text>
            {role === 'dealer' && (
              <Text style={styles.originalPrice}>₹{product.price} (Retail)</Text>
            )}
          </View>
        </View>

        <Text style={styles.name}>{product.name}</Text>

        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Product Details</Text>
          <Text style={styles.infoText}>
            High-quality product from Califnco. Premium materials and excellent craftsmanship.
          </Text>
        </View>

        <Animated.View entering={FadeInUp.duration(500).delay(400)}>
          <Pressable style={styles.button} onPress={handleAddToCart}>
            <Text style={styles.buttonIcon}>🛒</Text>
            <Text style={styles.buttonText}>Add to Cart</Text>
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(500).delay(500)}>
          <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
            <Text style={styles.secondaryButtonText}>← Back to Products</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>

      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 350,
    resizeMode: 'cover',
  },
  content: {
    padding: 24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  badge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  price: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2196F3',
  },
  originalPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    textDecorationLine: 'line-through',
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 24,
    lineHeight: 36,
  },
  infoSection: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 18,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 12,
  },
  buttonIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    marginBottom: 24,
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
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
    fontSize: 20,
    color: '#666',
    fontWeight: '500',
  },
  footer: {
    height: 24,
  },
});
