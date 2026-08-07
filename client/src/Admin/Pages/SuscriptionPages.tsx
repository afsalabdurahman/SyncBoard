
import {  useState } from "react"
import CurrentPlanOverview from "../components/CurrentPlanSus"
import UsageMetricsComponent from "../components/UsagesInSus"
import PaymentInfoComponent from "../components/PaymentInfoSus"
import {  useSelector } from "react-redux"
import { checkoutapi } from "../apis/checkoutApi"
import { RootState } from "../../Redux/store"
export type Plan = "Free" | "Pro" | "Enterprise"

export interface PaymentInfo {
  plan: Plan
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
  const myPlan = useSelector((state: RootState) => {
    return state.subscriptions.subscription?.planKey ?? "free"
  })
  // const planStatus = useSelector((state) => {
  //   return state.subscriptions.subscription.status
  // })

  const [currentPlan, ] = useState<Plan>(myPlan)
  const [paymentInfo, ] = useState<PaymentInfo | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const userId = useSelector((state: RootState) => state.user.user?._id)
  const projectCount = useSelector((state: RootState) => state.projects.list.length)
  const userCount = useSelector((state: RootState) => state.alluser.users.length)

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

 

  const handleUpgrade = async (targetPlan: Plan) => {
    setIsProcessing(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

  


    await checkoutapi(userId, targetPlan).then((res) => {
    
       window.location.href = res
    })

  }



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
