"use client"

import { Search,Filter } from "lucide-react"
import { Input } from "../../../Custom/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../Custom/ui/select"

export function SubscriptionFilters({
  search,
  onSearch,
  status,
  onStatus,
  plan,
  onPlan,
  period,
  onPeriod,

}: {
  search: string
  onSearch: (v: string) => void
  status: string
  onStatus: (v: string) => void
  plan: string
  onPlan: (v: string) => void
  period: string
  onPeriod: (v: string) => void
  onExport: () => void
  onCreate: () => void
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
      <div className="flex flex-col md:flex-row gap-3 flex-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by workspace, owner email, or subscription ID..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 items-center">
          <Filter className="h-4 w-4 text-gray-400" />
          <Select value={status} onValueChange={onStatus}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="trialing">Trialing</SelectItem>
              <SelectItem value="past_due">Past due</SelectItem>
              <SelectItem value="canceled">Canceled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={plan} onValueChange={onPlan}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>

          <Select value={period} onValueChange={onPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Billing period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Periods</SelectItem>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="year">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2">
        {/* <Button variant="outline" onClick={onExport} className="flex items-center gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Export
        </Button> */}
        {/* <Button onClick={onCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Subscription
        </Button> */}
      </div>
    </div>
  )
}
