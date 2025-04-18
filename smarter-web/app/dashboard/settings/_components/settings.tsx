"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Wrench, Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import Account from "./account";
import PageContainer from "@/components/layout/page-container";
import ChangePassword from "./password";

const navigationItems = [
  {
    icon: Wrench,
    label: "Account",
    href: "account",
    description: "Manage your account settings",
    component: Account,
  },
  {
    icon: Lock,
    label: "Change Password",
    href: "password",
    description:
      "Update your password to maintain the highest level of security.",
    component: ChangePassword,
  },
];

const Settings = () => {
  const [activeSection, setActiveSection] = useState("account");

  const ActiveComponent =
    navigationItems.find((item) => item.href === activeSection)?.component ||
    Account;

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-sm text-zinc-500">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator />

        <div className="grid grid-cols-1 lg:grid-cols-[250px_minmax(0,1fr)] gap-6 pb-4 lg:pb-0">
          <nav>
            <div className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.href}
                    variant={
                      activeSection === item.href ? "secondary" : "ghost"
                    }
                    className={cn(
                      "w-full justify-start gap-2",
                      activeSection === item.href
                        ? "bg-zinc-100 dark:bg-zinc-800"
                        : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    )}
                    onClick={() => setActiveSection(item.href)}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </nav>

          <div className="flex-1">
            <ActiveComponent />
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Settings;
