import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Link } from "@tanstack/react-router";
import { Moon, Sun, User, Wallet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Footer from "../components/layout/Footer";
import { useUserState } from "../context/UserStateContext";
import { useTheme } from "../hooks/useTheme";

export default function SettingsPage() {
  const { userState, updateBalance } = useUserState();
  const { isDark, toggle: toggleTheme } = useTheme();

  const [displayName, setDisplayName] = useState("Alex Learner");
  const [email, setEmail] = useState("alex@example.com");

  const handleSaveProfile = () => toast.success("Profile updated.");

  const handleAddBalance = () => {
    updateBalance(userState.balance + 100);
    toast.success("₹100 added to your balance.");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-6 py-10 space-y-8">
      {/* Header */}
      <div
        className="opacity-0 animate-fade-up"
        style={{ animationFillMode: "forwards" }}
      >
        <h1 className="font-display text-2xl font-bold text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage your profile, balance, and appearance.
        </p>
      </div>

      {/* ─── Profile ─────────────────────────────────────────────── */}
      <Card
        className="opacity-0 animate-fade-up animate-stagger-1"
        style={{ animationFillMode: "forwards" }}
        data-ocid="settings.profile_card"
      >
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-accent" />
            <CardTitle className="font-display text-base">Profile</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="display-name" className="text-xs">
                Display Name
              </Label>
              <Input
                id="display-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                data-ocid="settings.profile.display_name.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                data-ocid="settings.profile.email.input"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleSaveProfile}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              data-ocid="settings.profile.save_button"
            >
              Save Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ─── Balance & Hints ──────────────────────────────────────── */}
      <Card
        className="opacity-0 animate-fade-up animate-stagger-2"
        style={{ animationFillMode: "forwards" }}
        data-ocid="settings.balance_card"
      >
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-accent" />
            <CardTitle className="font-display text-base">
              Balance &amp; Hints
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-md bg-secondary/50 border border-border">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">
                Current Balance
              </p>
              <p className="font-display text-3xl font-bold text-accent font-mono">
                ₹{userState.balance}
              </p>
            </div>
            <Badge
              variant="outline"
              className="text-accent border-accent/30 text-xs"
            >
              ₹10 per hint
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Hints unlock the exact solution code with a step-by-step explanation
            for each coding challenge. Deducted automatically when you reveal a
            hint.
          </p>
          <Button
            onClick={handleAddBalance}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            data-ocid="settings.balance.add_button"
          >
            Add ₹100 Balance
          </Button>
        </CardContent>
      </Card>

      {/* Back link */}
      <div
        className="text-center opacity-0 animate-fade-up animate-stagger-4"
        style={{ animationFillMode: "forwards" }}
      >
        <Link
          to="/dashboard"
          className="text-sm text-muted-foreground hover:text-accent transition-colors"
          data-ocid="settings.back_dashboard.link"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <Footer />
    </div>
  );
}
