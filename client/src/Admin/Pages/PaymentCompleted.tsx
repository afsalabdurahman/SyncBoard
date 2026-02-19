import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const ADMIN_URL = import.meta.env.VITE_BASE_ADMIN_DASHBOARD;
const PaymentCompleted: React.FC = () => {
    const navigate = useNavigate()
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Redirect to homepage
         window.location.href = ADMIN_URL;

          //window.location.href = '/';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-4">
            <CheckCircle className="w-20 h-20 text-green-500" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Completed!</h1>
        <p className="text-gray-600 mb-4">Your transaction was successful</p>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Redirecting to homepage in <span className="font-bold text-green-600">{seconds}</span> seconds...
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCompleted;