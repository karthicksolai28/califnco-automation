import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function ProfileScreen() {
  const { user, role, logout } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.email?.split('@')[0] || '');
  const [phone, setPhone] = useState('');

  const handleUpdateProfile = async () => {
    try {
      const userRef = doc(db, 'users', user?.uid);
      await updateDoc(userRef, {
        displayName,
        phone,
      });
      Alert.alert('Success', 'Profile updated successfully');
      setEditing(false);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout, style: 'destructive' },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>{user?.email?.[0]?.toUpperCase() || 'U'}</Text>
        </View>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>{user?.email}</Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user?.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Role</Text>
            <View style={[styles.roleBadge, { backgroundColor: role === 'admin' ? '#9C27B0' : role === 'dealer' ? '#FF9800' : '#2196F3' }]}>
              <Text style={styles.roleText}>{role?.toUpperCase()}</Text>
            </View>
          </View>

          {editing ? (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Display Name</Text>
                <TextInput
                  style={styles.input}
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="Enter display name"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                />
              </View>

              <Pressable style={styles.saveButton} onPress={handleUpdateProfile}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </Pressable>

              <Pressable style={styles.cancelButton} onPress={() => setEditing(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
            </>
          ) : (
            <Pressable style={styles.editButton} onPress={() => setEditing(true)}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <Pressable style={styles.actionButton} onPress={() => router.push('/orders')}>
            <Text style={styles.actionIcon}>📋</Text>
            <Text style={styles.actionText}>Order History</Text>
            <Text style={styles.actionArrow}>→</Text>
          </Pressable>

          {role === 'customer' && (
            <Pressable style={styles.actionButton} onPress={() => router.push('/service')}>
              <Text style={styles.actionIcon}>🔧</Text>
              <Text style={styles.actionText}>Book Service</Text>
              <Text style={styles.actionArrow}>→</Text>
            </Pressable>
          )}
        </View>

        <Animated.View entering={FadeInUp.duration(500).delay(400)}>
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>Logout</Text>
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
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
  avatar: {
    fontSize: 48,
    color: '#fff',
    fontWeight: '700',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    paddingHorizontal: 16,
  },
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  roleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
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
  editButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    marginBottom: 12,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  actionText: {
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
  footer: {
    height: 24,
  },
});
