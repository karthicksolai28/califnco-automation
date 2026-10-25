import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ScrollView } from 'react-native';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/contexts/AuthContext';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function OrdersScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, role } = useAuth();

  useEffect(() => {
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;
    
    try {
      let q;
      if (role === 'admin') {
        q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      } else {
        q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
      }
      
      const snapshot = await getDocs(q);
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'cancelled': return '#F44336';
      case 'processing': return '#2196F3';
      default: return '#9E9E9E';
    }
  };

  const renderOrder = ({ item, index }: { item: any; index: number }) => (
    <Animated.View entering={FadeInUp.duration(400).delay(200 + index * 50)}>
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderId}>Order #{item.id.slice(-6).toUpperCase()}</Text>
            <Text style={styles.orderDate}>
              {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status || 'pending'}</Text>
          </View>
        </View>

        <View style={styles.orderItems}>
          <Text style={styles.itemsLabel}>Items: {item.items?.length || 0}</Text>
          <Text style={styles.total}>Total: ₹{item.total}</Text>
        </View>

        {item.address && (
          <View style={styles.addressSection}>
            <Text style={styles.addressLabel}>📍 Delivery Address</Text>
            <Text style={styles.addressText} numberOfLines={2}>{item.address}</Text>
          </View>
        )}

        {role === 'admin' && (
          <View style={styles.adminActions}>
            <Text style={styles.userEmail}>👤 {item.userEmail}</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Animated.View entering={FadeIn.duration(500)} style={styles.loadingContainer}>
          <Text style={styles.loadingEmoji}>🔄</Text>
          <Text style={styles.loadingText}>Loading orders...</Text>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
        <Text style={styles.logo}>📦</Text>
        <Text style={styles.title}>Order History</Text>
        <Text style={styles.subtitle}>{orders.length} orders</Text>
      </Animated.View>

      {orders.length === 0 ? (
        <Animated.View entering={FadeIn.duration(500)} style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyText}>No orders yet</Text>
          <Text style={styles.emptySubtext}>Start shopping to see your orders here</Text>
        </Animated.View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={item => item.id}
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
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  orderItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemsLabel: {
    fontSize: 14,
    color: '#666',
  },
  total: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2196F3',
  },
  addressSection: {
    marginBottom: 12,
  },
  addressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#333',
  },
  adminActions: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
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
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
  },
});
