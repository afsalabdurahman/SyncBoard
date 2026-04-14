import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../Custom/ui/card"
import { Progress } from "../../Custom/ui/progress"
import { Activity, FolderOpen, Users, } from "lucide-react"
import type { UsageMetrics as UsageMetricsType } from "../subscription-page"

interface UsageMetricsProps {
  usageMetrics: UsageMetricsType
}

export default function UsageMetrics({ usageMetrics }: UsageMetricsProps) {

  const formatUsage = (current: number, limit: number, unit?: string) => {
    if (limit === -1) return `${current.toLocaleString()}${unit ? ` ${unit}` : ""} (Unlimited)`
    return `${current.toLocaleString()}${unit ? ` ${unit}` : ""} / ${limit.toLocaleString()}${unit ? ` ${unit}` : ""}`
  }

  const getUsagePercentage = (current: number, limit: number) => {
    if (limit === -1) return 0
    return Math.min((current / limit) * 100, 100)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Usage & Limits
        </CardTitle>
        <CardDescription>Current usage across your account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Projects</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatUsage(usageMetrics.projects.current, usageMetrics.projects.limit)}
              </span>
            </div>
            {usageMetrics.projects.limit !== -1 && (
              <Progress
                value={getUsagePercentage(usageMetrics.projects.current, usageMetrics.projects.limit)}
                className="h-2"
              />
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-500" />
                <span className="font-medium">Team Members</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatUsage(usageMetrics.users.current, usageMetrics.users.limit)}
              </span>
            </div>
            {usageMetrics.users.limit !== -1 && (
              <Progress
                value={getUsagePercentage(usageMetrics.users.current, usageMetrics.users.limit)}
                className="h-2"
              />
            )}
          </div>

         

        </div>
      </CardContent>
    </Card>
  )
}
