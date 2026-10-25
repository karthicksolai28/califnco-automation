import React, { createContext, useContext } from 'react';
import RazorpayCheckout from 'react-native-razorpay';

interface PaymentContextType {
  initiatePayment: (amount: number, orderId: string) => Promise<boolean>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const initiatePayment = async (amount: number, orderId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const options = {
        description: 'Payment for water purifier products',
        image: 'https://your-logo-url.com/logo.png',
        currency: 'INR',
        key: 'rzp_test_YOUR_KEY_HERE', // Replace with your Razorpay test key
        amount: amount * 100, // Amount in paise
        name: 'Califnco',
        order_id: orderId,
        prefill: {
          email: 'user@example.com',
          contact: '9999999999',
          name: 'User Name',
        },
        theme: { color: '#2196F3' },
      };

      try {
        RazorpayCheckout.open(options)
          .then((data) => {
            console.log('Payment success:', data);
            resolve(true);
          })
          .catch((error) => {
            console.log('Payment failed:', error);
            resolve(false);
          });
      } catch (error) {
        console.error('Razorpay error:', error);
        resolve(false);
      }
    });
  };

  return (
    <PaymentContext.Provider value={{ initiatePayment }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within PaymentProvider');
  }
  return context;
}
