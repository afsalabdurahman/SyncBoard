import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { CreditCard } from "lucide-react"
import type { PaymentInfo as PaymentInfoType } from "../subscription-page"

interface PaymentInfoProps {
  paymentInfo: PaymentInfoType
}

export default function PaymentInfo({ paymentInfo }: PaymentInfoProps) {
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
        <CardTitle className="flex items-center gap-2 text-lg">
          <CreditCard className="h-5 w-5" />
          Last Payment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Amount</p>
            <p className="font-semibold">{paymentInfo.amount}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Date</p>
            <p className="font-semibold">{paymentInfo.date}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Status</p>
            <Badge className={getStatusColor(paymentInfo.status)}>{paymentInfo.status}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
