
import { loadStripe } from '@stripe/stripe-js';
import apiService from '../../Services/api';

const stripePromise = loadStripe("pk_test_51S8JawHNHB0pEq2tQemS9BWEztf7DOce7UozEXOyBkl9ZA5BzBB3rKVXfYHauQi4HyewbOw1IBZvYapaZm19Xpfy00zJK78Rju");

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
      console.log(res)
    } catch (error) {
        console.log(error,"error")
    }
  
}
  return <button onClick={handleSubscribe}>Subscribe</button>;
}
