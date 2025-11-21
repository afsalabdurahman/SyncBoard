
import { useState, useMemo } from "react"

//import { Header } from "../../../Custom/ui/headr"
import { Card, CardContent } from "../../Custom/ui/card"
import { Input } from "../../Custom/ui/input"
import { Button } from "../../Custom/ui/button"
import { Badge } from "../../Custom/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../Custom/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../Custom/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../Custom/ui/dropdown-menu"
// import {
//   Pagination,
//   PaginationContent,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "../../../Custom/ui/p"

import { Search, Shield, MoreVertical, Eye, Ban, CheckCircle, AlertTriangle, Filter, Download } from "lucide-react"

type ReportStatus = "pending" | "investigating" | "resolved" | "dismissed"
type ReportSeverity = "low" | "medium" | "high" | "critical"
type ReportType = "spam" | "harassment" | "inappropriate" | "copyright" | "fraud" | "other"

interface AbuseReport {
  id: string
  reportedBy: string
  reportedAt: string
  targetType: "user" | "content" | "workspace"
  targetId: string
  targetName: string
  type: ReportType
  severity: ReportSeverity
  status: ReportStatus
  description: string
  evidence?: string
  assignedTo?: string
}

// Mock abuse reports data
const mockReports: AbuseReport[] = [
  {
    id: "report_001",
    reportedBy: "user_sarah_j",
    reportedAt: "2025-11-20T10:30:00Z",
    targetType: "user",
    targetId: "user_789",
    targetName: "spam_account_42",
    type: "spam",
    severity: "high",
    status: "pending",
    description: "User is sending unsolicited promotional messages to multiple users",
    evidence: "Screenshot of spam messages",
    assignedTo: "Admin User",
  },
  {
    id: "report_002",
    reportedBy: "user_michael_w",
    reportedAt: "2025-11-20T09:15:00Z",
    targetType: "content",
    targetId: "post_456",
    targetName: "Blog Post: Fake Product Review",
    type: "fraud",
    severity: "critical",
    status: "investigating",
    description: "Fraudulent product review with fake testimonials and manipulated ratings",
    evidence: "Multiple screenshots",
    assignedTo: "Security Team",
  },
  {
    id: "report_003",
    reportedBy: "user_lisa_k",
    reportedAt: "2025-11-20T08:45:00Z",
    targetType: "user",
    targetId: "user_234",
    targetName: "aggressive_user_88",
    type: "harassment",
    severity: "high",
    status: "investigating",
    description: "User is harassing others with threatening language and personal attacks",
    evidence: "Chat logs attached",
  },
  {
    id: "report_004",
    reportedBy: "user_james_p",
    reportedAt: "2025-11-19T16:20:00Z",
    targetType: "content",
    targetId: "video_123",
    targetName: "Video: Copyright Material",
    type: "copyright",
    severity: "medium",
    status: "resolved",
    description: "Video contains copyrighted music without proper licensing",
    evidence: "DMCA notice",
    assignedTo: "Legal Team",
  },
  {
    id: "report_005",
    reportedBy: "user_emma_r",
    reportedAt: "2025-11-19T14:10:00Z",
    targetType: "workspace",
    targetId: "workspace_567",
    targetName: "Fake Business LLC",
    type: "fraud",
    severity: "critical",
    status: "investigating",
    description: "Workspace appears to be a front for a phishing operation",
    evidence: "Multiple user complaints",
    assignedTo: "Security Team",
  },
  {
    id: "report_006",
    reportedBy: "user_david_m",
    reportedAt: "2025-11-19T11:30:00Z",
    targetType: "content",
    targetId: "post_789",
    targetName: "Comment: Offensive Language",
    type: "inappropriate",
    severity: "medium",
    status: "resolved",
    description: "Comment contains offensive language and hate speech",
    evidence: "Screenshot",
  },
  {
    id: "report_007",
    reportedBy: "user_sophia_t",
    reportedAt: "2025-11-19T09:00:00Z",
    targetType: "user",
    targetId: "user_901",
    targetName: "bot_account_55",
    type: "spam",
    severity: "low",
    status: "dismissed",
    description: "Suspected bot account posting repetitive content",
    evidence: "Activity logs",
  },
  {
    id: "report_008",
    reportedBy: "user_alex_b",
    reportedAt: "2025-11-18T15:45:00Z",
    targetType: "content",
    targetId: "image_345",
    targetName: "Image: Inappropriate Content",
    type: "inappropriate",
    severity: "high",
    status: "resolved",
    description: "Image contains inappropriate content that violates community guidelines",
    evidence: "Flagged image",
    assignedTo: "Moderation Team",
  },
]

