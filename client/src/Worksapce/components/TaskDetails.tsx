import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../Custom/ui/dialog";

export const TaskDetails = ({details}) => {
  
 
  return (
    <div className="">
      <div className="text-center space-y-6">
    
        <Dialog>
          <DialogTrigger asChild>
            <button className="text-link hover:text-link-hover font-medium underline underline-offset-4 transition-colors cursor-pointer">
              View Details
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Details</DialogTitle>
              <DialogDescription className="text-base leading-relaxed pt-4 text-foreground/80">
        {details}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};


