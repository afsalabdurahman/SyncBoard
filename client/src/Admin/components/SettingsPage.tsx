"use client";

import { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Separator } from "../../components/ui/separator";
// import { useTheme } from "next-themes"
import { Save, User, Bell, Shield, Palette } from "lucide-react";

export function SettingsPage() {
  // const { theme, setTheme } = useTheme()
  const [settings, setSettings] = useState({
    name: "Admin User",
    email: "admin@company.com",
    notifications: {
      email: true,
      push: false,
      taskReminders: true,
      projectUpdates: true,
    },
    security: {
      twoFactor: false,
      sessionTimeout: true,
    },
  });

  const handleSave = () => {
    // In a real app, this would save to a backend
    console.log("Settings saved:", settings);
  };

  const updateNotificationSetting = (key: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }));
  };

  const updateSecuritySetting = (key: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      security: {
        ...prev.security,
        [key]: value,
      },
    }));
  };

  return (
    <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-3xl font-bold tracking-tight'>Settings</h2>
        <Button onClick={handleSave}>
          <Save className='mr-2 h-4 w-4' />
          Save Changes
        </Button>
      </div>

      <div className='grid gap-6'>
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <User className='h-5 w-5' />
              Profile Settings
            </CardTitle>
            <CardDescription>
              Manage your personal information and account details
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Full Name</Label>
                <Input
                  id='name'
                  value={settings.name}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email Address</Label>
                <Input
                  id='email'
                  type='email'
                  value={settings.email}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Palette className='h-5 w-5' />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize the look and feel of your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label>Theme</Label>
                <div className='text-sm text-muted-foreground'>
                  Choose between light and dark mode
                </div>
              </div>
              {/* <div className="flex items-center gap-2">
                <Label htmlFor="theme-toggle" className="text-sm">
                  {theme === "dark" ? "Dark" : "Light"}
                </Label>
                <Switch
                  id="theme-toggle"
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
              </div> */}
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Bell className='h-5 w-5' />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure how you receive notifications and updates
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label>Email Notifications</Label>
                <div className='text-sm text-muted-foreground'>
                  Receive notifications via email
                </div>
              </div>
              <Switch
                checked={settings.notifications.email}
                onCheckedChange={(checked) =>
                  updateNotificationSetting("email", checked)
                }
              />
            </div>
            <Separator />
            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label>Push Notifications</Label>
                <div className='text-sm text-muted-foreground'>
                  Receive push notifications in your browser
                </div>
              </div>
              <Switch
                checked={settings.notifications.push}
                onCheckedChange={(checked) =>
                  updateNotificationSetting("push", checked)
                }
              />
            </div>
            <Separator />
            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label>Task Reminders</Label>
                <div className='text-sm text-muted-foreground'>
                  Get reminded about upcoming task deadlines
                </div>
              </div>
              <Switch
                checked={settings.notifications.taskReminders}
                onCheckedChange={(checked) =>
                  updateNotificationSetting("taskReminders", checked)
                }
              />
            </div>
            <Separator />
            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label>Project Updates</Label>
                <div className='text-sm text-muted-foreground'>
                  Receive updates when projects are modified
                </div>
              </div>
              <Switch
                checked={settings.notifications.projectUpdates}
                onCheckedChange={(checked) =>
                  updateNotificationSetting("projectUpdates", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Shield className='h-5 w-5' />
              Security
            </CardTitle>
            <CardDescription>
              Manage your account security and privacy settings
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label>Two-Factor Authentication</Label>
                <div className='text-sm text-muted-foreground'>
                  Add an extra layer of security to your account
                </div>
              </div>
              <Switch
                checked={settings.security.twoFactor}
                onCheckedChange={(checked) =>
                  updateSecuritySetting("twoFactor", checked)
                }
              />
            </div>
            <Separator />
            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label>Automatic Session Timeout</Label>
                <div className='text-sm text-muted-foreground'>
                  Automatically log out after period of inactivity
                </div>
              </div>
              <Switch
                checked={settings.security.sessionTimeout}
                onCheckedChange={(checked) =>
                  updateSecuritySetting("sessionTimeout", checked)
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
