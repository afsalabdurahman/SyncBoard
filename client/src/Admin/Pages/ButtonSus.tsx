
// import { loadStripe } from '@stripe/stripe-js';
// import apiService from '../../Services/api';
// const STRIPE_LOAD = import.meta.env.VITE_BASE_STRIPELOAD;
// const stripePromise = loadStripe(STRIPE_LOAD);

// export default function SubscribeButton() {
//   const handleSubscribe = async () => {
//     try {
//       const body = {
//   planKey: "pro",
//   paymentMethodId: "pm_card_visa", // ✅ test method, works with  customer
//   quantity: 1
// };

//       const res = await apiService.post("checkout/pay", body, {
//         headers: { "Content-Type": "application/json" }
//       });
   
//     } catch (error) {
//     }
  
// }
//   return <button onClick={handleSubscribe}>Subscribe</button>;
// }
