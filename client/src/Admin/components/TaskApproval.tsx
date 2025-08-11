
import { useEffect, useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Textarea } from "../../components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Label } from "../../components/ui/label"
import { Check, X, Clock } from 'lucide-react'
import apiService from "../../services/api"

interface Task {
  id: string
  taskName: string
  project: string
  username: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  rejectionReason?: string
}

export  const TaskApproval=()=> {
  const [tasks, setTasks] = useState<Task[]>([])


    const [refreshKey, setRefreshKey] = useState(0);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")

// axios call all completed task
useEffect(()=>{
apiService.get("task/completed").then((response)=>{
  console.log(response,"from server+++")
  const data=response.data
  setTasks([...data])
})
},[refreshKey])

//


  const handleApprove = async(taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: 'approved' as const }
        : task
    ))
    await apiService.patch(`task/update/approval/status/${taskId}`,{
      status:"Approved",
      msg:null
    }) 
 setRefreshKey((prev) => prev + 1);
    // await response=apiService.patch("")

  }

  const handleRejectClick = (task: Task) => {
    setSelectedTask(task)
    setRejectDialogOpen(true)
    setRejectionReason("")
  }

  const handleRejectConfirm = async() => {
  await apiService.patch(`task/update/approval/status/${selectedTask?.id}`,{
      status:"Approved",
      msg:rejectionReason
    }) 
     setRejectDialogOpen(false)
      setSelectedTask(null)
      setRejectionReason("")
      setRefreshKey((prev) => prev + 1);
  }

  const getStatusBadge = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-orange-600 border-orange-600"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      case 'approved':
        return <Badge variant="outline" className="text-green-600 border-green-600"><Check className="w-3 h-3 mr-1" />Approved</Badge>
      case 'rejected':
        return <Badge variant="outline" className="text-red-600 border-red-600"><X className="w-3 h-3 mr-1" />Rejected</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
if(tasks.length==0){
  return(<><p>No penfing</p></>)
}
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Task Approval Panel</h1>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>Pending: {tasks.filter(t => t.status === 'pending').length}</span>
          <span>Approved: {tasks.filter(t => t.status === 'approved').length}</span>
          <span>Rejected: {tasks.filter(t => t.status === 'rejected').length}</span>
        </div>
      </div>

      <div className="grid gap-4">
        {tasks.map((task) => (
          <Card key={task.id} className="w-full">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{task.taskName}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span><strong>Project:</strong> {task.project}</span>
                    <span><strong>User:</strong> {task.username}</span>
                    <span><strong>Submitted:</strong> {formatDate(task.submittedAt)}</span>
                  </div>
                </div>
                {getStatusBadge(task.status)}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {task.status === 'rejected' && task.rejectionReason && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm font-medium text-red-800 mb-1">Rejection Reason:</p>
                  <p className="text-sm text-red-700">{task.rejectionReason}</p>
                </div>
              )}
              
              {task.status === 'pending' && (
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleApprove(task.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => handleRejectClick(task)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Task</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting "{selectedTask?.taskName}". This will help the user understand what needs to be improved.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">Rejection Reason</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Enter the reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleRejectConfirm}
              disabled={!rejectionReason.trim()}
            >
              Reject Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
