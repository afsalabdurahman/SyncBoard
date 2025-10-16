import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Calendar, CreditCard, DollarSign } from "lucide-react"

export function WorkspaceBillingCard({
  plan,
  amount,
  currency,
  interval,
  nextRenewal,
  paymentMethod,
  status,
  cancelAtPeriodEnd,
}: {
  plan: "basic" | "pro" | "enterprise"
  amount: number
  currency: "USD"
  interval: "month" | "year"
  nextRenewal: string
  paymentMethod: {
    brand: "visa" | "mastercard" | "amex" | "discover"
    last4: string
    expMonth: number
    expYear: number
  }
  status: "active" | "trialing" | "past_due" | "canceled"
  cancelAtPeriodEnd: boolean
}) {
  const planColors = {
    basic: "bg-gray-100 text-gray-800",
    pro: "bg-purple-100 text-purple-800",
    enterprise: "bg-orange-100 text-orange-800",
  } as const

  const statusColors = {
    active: "bg-green-100 text-green-800",
    trialing: "bg-blue-100 text-blue-800",
    past_due: "bg-orange-100 text-orange-800",
    canceled: "bg-gray-100 text-gray-800",
  } as const

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Billing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className={planColors[plan]}>
            {plan.charAt(0).toUpperCase() + plan.slice(1)} · {interval === "year" ? "Yearly" : "Monthly"}
          </Badge>
          <Badge variant="secondary" className={statusColors[status]}>
            {status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-gray-800">
          <DollarSign className="h-4 w-4 text-gray-400" />
          <span className="font-medium">
            ${amount.toLocaleString()} {currency} {interval === "month" ? "/mo" : "/yr"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span>
            Next renewal on <span className="font-medium">{fmtDate(nextRenewal)}</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <CreditCard className="h-4 w-4 text-gray-400" />
          <span className="uppercase">{paymentMethod.brand}</span>
          <span>•••• {paymentMethod.last4}</span>
          <span className="text-gray-500">
            {String(paymentMethod.expMonth).padStart(2, "0")}/{String(paymentMethod.expYear).slice(-2)}
          </span>
        </div>

        {cancelAtPeriodEnd && <div className="text-sm text-red-600">Cancels at period end</div>}
      </CardContent>
    </Card>
  )
}
