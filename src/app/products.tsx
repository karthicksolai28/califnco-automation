import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable, ActivityIndicator, Dimensions } from 'react-native';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/firebase';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface Product {
  id: string;
  name: string;
  price: number;
  wholesalePrice?: number;
  imageUrl: string;
  dealerId: string;
}

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { role } = useAuth();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDisplayPrice = (product: Product) => {
    if (role === 'dealer') {
      return product.wholesalePrice || Math.round(product.price * 0.8); // 20% discount for dealers
    }
    return product.price;
  };

  const renderProduct = ({ item, index }: { item: Product; index: number }) => (
    <Animated.View entering={FadeInUp.duration(400).delay(200 + index * 50)}>
      <Pressable
        style={styles.productCard}
        onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.id } } as any)}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
        {role === 'dealer' && (
          <View style={styles.wholesaleBadge}>
            <Text style={styles.wholesaleBadgeText}>WHOLESALE</Text>
          </View>
        )}
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>₹{getDisplayPrice(item)}</Text>
            {role === 'dealer' && (
              <Text style={styles.originalPrice}>₹{item.price}</Text>
            )}
            <View style={styles.addToCartBadge}>
              <Text style={styles.addToCartText}>+</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Animated.View entering={FadeIn.duration(500)} style={styles.loadingContainer}>
          <Text style={styles.loadingEmoji}>🔄</Text>
          <Text style={styles.loadingText}>Loading products...</Text>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
        <Text style={styles.title}>Products</Text>
        <Text style={styles.subtitle}>Browse our collection</Text>
      </Animated.View>

      {products.length === 0 ? (
        <Animated.View entering={FadeIn.duration(500)} style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyText}>No products available</Text>
        </Animated.View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  list: {
    padding: 16,
    paddingBottom: 24,
  },
  productCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  wholesaleBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF9800',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  wholesaleBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
    height: 36,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2196F3',
  },
  originalPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  addToCartBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 20,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
  },
});
