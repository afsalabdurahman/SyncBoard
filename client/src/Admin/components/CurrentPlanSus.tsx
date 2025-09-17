

import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { CheckCircle } from "lucide-react";
import type { Plan } from "../subscription-page";

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
  const planDetails = {
    Free: { price: "$0", features: ["Basic features", "Limited usage"] },
    Pro: {
      price: "$10",
      features: ["All basic features", "Advanced tools", "Priority support"],
    },
    Enterprise: {
      price: "$50",
      features: [
        "All Pro features",
        "Custom integrations",
        "Dedicated support",
        "Advanced analytics",
      ],
    },
  };

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
              {currentPlan} Plan Active
            </span>
            <Badge variant='secondary' className='ml-2'>
              {planDetails[currentPlan].price}
            </Badge>
          </div>

          <div className='text-sm text-muted-foreground'>
            <ul className='space-y-1'>
              {planDetails[currentPlan].features.map((feature, index) => (
                <li key={index}>• {feature}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className='space-y-3'>
          {currentPlan === "Free" && (
            <>
              <Button
                onClick={() => onUpgrade("Pro")}
                disabled={isProcessing}
                className='w-full'
                size='lg'
              >
                {isProcessing ? "Processing..." : "Upgrade to Pro - $10/month"}
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

          {currentPlan === "Pro" && (
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

          {currentPlan === "Enterprise" && (
            <div className='text-center py-4'>
              <p className='text-muted-foreground'>
                You're on our highest tier plan!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
