"use client"

import { Search, Filter } from "lucide-react"
import { Input } from "../../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"

export function AnalyticsFilters({
  search,
  onSearch,
  range,
  onRange,
  granularity,
  onGranularity,
  workspace,
  onWorkspace,
}: {
  search: string
  onSearch: (v: string) => void
  range: string
  onRange: (v: string) => void
  granularity: string
  onGranularity: (v: string) => void
  workspace: string
  onWorkspace: (v: string) => void
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
      <div className="relative w-full lg:max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search by workspace, user, or action..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <Filter className="h-4 w-4 text-gray-400" />
        <Select value={range} onValueChange={onRange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="365d">Last 12 months</SelectItem>
          </SelectContent>
        </Select>

        <Select value={granularity} onValueChange={onGranularity}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Granularity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Daily</SelectItem>
            <SelectItem value="week">Weekly</SelectItem>
            <SelectItem value="month">Monthly</SelectItem>
          </SelectContent>
        </Select>

        <Select value={workspace} onValueChange={onWorkspace}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Workspace" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Workspaces</SelectItem>
            <SelectItem value="acme">Acme Corporation</SelectItem>
            <SelectItem value="techstart">TechStart Inc</SelectItem>
            <SelectItem value="designstudio">Design Studio</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
