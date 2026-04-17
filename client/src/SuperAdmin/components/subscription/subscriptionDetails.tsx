import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../Custom/ui/dialog";
import { Badge } from "../../../Custom/ui/badge";
import { Card, CardContent } from "../../../Custom/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../../Custom/ui/avatar";
import { Calendar, CreditCard, DollarSign, Mail, User } from "lucide-react";
import type { Subscription } from "./subscriptionTable";

export function SubscriptionDetails({
  open,
  onOpenChange,
  sub,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sub: Subscription | null;
}) {
  if (!sub) return null;

  const formatDate = (dateStr?: string | number | Date) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount?: number, currency = "USD") => {
    if (amount === undefined || amount === null) return "—";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount / 100); // assuming amount is in cents
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "trialing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "past_due":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "canceled":
      case "unpaid":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[920px] max-w-[95vw] h-[90vh] max-h-[680px] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-xl">Subscription Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Workspace Info */}
          <Card className="border shadow-sm">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage
                    src={sub.workspace?.avatar}
                    alt={sub.workspace?.name}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                    {sub.workspace?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-gray-900 truncate">
                    {sub.workspace?.name || "Unknown Workspace"}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <User className="h-4 w-4" />
                      <span>{sub.workspace?.ownerName || "—"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">
                        {sub.workspace?.ownerEmail || "—"}
                      </span>
                    </div>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className="whitespace-nowrap px-3 py-1 text-sm"
                >
                  {sub.plan?.charAt(0).toUpperCase() + sub.plan?.slice(1) || "—"} ·{" "}
                  {sub.interval === "year" ? "Yearly" : "Monthly"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Billing & Payment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Billing Info */}
            <Card className="border shadow-sm">
              <CardContent className="p-5 space-y-4">
                <h4 className="font-semibold text-gray-900">Billing</h4>

                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-medium text-lg">
                      {sub.amount}
                      <span className="text-sm text-gray-500 ml-1">
                        {sub.interval === "month" ? "/ month" : "/ year"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-600">
                      Renews on{" "}
                      <span className="font-medium text-gray-900">
                        {formatDate(sub.currentPeriodEnd)}
                      </span>
                    </div>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className={`px-3 py-1 ${getStatusColor(sub.status)}`}
                >
                  {sub.status
                    ?.replace("_", " ")
                    .split(" ")
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(" ") || "Unknown"}
                </Badge>

                {sub.cancelAtPeriodEnd && (
                  <p className="text-sm text-red-600 font-medium">
                    Scheduled to cancel at period end
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="border shadow-sm">
              <CardContent className="p-5 space-y-4">
                <h4 className="font-semibold text-gray-900">Payment Method</h4>

                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-gray-500" />
                  <div className="font-medium uppercase">
                    {sub.paymentMethod?.brand || "—"}
                  </div>
                  <div className="text-gray-700">
                    •••• {sub.paymentMethod?.last4 || "—"}
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  Expires{" "}
                  {sub.paymentMethod?.expMonth
                    ? `${String(sub.paymentMethod.expMonth).padStart(2, "0")}/${
                        String(sub.paymentMethod.expYear).slice(-2)
                      }`
                    : "—"}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Invoices */}
          <Card className="border shadow-sm">
            <CardContent className="p-5">
              <h4 className="font-semibold text-gray-900 mb-4">Recent Invoices</h4>

              {sub.history?.length > 0 ? (
                <div className="space-y-3 divide-y divide-gray-100">
                  {sub.history.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between py-3 first:pt-0 last:pb-0 text-sm"
                    >
                      <div className="font-medium text-gray-900">
                        INV-{invoice.id.slice(-8)}
                      </div>

                      <div className="text-gray-600">
                        {formatDate(invoice.date || invoice.period_end)}
                      </div>

                      <div className="font-medium">
                        {formatCurrency(invoice.amount, invoice.currency)}
                      </div>

                      <Badge
                        variant="outline"
                        className={
                          invoice.status === "paid"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {invoice.status?.toUpperCase() || "UNKNOWN"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No invoice history available
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}