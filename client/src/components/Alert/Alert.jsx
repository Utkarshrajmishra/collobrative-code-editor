import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function AlertDialogDemo({ open, setOpen }) {
  return (
    <AlertDialog open={open} setOpen={setOpen}>
      <AlertDialogContent className="bg-black font-inter">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-zinc-50">
            Link copied to clipboard!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-300">
            Share it with your friends and enjoy a seamless pair programming
            experience.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Continue
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => setOpen(false)}
            className="bg-neutral-900 hidden"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
