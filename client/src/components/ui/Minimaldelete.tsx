import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "./dialog"
import { Button } from "./button"

export default function MinimalConfirmDialog({ open, onClose, onConfirm,  title = "Are you sure ?",
  description = "This action cannot be undone. ",}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[350px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
          <DialogDescription className="mt-2 text-sm text-gray-500">{description}</DialogDescription>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>No</Button>
          <Button variant="destructive" onClick={onConfirm}>Yes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
