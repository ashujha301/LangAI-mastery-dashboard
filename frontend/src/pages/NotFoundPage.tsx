import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      data-ocid="not_found.page"
    >
      <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
      <h1 className="font-display text-3xl font-bold text-foreground">
        Page not found
      </h1>
      <p className="text-muted-foreground mt-2">
        The page you\'re looking for doesn\'t exist or has moved.
      </p>
      <Button asChild className="mt-6" data-ocid="not_found.home_button">
        <Link to="/dashboard">Go to Dashboard</Link>
      </Button>
    </div>
  );
}
