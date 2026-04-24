import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw } from "lucide-react";

export const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="container py-20">
    <div className="mx-auto max-w-md text-center rounded-2xl border bg-card p-8 shadow-elegant animate-slide-up">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
        <AlertTriangle className="h-7 w-7 text-destructive" />
      </div>
      <h2 className="mt-5 font-display text-xl font-bold">Audit failed</h2>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      <Button onClick={onRetry} className="mt-6 gap-2" variant="outline">
        <RotateCcw className="h-4 w-4" />
        Try again
      </Button>
    </div>
  </div>
);
