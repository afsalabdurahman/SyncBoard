

import { Button } from "../../Custom/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../Custom/ui/card";
import { Badge } from "../../Custom/ui/badge";
import { CheckCircle } from "lucide-react";
import type { Plan } from "../subscription-page";
import { useEffect, useState } from "react";
import { fetchAllPlans } from "../apis/checkoutApi";
import LoadingSpinner from "../../Custom/reusecomponents/LoadingSpinner";

interface CurrentPlanOverviewProps {
  currentPlan: Plan;
  isProcessing: boolean;
  onUpgrade: (targetPlan: Plan) => void;
}

export default function CurrentPlanOverview({
  currentPlan,
  isProcessing,
  onUpgrade,
}: CurrentPlanOverviewProps) {

  const [plans, setPlans] = useState([])

  useEffect(() => {
    async function fetchPlans() {
      const plan = await fetchAllPlans();
      setPlans(plan)
    }
    fetchPlans()
  }, [])

  const filterPlan = plans.filter((plan) => plan.key === currentPlan);

if(plans.length ==0) return <><LoadingSpinner/></>
  return (
    <Card className='w-full'>
      <CardHeader className='text-center'>
        <CardTitle className='text-2xl font-bold'>
          Current Subscription
        </CardTitle>
        <CardDescription>Your active plan and upgrade options</CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='text-center space-y-4'>
          <div className='flex items-center justify-center gap-2'>
            <CheckCircle className='h-5 w-5 text-green-500' />
            <span className='text-lg font-semibold'>
              {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} Plan Active
            </span>
            <Badge variant='secondary' className='ml-2'>
              {filterPlan[0].priceCents}
            </Badge>
          </div>

          <div className='text-sm text-muted-foreground'>
            <ul className='space-y-1'>
              {filterPlan[0].features.map((feature, index) => (
                <li key={index}>• {feature}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className='space-y-3'>
  {
    plans
      .filter(plan => plan.key !== "free" && plan.key !== currentPlan)
      .sort((a, b) => a.priceCents - b.priceCents)
      .map(plan => (
        <Button
          key={plan.key}
          onClick={() => onUpgrade(plan.key)}
          disabled={isProcessing}
          className="w-full"
          size="lg"
        >
          Upgrade to {plan.name} $ {plan.priceCents / 100}
        </Button>
      ))
  }
</div>

        {/* <div className='space-y-3'>
          {currentPlan === "free" && (
            <>
              <Button
                onClick={() => onUpgrade("Basic")}
                disabled={isProcessing}
                className='w-full'
                size='lg'
              >
                {isProcessing ? "Processing..." : "Upgrade to Basic - $10/month"}
              </Button>
              <Button
                onClick={() => onUpgrade("Pro")}
                disabled={isProcessing}
                className='w-full'
                size='lg'
              >
                {isProcessing ? "Processing..." : "Upgrade to Pro - $20/month"}
              </Button>
              <Button
                onClick={() => onUpgrade("Enterprise")}
                disabled={isProcessing}
                variant='outline'
                className='w-full'
                size='lg'
              >
                {isProcessing
                  ? "Processing..."
                  : "Upgrade to Enterprise - $50/month"}
              </Button>
            </>
          )}

{currentPlan === "basic" && (
            <>
              <Button
                onClick={() => onUpgrade("Pro")}
                disabled={isProcessing}
                className='w-full'
                size='lg'
              >
                {isProcessing ? "Processing..." : "Upgrade to Pro - $20/month"}
              </Button>
              <Button
                onClick={() => onUpgrade("Enterprise")}
                disabled={isProcessing}
                variant='outline'
                className='w-full'
                size='lg'
              >
                {isProcessing
                  ? "Processing..."
                  : "Upgrade to Enterprise - $50/month"}
              </Button>
            </>
          )}


          {currentPlan === "pro" && (
            <Button
              onClick={() => onUpgrade("Enterprise")}
              disabled={isProcessing}
              className='w-full'
              size='lg'
            >
              {isProcessing
                ? "Processing..."
                : "Upgrade to Enterprise - $50/month"}
            </Button>
          )}

          {currentPlan === "enterprise" && (
            <div className='text-center py-4'>
              <p className='text-muted-foreground'>
                You're on our highest tier plan!
              </p>
            </div>
          )} */}
        {/* </div> */}
      </CardContent>
    </Card>
  );
}
