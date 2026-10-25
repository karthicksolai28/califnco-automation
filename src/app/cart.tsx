import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable, ScrollView } from 'react-native';
import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function CartScreen() {
  const { cart, removeFromCart, updateQuantity, total } = useCart();
  const router = useRouter();

  if (cart.length === 0) {
    return (
      <View style={styles.container}>
        <Animated.View entering={FadeIn.duration(500)} style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Text style={styles.emptySubtext}>Add some products to get started</Text>
          <Pressable style={styles.browseButton} onPress={() => router.push('/products')}>
            <Text style={styles.browseButtonText}>Browse Products</Text>
          </Pressable>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
        <Text style={styles.title}>Shopping Cart</Text>
        <Text style={styles.subtitle}>{cart.length} items</Text>
      </Animated.View>

      <FlatList
        data={cart}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInUp.duration(400).delay(200 + index * 50)}>
            <View style={styles.cartItem}>
              <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.itemPrice}>₹{item.price}</Text>
                <View style={styles.quantityContainer}>
                  <Pressable 
                    style={styles.qtyButton} 
                    onPress={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Text style={styles.qtyButtonText}>−</Text>
                  </Pressable>
                  <Text style={styles.qtyText}>{item.quantity}</Text>
                  <Pressable 
                    style={styles.qtyButton} 
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Text style={styles.qtyButtonText}>+</Text>
                  </Pressable>
                </View>
              </View>
              <Pressable style={styles.removeButton} onPress={() => removeFromCart(item.id)}>
                <Text style={styles.removeIcon}>🗑️</Text>
              </Pressable>
            </View>
          </Animated.View>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <Animated.View entering={FadeInUp.duration(500).delay(300)} style={styles.footer}>
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
        <Pressable style={styles.checkoutButton} onPress={() => router.push('/checkout')}>
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </Pressable>
      </Animated.View>
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
    paddingHorizontal: 16,
    paddingBottom: 200,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2196F3',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyButton: {
    backgroundColor: '#2196F3',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  qtyText: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  removeButton: {
    justifyContent: 'center',
    marginLeft: 8,
  },
  removeIcon: {
    fontSize: 24,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
    color: '#2196F3',
  },
  checkoutButton: {
    backgroundColor: '#4CAF50',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  browseButton: {
    backgroundColor: '#2196F3',
    padding: 18,
    borderRadius: 16,
    paddingHorizontal: 32,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
