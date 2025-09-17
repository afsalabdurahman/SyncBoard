import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Calendar } from "lucide-react"
import type { BillingRecord } from "../subscription-page"

interface BillingHistoryProps {
  billingHistory: BillingRecord[]
}

export default function BillingHistory({ billingHistory }: BillingHistoryProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Success":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Billing History
        </CardTitle>
        <CardDescription>Your recent payment history</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {billingHistory.map((record) => (
            <div
              key={record.id}
              className="flex items-center justify-between py-3 border-b border-border last:border-0"
            >
              <div className="space-y-1">
                <p className="font-medium">{record.description}</p>
                <p className="text-sm text-muted-foreground">{record.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">{record.amount}</span>
                <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
