import emailjs from '@emailjs/browser';

// EmailJS configuration - replace with your actual EmailJS credentials
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

emailjs.init(EMAILJS_PUBLIC_KEY);

export const sendEmailNotification = async (
  toEmail: string,
  subject: string,
  message: string
) => {
  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_email: toEmail,
      subject,
      message,
    });
    console.log('Email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// SMS notification using TextBee or similar service
export const sendSMSNotification = async (
  phoneNumber: string,
  message: string
) => {
  try {
    // Integrate with TextBee or similar SMS service
    // This is a placeholder - replace with actual SMS API
    console.log(`SMS to ${phoneNumber}: ${message}`);
    return true;
  } catch (error) {
    console.error('Error sending SMS:', error);
    return false;
  }
};

// Send order confirmation
export const sendOrderConfirmation = async (
  email: string,
  phone: string,
  orderId: string,
  total: number
) => {
  const emailSubject = `Order Confirmation - ${orderId}`;
  const emailMessage = `Your order has been placed successfully!\n\nOrder ID: ${orderId}\nTotal: ₹${total}\n\nThank you for shopping with Califnco!`;
  
  const smsMessage = `Order confirmed! ID: ${orderId}, Total: ₹${total}. Thank you for shopping with Califnco!`;
  
  await Promise.all([
    sendEmailNotification(email, emailSubject, emailMessage),
    sendSMSNotification(phone, smsMessage),
  ]);
};

// Send service booking confirmation
export const sendServiceConfirmation = async (
  email: string,
  phone: string,
  serviceId: string,
  preferredDate: string
) => {
  const emailSubject = `Service Booking Confirmed - ${serviceId}`;
  const emailMessage = `Your service booking has been confirmed!\n\nService ID: ${serviceId}\nPreferred Date: ${preferredDate}\n\nOur team will contact you shortly.`;
  
  const smsMessage = `Service booked! ID: ${serviceId}, Date: ${preferredDate}. Our team will contact you soon.`;
  
  await Promise.all([
    sendEmailNotification(email, emailSubject, emailMessage),
    sendSMSNotification(phone, smsMessage),
  ]);
};
