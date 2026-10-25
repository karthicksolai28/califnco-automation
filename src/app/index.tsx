import { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function HomeScreen() {
  const { user, role, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Animated.View entering={FadeIn.duration(500)} style={styles.loadingContainer}>
          <Text style={styles.loadingEmoji}>🔄</Text>
          <Text style={styles.loadingText}>Loading...</Text>
        </Animated.View>
      </View>
    );
  }

  if (!user) {
    return null;
  }

  const roleConfig = {
    dealer: {
      icon: '📦',
      color: '#FF9800',
      title: 'Dealer Dashboard',
      actions: [
        { label: 'Add Product', route: '/dealer', icon: '➕' },
        { label: 'Order History', route: '/orders', icon: '📋' },
        { label: 'Profile', route: '/profile', icon: '👤' },
      ]
    },
    customer: {
      icon: '🛒',
      color: '#2196F3',
      title: 'Welcome Back',
      actions: [
        { label: 'Browse Products', route: '/products', icon: '🏪' },
        { label: 'View Cart', route: '/cart', icon: '🛍️' },
        { label: 'Order History', route: '/orders', icon: '📋' },
        { label: 'Book Service', route: '/service', icon: '🔧' },
        { label: 'Profile', route: '/profile', icon: '👤' },
      ]
    },
    admin: {
      icon: '👑',
      color: '#9C27B0',
      title: 'Admin Dashboard',
      actions: [
        { label: 'Admin Panel', route: '/admin', icon: '⚙️' },
        { label: 'Service Desk', route: '/service', icon: '🔧' },
        { label: 'Profile', route: '/profile', icon: '👤' },
      ]
    }
  };

  const config = roleConfig[role] || roleConfig.customer;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🛒</Text>
        </View>
        <Text style={styles.title}>Califnco</Text>
        <Text style={styles.subtitle}>Welcome, {user.email?.split('@')[0]}</Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.roleCard}>
        <View style={[styles.roleIconContainer, { backgroundColor: config.color + '20' }]}>
          <Text style={styles.roleIcon}>{config.icon}</Text>
        </View>
        <Text style={styles.roleTitle}>{config.title}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleBadgeText}>{role.toUpperCase()}</Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(600).delay(300)} style={styles.actionsContainer}>
        {config.actions.map((action, index) => (
          <Animated.View
            key={action.route}
            entering={FadeInUp.duration(500).delay(400 + index * 100)}
          >
            <Pressable
              style={styles.actionCard}
              onPress={() => router.push(action.route)}
            >
              <View style={styles.actionIconContainer}>
                <Text style={styles.actionIcon}>{action.icon}</Text>
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
              <Text style={styles.actionArrow}>→</Text>
            </Pressable>
          </Animated.View>
        ))}
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(500).delay(600)}>
        <Pressable style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
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
    marginBottom: 24,
    alignItems: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logo: {
    fontSize: 40,
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
  roleCard: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 24,
  },
  roleIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  roleIcon: {
    fontSize: 32,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  roleBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  actionsContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  actionCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  actionArrow: {
    fontSize: 20,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  logoutButton: {
    marginHorizontal: 16,
    backgroundColor: '#F44336',
    padding: 18,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F44336',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 24,
  },
  logoutIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
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
  footer: {
    height: 24,
  },
});