const statusColors: Record<ReportStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  investigating: "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
  dismissed: "bg-gray-100 text-gray-800",
}

const severityColors: Record<ReportSeverity, string> = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
}

const typeColors: Record<ReportType, string> = {
  spam: "bg-purple-100 text-purple-800",
  harassment: "bg-red-100 text-red-800",
  inappropriate: "bg-orange-100 text-orange-800",
  copyright: "bg-blue-100 text-blue-800",
  fraud: "bg-pink-100 text-pink-800",
  other: "bg-gray-100 text-gray-800",
}

export  const AbuseReportsPage =()=> {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "all">("all")
  const [severityFilter, setSeverityFilter] = useState<ReportSeverity | "all">("all")
  const [typeFilter, setTypeFilter] = useState<ReportType | "all">("all")
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 10

  // Filter and search reports
  const filteredReports = useMemo(() => {
    return mockReports.filter((report) => {
      const matchesSearch =
        searchTerm === "" ||
        report.targetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reportedBy.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || report.status === statusFilter
      const matchesSeverity = severityFilter === "all" || report.severity === severityFilter
      const matchesType = typeFilter === "all" || report.type === typeFilter

      return matchesSearch && matchesStatus && matchesSeverity && matchesType
    })
  }, [searchTerm, statusFilter, severityFilter, typeFilter])

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedReports = filteredReports.slice(startIndex, startIndex + itemsPerPage)

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Statistics
  const stats = {
    total: mockReports.length,
    pending: mockReports.filter((r) => r.status === "pending").length,
    investigating: mockReports.filter((r) => r.status === "investigating").length,
    critical: mockReports.filter((r) => r.severity === "critical").length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
 

     <main className={`transition-all duration-300 pt-16 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
        <div className="p-6 space-y-6">
          {/* Page header */}
          <div className="rounded-xl bg-white border p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Abuse Reports</h1>
                  <p className="text-sm text-gray-600 mt-1">Review and manage reported content and users</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Filter className="h-4 w-4" />
                  Advanced Filters
                </Button>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Reports</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-gray-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Investigating</p>
                    <p className="text-2xl font-bold text-blue-600 mt-1">{stats.investigating}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Eye className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Critical</p>
                    <p className="text-2xl font-bold text-red-600 mt-1">{stats.critical}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            <Select
              value={statusFilter}
              onValueChange={(v: any) => {
                setStatusFilter(v)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={severityFilter}
              onValueChange={(v: any) => {
                setSeverityFilter(v)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All severities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={typeFilter}
              onValueChange={(v: any) => {
                setTypeFilter(v)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="spam">Spam</SelectItem>
                <SelectItem value="harassment">Harassment</SelectItem>
                <SelectItem value="inappropriate">Inappropriate</SelectItem>
                <SelectItem value="copyright">Copyright</SelectItem>
                <SelectItem value="fraud">Fraud</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results info */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{paginatedReports.length}</span> of{" "}
              <span className="font-medium">{filteredReports.length}</span> reports
            </p>
          </div>

          {/* Reports table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report ID</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reported By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedReports.length > 0 ? (
                    paginatedReports.map((report) => (
                      <TableRow key={report.id} className="hover:bg-gray-50">
                        <TableCell className="font-mono text-xs text-gray-600">{report.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{report.targetName}</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {report.targetType.charAt(0).toUpperCase() + report.targetType.slice(1)} •{" "}
                              {report.targetId}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={typeColors[report.type]}>
                            {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={severityColors[report.severity]}>
                            {report.severity.charAt(0).toUpperCase() + report.severity.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={statusColors[report.status]}>
                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-700">{report.reportedBy}</TableCell>
                        <TableCell className="text-sm text-gray-600">{formatTime(report.reportedAt)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="gap-2">
                                <Eye className="h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2">
                                <CheckCircle className="h-4 w-4" />
                                Mark as Resolved
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="gap-2 text-red-600">
                                <Ban className="h-4 w-4" />
                                Take Action
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        No abuse reports found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={page === currentPage}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={cn(currentPage === totalPages && "pointer-events-none opacity-50")}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
