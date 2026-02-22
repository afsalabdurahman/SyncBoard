
import { loadStripe } from '@stripe/stripe-js';
import apiService from '../../Services/api';

const stripePromise = loadStripe("pk_test_51SfaOV3EZFQ8xirUTUtdZA8XROUSiXsJVjUTCyMkdowB4muIyQRngI7w2jLEoI28B8znTrmaIydrdXpVRZl2nSwg001Qcxy9Zb");

export default function SubscribeButton() {
  const handleSubscribe = async () => {
    try {
      const body = {
  planKey: "pro",
  paymentMethodId: "pm_card_visa", // ✅ test method, works with any customer
  quantity: 1
};

      const res = await apiService.post("checkout/pay", body, {
        headers: { "Content-Type": "application/json" }
      });
   
    } catch (error) {
        console.log(error,"error")
    }
  
}
  return <button onClick={handleSubscribe}>Subscribe</button>;
}
