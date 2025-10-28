import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "../../Custom/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../Custom/ui/card";
import { useSearchParams } from "react-router-dom";
import { Input } from "../../Custom/ui/input";
import { Label } from "../../Custom/ui/label";
import { Badge } from "../../Custom/ui/badge";
import { Separator } from "../../Custom/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../Custom/ui/select";
import { CreditCard, Lock, CheckCircle, Shield, ArrowLeft } from "lucide-react";
import apiService from "../../Services/apiServices/apiService";
import { useSelector } from "react-redux";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
type Plan = "Free" | "Pro" | "Enterprise";

export default function CheckoutPage({ setCheckout, payamentInfo }) {
 const [searchParams] = useSearchParams();

useEffect(()=>{
const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");
    const sessionId = searchParams.get("session_id");
})

 



  const userId: string = useSelector((state) => {
    return state.user.user._id;
  });

  console.log(setCheckout, "pspbss", payamentInfo);
  const [selectedPlan, setSelectedPlan] = useState<Plan>(payamentInfo.plan);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const planDetails = {
     Basic: {
      price: 10,
      monthly: "$10",
      yearly: "$100",
      features: [
        "All basic features",
        "Advanced tools",
        "Priority support",
        "25 projects",
        "10 team members",
      ],
    },
    Pro: {
      price: 10,
      monthly: "$10",
      yearly: "$100",
      features: [
        "All basic features",
        "Advanced tools",
        "Priority support",
        "25 projects",
        "10 team members",
      ],
    },
    Enterprise: {
      price: 50,
      monthly: "$50",
      yearly: "$500",
      features: [
        "All Pro features",
        "Custom integrations",
        "Dedicated support",
        "Advanced analytics",
        "Unlimited projects",
        "Unlimited team members",
      ],
    },
  };

  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [formData, setFormData] = useState({
    email: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(selectedPlan, "Data from");
   
  
    setIsProcessing(true);

    const data = {
      planKey: selectedPlan.toLowerCase(),
      paymentMethod: "card",
      qunatity: 100,
      email: formData.email,
    };
    try {
      const res = await apiService.post(`checkout/payment/${sessionId}`, {
        data,
      });
    } catch (error) {
      console.log(error, "error from api");
    }

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setIsProcessing(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className='w-full max-w-2xl mx-auto p-6'>
        <Card>
          <CardContent className='pt-6'>
            <div className='text-center space-y-6'>
              <CheckCircle className='h-20 w-20 text-green-500 mx-auto' />
              <div>
                <h2 className='text-3xl font-bold text-green-600'>
                  Payment Successful!
                </h2>
                <p className='text-muted-foreground mt-2 text-lg'>
                  Welcome to the {selectedPlan} plan! Your subscription is now
                  active.
                </p>
              </div>
              <div className='bg-green-50 p-4 rounded-lg'>
                <p className='text-sm text-green-700'>
                  A confirmation email has been sent to {formData.email}
                </p>
              </div>
              <Button onClick={() => window.location.reload()} size='lg'>
                Start Using Your Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentPrice =
    billingCycle === "monthly"
      ? planDetails[selectedPlan].monthly
      : planDetails[selectedPlan].yearly;
  const savings =
    billingCycle === "yearly" ? planDetails[selectedPlan].price * 2 : 0;

  const formsubmit = async () => {
    const body = {
      planKey: "pro",
      paymentMethodId: "pm_card_visa", // ✅ test method, works with any customer
      quantity: 2,
    };
    const res = await apiService.post("checkout/pay", body, {
      headers: { "Content-Type": "application/json" },
    });
    console.log(res, "response");
  };

  return (
    <div className='w-full max-w-6xl mx-auto p-6 space-y-8'>
      <div className='text-center space-y-4'>
        <h1 className='text-4xl font-bold'>Complete Your Subscription</h1>
        <p className='text-muted-foreground text-lg'>
          Choose your plan and secure your account today
        </p>
      </div>
      {/*  */}
      <div className='flex items-center gap-4 mb-6'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => setCheckout(false)}
          className='flex items-center gap-2'
        >
          <ArrowLeft className='h-4 w-4' />
          Back to Subscription
        </Button>
      </div>
      {/*  */}
      <div className='grid lg:grid-cols-3 gap-8'>
        <Card className='lg:col-span-1'>
          <CardHeader>
            <CardTitle>Select Plan</CardTitle>
            <CardDescription>
              Choose the plan that works best for you
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-3'>
              {(Object.keys(planDetails) as Plan[]).map((plan) => (
                <div
                  key={plan}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPlan === plan
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  <div className='flex justify-between items-center'>
                    <div>
                      <h3 className='font-semibold'>{plan}</h3>
                      <p className='text-sm text-muted-foreground'>
                        {billingCycle === "monthly"
                          ? planDetails[plan].monthly
                          : planDetails[plan].yearly}
                        {billingCycle === "yearly" &&
                          plan !== "Free" &&
                          " /year"}
                        {billingCycle === "monthly" &&
                          plan !== "Free" &&
                          " /month"}
                      </p>
                    </div>
                    {selectedPlan === plan && (
                      <CheckCircle className='h-5 w-5 text-primary' />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className='space-y-3'>
              <Label>Billing Cycle</Label>
              <Select
                value={billingCycle}
                onValueChange={(value: "monthly" | "yearly") =>
                  setBillingCycle(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='monthly'>Monthly</SelectItem>
                  <SelectItem value='yearly'>Yearly (Save 20%)</SelectItem>
                </SelectContent>
              </Select>
              {billingCycle === "yearly" && selectedPlan !== "Free" && (
                <p className='text-sm text-green-600'>
                  💰 Save ${savings} per year!
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className='lg:col-span-1'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <CreditCard className='h-5 w-5' />
              Order Summary
            </CardTitle>
            <CardDescription>Review your subscription details</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-3'>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-muted-foreground'>
                  Selected Plan
                </span>
                <Badge
                  variant={
                    selectedPlan === "Enterprise" ? "default" : "secondary"
                  }
                >
                  {selectedPlan}
                </Badge>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-muted-foreground'>
                  Billing Cycle
                </span>
                <Badge variant='outline'>{billingCycle}</Badge>
              </div>
            </div>

            <Separator />

            <div className='space-y-2'>
              <h4 className='font-semibold'>{selectedPlan} Plan Features:</h4>
              <ul className='text-sm text-muted-foreground space-y-1'>
                {planDetails[selectedPlan].features.map((feature, index) => (
                  <li key={index} className='flex items-center gap-2'>
                    <CheckCircle className='h-3 w-3 text-green-500 flex-shrink-0' />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div className='space-y-2'>
              <div className='flex justify-between'>
                <span>Subscription ({billingCycle})</span>
                <span>{currentPrice}</span>
              </div>
              {billingCycle === "yearly" && selectedPlan !== "Free" && (
                <div className='flex justify-between text-green-600'>
                  <span>Yearly discount</span>
                  <span>-${savings}</span>
                </div>
              )}
              <div className='flex justify-between'>
                <span>Setup fee</span>
                <span>$0</span>
              </div>
              <Separator />
              <div className='flex justify-between font-semibold text-lg'>
                <span>Total today</span>
                <span>{currentPrice}</span>
              </div>
              <p className='text-xs text-muted-foreground'>
                {billingCycle === "monthly"
                  ? "Billed monthly"
                  : "Billed yearly"}
                . Cancel anytime.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card className='lg:col-span-1'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Lock className='h-5 w-5' />
              Payment Details
            </CardTitle>
            <CardDescription className='flex items-center gap-2'>
              <Shield className='h-4 w-4' />
              Your payment information is secure and encrypted
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email Address</Label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  placeholder='john@example.com'
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='cardNumber'>Card Number</Label>
                <Input
                  id='cardNumber'
                  name='cardNumber'
                  placeholder='1234 5678 9012 3456'
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='expiryDate'>Expiry Date</Label>
                  <Input
                    id='expiryDate'
                    name='expiryDate'
                    placeholder='MM/YY'
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='cvv'>CVV</Label>
                  <Input
                    id='cvv'
                    name='cvv'
                    placeholder='123'
                    value={formData.cvv}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='name'>Cardholder Name</Label>
                <Input
                  id='name'
                  name='name'
                  placeholder='John Doe'
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <Separator />

              <div className='space-y-4'>
                <h4 className='font-semibold'>Billing Address</h4>

                <div className='space-y-2'>
                  <Label htmlFor='address'>Street Address</Label>
                  <Input
                    id='address'
                    name='address'
                    placeholder='123 Main Street'
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='city'>City</Label>
                    <Input
                      id='city'
                      name='city'
                      placeholder='New York'
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='zipCode'>ZIP Code</Label>
                    <Input
                      id='zipCode'
                      name='zipCode'
                      placeholder='10001'
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='country'>Country</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, country: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select country' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='us'>United States</SelectItem>
                      <SelectItem value='ca'>India</SelectItem>
                      <SelectItem value='uk'>United Kingdom</SelectItem>
                      <SelectItem value='au'>Australia</SelectItem>
                      <SelectItem value='de'>Germany</SelectItem>
                      <SelectItem value='fr'>France</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={formsubmit}
                type='submit'
                className='w-full'
                size='lg'
                disabled={isProcessing || selectedPlan === "Free"}
              >
                {isProcessing
                  ? "Processing Payment..."
                  : selectedPlan === "Free"
                  ? "Free Plan Selected"
                  : `Complete Purchase - ${currentPrice}`}
              </Button>

              <p className='text-xs text-muted-foreground text-center'>
                🔒 Secured by 256-bit SSL encryption. By completing this
                purchase, you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
