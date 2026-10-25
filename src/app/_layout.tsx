import { Stack } from 'expo-router';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { PaymentProvider } from '@/contexts/PaymentContext';

export default function TabLayout() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <PaymentProvider>
          <CartProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="login" />
              <Stack.Screen name="signup" />
              <Stack.Screen name="dealer" />
              <Stack.Screen name="products" />
              <Stack.Screen name="product/[id]" />
              <Stack.Screen name="cart" />
              <Stack.Screen name="checkout" />
              <Stack.Screen name="admin" />
              <Stack.Screen name="orders" />
              <Stack.Screen name="service" />
              <Stack.Screen name="profile" />
            </Stack>
          </CartProvider>
        </PaymentProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
