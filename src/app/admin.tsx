import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, ScrollView, Dimensions } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOut, Layout } from 'react-native-reanimated';
import { collection, getDocs, query, orderBy, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/contexts/AuthContext';

const { width } = Dimensions.get('window');

export default function AdminScreen() {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [dealers, setDealers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { role } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const productsQuery = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const productsSnap = await getDocs(productsQuery);
      setProducts(productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const ordersSnap = await getDocs(ordersQuery);
      setOrders(ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const dealersQuery = query(collection(db, 'users'), where('role', '==', 'dealer'));
      const dealersSnap = await getDocs(dealersQuery);
      setDealers(dealersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const servicesQuery = query(collection(db, 'services'), orderBy('createdAt', 'desc'));
      const servicesSnap = await getDocs(servicesQuery);
      setServices(servicesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDealerAction = async (dealerId: string, action: 'approve' | 'reject') => {
    try {
      await updateDoc(doc(db, 'users', dealerId), {
        status: action === 'approve' ? 'approved' : 'rejected',
      });
      loadData();
    } catch (error) {
      console.error('Error updating dealer status:', error);
    }
  };

  const handleServiceAction = async (serviceId: string, action: 'approve' | 'complete' | 'reject') => {
    try {
      await updateDoc(doc(db, 'services', serviceId), {
        status: action === 'approve' ? 'approved' : action === 'complete' ? 'completed' : 'rejected',
      });
      loadData();
    } catch (error) {
      console.error('Error updating service status:', error);
    }
  };

  if (role !== 'admin') {
    return (
      <View style={styles.container}>
        <Animated.View entering={FadeIn.duration(500)} style={styles.errorContainer}>
          <Text style={styles.errorIcon}>🔒</Text>
          <Text style={styles.errorText}>Access Denied</Text>
          <Text style={styles.errorSubtext}>Admin access only</Text>
        </Animated.View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Animated.View entering={FadeIn.duration(500)} style={styles.loadingContainer}>
          <Animated.View 
            style={styles.spinner}
            entering={FadeIn.duration(300)}
          >
            <Text style={styles.spinnerText}>🔄</Text>
          </Animated.View>
          <Text style={styles.loadingText}>Loading Dashboard...</Text>
        </Animated.View>
      </View>
    );
  }

  const stats = [
    { label: 'Total Products', value: products.length, icon: '📦', color: '#4CAF50' },
    { label: 'Total Orders', value: orders.length, icon: '🛒', color: '#2196F3' },
    { label: 'Revenue', value: `₹${orders.reduce((sum, order) => sum + (order.total || 0), 0)}`, icon: '💰', color: '#FF9800' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>Welcome back, Admin</Text>
      </Animated.View>

      <Animated.View 
        entering={FadeInUp.duration(600).delay(200)} 
        style={styles.statsContainer}
      >
        {stats.map((stat, index) => (
          <Animated.View
            key={stat.label}
            entering={FadeInUp.duration(500).delay(300 + index * 100)}
            style={[styles.statCard, { borderLeftColor: stat.color }]}
          >
            <Text style={styles.statIcon}>{stat.icon}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </Animated.View>
        ))}
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(600).delay(500)} style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Products</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{products.length}</Text>
          </View>
        </View>
        <FlatList
          data={products}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeInUp.duration(400).delay(600 + index * 50)}
              style={styles.item}
            >
              <View style={styles.itemLeft}>
                <View style={styles.itemIcon}>
                  <Text style={styles.itemIconText}>📦</Text>
                </View>
                <View>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemCategory}>{item.category || 'General'}</Text>
                </View>
              </View>
              <View style={styles.itemRight}>
                <Text style={styles.itemPrice}>₹{item.price}</Text>
                <Text style={styles.itemStock}>{item.stock || 0} in stock</Text>
              </View>
            </Animated.View>
          )}
          scrollEnabled={false}
          style={styles.list}
        />
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(600).delay(700)} style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Dealer Requests</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{dealers.length}</Text>
          </View>
        </View>
        <FlatList
          data={dealers}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeInUp.duration(400).delay(800 + index * 50)}
              style={styles.dealerItem}
            >
              <View style={styles.dealerInfo}>
                <Text style={styles.dealerEmail}>{item.email}</Text>
                <Text style={styles.dealerStatus}>
                  Status: {item.status || 'pending'}
                </Text>
              </View>
              <View style={styles.dealerActions}>
                <Pressable
                  style={[styles.actionButton, styles.approveButton]}
                  onPress={() => handleDealerAction(item.id, 'approve')}
                >
                  <Text style={styles.actionButtonText}>✓</Text>
                </Pressable>
                <Pressable
                  style={[styles.actionButton, styles.rejectButton]}
                  onPress={() => handleDealerAction(item.id, 'reject')}
                >
                  <Text style={styles.actionButtonText}>✗</Text>
                </Pressable>
              </View>
            </Animated.View>
          )}
          scrollEnabled={false}
          style={styles.list}
        />
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(600).delay(800)} style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Service Desk</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{services.length}</Text>
          </View>
        </View>
        <FlatList
          data={services}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeInUp.duration(400).delay(900 + index * 50)}
              style={styles.serviceItem}
            >
              <View style={styles.serviceHeader}>
                <View style={styles.serviceIcon}>
                  <Text style={styles.serviceIconText}>🔧</Text>
                </View>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{item.name}</Text>
                  <Text style={styles.serviceEmail}>{item.userEmail}</Text>
                  <Text style={styles.servicePhone}>📞 {item.phone}</Text>
                </View>
                <View style={[styles.statusBadge, {
                  backgroundColor: item.status === 'completed' ? '#4CAF50' : 
                                 item.status === 'approved' ? '#2196F3' :
                                 item.status === 'pending' ? '#FF9800' : '#F44336'
                }]}>
                  <Text style={styles.statusText}>{item.status || 'pending'}</Text>
                </View>
              </View>
              <View style={styles.serviceDetails}>
                <Text style={styles.serviceIssue}>Issue: {item.issue}</Text>
                <Text style={styles.serviceAddress} numberOfLines={1}>
                  📍 {item.address}
                </Text>
                <Text style={styles.serviceDate}>
                  📅 Preferred: {item.preferredDate}
                </Text>
              </View>
              <View style={styles.serviceActions}>
                <Pressable
                  style={[styles.serviceActionButton, styles.approveServiceButton]}
                  onPress={() => handleServiceAction(item.id, 'approve')}
                >
                  <Text style={styles.serviceActionButtonText}>Approve</Text>
                </Pressable>
                <Pressable
                  style={[styles.serviceActionButton, styles.completeServiceButton]}
                  onPress={() => handleServiceAction(item.id, 'complete')}
                >
                  <Text style={styles.serviceActionButtonText}>Complete</Text>
                </Pressable>
                <Pressable
                  style={[styles.serviceActionButton, styles.rejectServiceButton]}
                  onPress={() => handleServiceAction(item.id, 'reject')}
                >
                  <Text style={styles.serviceActionButtonText}>Reject</Text>
                </Pressable>
              </View>
            </Animated.View>
          )}
          scrollEnabled={false}
          style={styles.list}
        />
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(600).delay(900)} style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{orders.length}</Text>
          </View>
        </View>
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeInUp.duration(400).delay(1000 + index * 50)}
              style={styles.orderItem}
            >
              <View style={styles.orderHeader}>
                <View style={styles.orderIcon}>
                  <Text style={styles.orderIconText}>🛒</Text>
                </View>
                <View style={styles.orderInfo}>
                  <Text style={styles.orderEmail}>{item.userEmail}</Text>
                  <Text style={styles.orderDate}>
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}
                  </Text>
                </View>
                <View style={[styles.statusBadge, {
                  backgroundColor: item.status === 'completed' ? '#4CAF50' : 
                                 item.status === 'pending' ? '#FF9800' : '#F44336'
                }]}>
                  <Text style={styles.statusText}>{item.status || 'pending'}</Text>
                </View>
              </View>
              <View style={styles.orderDetails}>
                <Text style={styles.orderTotal}>Total: ₹{item.total}</Text>
                <Text style={styles.orderAddress} numberOfLines={1}>
                  📍 {item.address}
                </Text>
              </View>
            </Animated.View>
          )}
          scrollEnabled={false}
          style={styles.list}
        />
      </Animated.View>

      <View style={styles.footer} />
    </ScrollView>
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
    marginBottom: 20,
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
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  badge: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  list: {
    marginBottom: 8,
  },
  item: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemIconText: {
    fontSize: 24,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  itemCategory: {
    fontSize: 12,
    color: '#666',
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2196F3',
    marginBottom: 2,
  },
  itemStock: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: '500',
  },
  orderItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  orderIconText: {
    fontSize: 22,
  },
  orderInfo: {
    flex: 1,
  },
  orderEmail: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 11,
    color: '#999',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  orderDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  orderAddress: {
    fontSize: 12,
    color: '#666',
  },
  dealerItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  dealerInfo: {
    marginBottom: 12,
  },
  dealerEmail: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  dealerStatus: {
    fontSize: 14,
    color: '#666',
  },
  dealerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  serviceItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  serviceIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  serviceIconText: {
    fontSize: 22,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  serviceEmail: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  servicePhone: {
    fontSize: 12,
    color: '#666',
  },
  serviceDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    marginBottom: 12,
  },
  serviceIssue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  serviceAddress: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  serviceDate: {
    fontSize: 12,
    color: '#666',
  },
  serviceActions: {
    flexDirection: 'row',
    gap: 8,
  },
  serviceActionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  approveServiceButton: {
    backgroundColor: '#2196F3',
  },
  completeServiceButton: {
    backgroundColor: '#4CAF50',
  },
  rejectServiceButton: {
    backgroundColor: '#F44336',
  },
  serviceActionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    marginBottom: 16,
  },
  spinnerText: {
    fontSize: 48,
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
  },
  footer: {
    height: 24,
  },
});
