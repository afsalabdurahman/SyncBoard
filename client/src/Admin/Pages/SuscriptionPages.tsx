
import { useState } from "react"
import CurrentPlanOverview from "../components/CurrentPlanSus"
import UsageMetricsComponent from "../components/UsagesInSus"
import PaymentInfoComponent from "../components/PaymentInfoSus"
import BillingHistory from "../components/BillSuscription"
import ButtonSus from "./ButtonSus"
import { useSearchParams, useNavigate } from "react-router-dom";
// import CheckoutPage from "./CheckoutPage"
import apiService from "../../Services/apiServices/apiService";
import { useSelector } from "react-redux"
import { stat } from "fs"
export type Plan = "Free" | "Pro" | "Enterprise"

export interface PaymentInfo {
  plan:Plan
  amount: string
  date: string
  status: "Success" | "Failed" | "Pending"
}

export interface BillingRecord {
  id: string
  amount: string
  date: string
  status: "Success" | "Failed" | "Pending"
  description: string
}

export interface UsageMetrics {
  projects: { current: number; limit: number }
  users: { current: number; limit: number }
  storage: { current: number; limit: number; unit: string }
  apiCalls: { current: number; limit: number }
}

export default function SubscriptionPage() {
    const myPlan=useSelector((state)=>{
   return state.suscription.subscription.planKey ?? "free"
})
const planStatus = useSelector((state)=>{
  return state.suscription.subscription.status
})


  const [currentPlan, setCurrentPlan] = useState<Plan>(myPlan)
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
const [checkout,setCheckout]=useState(false)
const userId=useSelector((state)=>state.user.user._id)
const projectCount= useSelector((state)=>state.projects.list.length)
const userCount = useSelector((state)=>state.alluser.users.length)

  const [usageMetrics] = useState<UsageMetrics>(() => {
    const baseMetrics = {
      free: {
        projects: { current: projectCount, limit: 1 },
        users: { current: userCount, limit: 5 },
        storage: { current: 0.5, limit: 1, unit: "GB" },
        apiCalls: { current: 850, limit: 1000 },
      },
        basic: {
        projects: { current: projectCount, limit: 3 },
        users: { current: userCount, limit: 15 },
        storage: { current: 0.5, limit: 1, unit: "GB" },
        apiCalls: { current: 850, limit: 1000 },
      },
      pro: {
        projects: { current: projectCount, limit: 25 },
        users: { current: userCount, limit: 10 },
        storage: { current: 12, limit: 50, unit: "GB" },
        apiCalls: { current: 15000, limit: 50000 },
      },
      enterprise: {
        projects: { current: projectCount, limit: -1 },
        users: { current: userCount, limit: -1 },
        storage: { current: 180, limit: 500, unit: "GB" },
        apiCalls: { current: 125000, limit: -1 },
      },
    }
    return baseMetrics[currentPlan]
  })

  const [billingHistory] = useState<BillingRecord[]>([
    {
      id: "1",
      amount: "$10.00",
      date: "2024-01-15",
      status: "Success",
      description: "Basic Plan - Monthly",
    },
    {
      id: "2",
      amount: "$20.00",
      date: "2023-12-15",
      status: "Success",
      description: "Pro Plan - Monthly",
    },
    {
      id: "3",
      amount: "$50.00",
      date: "2023-11-15",
      status: "Success",
      description: "Pro Plan - Monthly",
    },
  ])

  const handleUpgrade = async (targetPlan: Plan) => {

    setIsProcessing(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

 const amount =
  targetPlan === "Basic"
    ? "$10/month"
    : targetPlan === "Pro"
    ? "$20/month"
    : "$50/month";

    const currentDate = new Date().toLocaleDateString()



    apiService.post(`/checkout/payment/${userId}`,{
      plan:targetPlan
    }).then((res)=>{
    
       window.location.href = res.data
    })
//  setCheckout(true)
    // setCurrentPlan(targetPlan)
    // setIsProcessing(false)
  }

// if(checkout){
//   return(<CheckoutPage setCheckout={setCheckout} payamentInfo={paymentInfo}/>)
// }



  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <CurrentPlanOverview currentPlan={currentPlan} isProcessing={isProcessing} onUpgrade={handleUpgrade} />

      <UsageMetricsComponent usageMetrics={usageMetrics} />

      {paymentInfo && <PaymentInfoComponent paymentInfo={paymentInfo} />}
{/* 
      <BillingHistory billingHistory={billingHistory} /> */}
      {/* <ButtonSus/> */}
    </div>
  )
}
