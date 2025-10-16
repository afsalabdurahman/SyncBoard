"use client"

import { useMemo, useState } from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Label } from "../../components/ui/label"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Button } from "../../components/ui/button"
import { Switch } from "../../components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Separator } from "../../components/ui/separator"
import { Badge } from "../../components/ui/badge"
import { useToast } from "../../../hooks/use-toast"
import { cn } from "../../../lib/utils"
import {
  Globe,
  Building2,
  LinkIcon,
  ImageIcon,
  Shield,
  KeyRound,
  Mail,
  Lock,
  CreditCard,
  TestTube2,
  CheckCircle2,
  RefreshCw,
  Rocket,
  Activity,
  Bug,
  FileText,
} from "lucide-react"

type FeatureKey = "newUI" | "betaFeatures" | "aiSummaries" | "auditLogs" | "fileUploads"

export default function SystemSettingsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { toast } = useToast()

  // General
  const [appName, setAppName] = useState("SaaS Platform")
  const [companyName, setCompanyName] = useState("Acme Inc.")
  const [baseUrl, setBaseUrl] = useState("https://app.example.com")
  const [locale, setLocale] = useState("en-US")
  const [timezone, setTimezone] = useState("UTC")

  // Branding
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null)
  const [accentColor, setAccentColor] = useState("#2563eb")
  const [loginHeadline, setLoginHeadline] = useState("Welcome back")

  // Security
  const [enforce2FA, setEnforce2FA] = useState(true)
  const [minPasswordLen, setMinPasswordLen] = useState(10)
  const [sessionTimeoutMins, setSessionTimeoutMins] = useState(60)
  const [allowedDomains, setAllowedDomains] = useState("example.com\nacme.com")
  const [ssoGoogle, setSsoGoogle] = useState(true)
  const [ssoGithub, setSsoGithub] = useState(false)

  // Email
  const [fromName, setFromName] = useState(companyName)
  const [fromEmail, setFromEmail] = useState("no-reply../../..example.com")
  const [smtpHost, setSmtpHost] = useState("smtp.sendprovider.com")
  const [smtpPort, setSmtpPort] = useState(587)
  const [smtpUser, setSmtpUser] = useState("apikey")
  const [smtpPass, setSmtpPass] = useState("")
  const [smtpTLS, setSmtpTLS] = useState(true)

  // Billing
  const [currency, setCurrency] = useState("USD")
  const [invoicePrefix, setInvoicePrefix] = useState("INV")
  const [taxRate, setTaxRate] = useState(0)
  const [requireBillingAddress, setRequireBillingAddress] = useState(true)

  // Features
  const [features, setFeatures] = useState<Record<FeatureKey, boolean>>({
    newUI: true,
    betaFeatures: false,
    aiSummaries: true,
    auditLogs: true,
    fileUploads: true,
  })

  // Logging & Data
  const [logLevel, setLogLevel] = useState<"error" | "warn" | "info" | "debug">("info")
  const [retentionDays, setRetentionDays] = useState(90)
  const [redactPII, setRedactPII] = useState(true)

  const onSave = (section?: string) => {
    toast({
      title: "Settings saved",
      description: section ? `${section} updated successfully.` : "All changes were saved.",
    })
  }

  const onReset = (section?: string) => {
    // Simple demo reset handlers per section
    if (!section || section === "General") {
      setAppName("SaaS Platform")
      setCompanyName("Acme Inc.")
      setBaseUrl("https://app.example.com")
      setLocale("en-US")
      setTimezone("UTC")
    }
    if (!section || section === "Branding") {
      setLogoPreview(null)
      setFaviconPreview(null)
      setAccentColor("#2563eb")
      setLoginHeadline("Welcome back")
    }
    if (!section || section === "Security") {
      setEnforce2FA(true)
      setMinPasswordLen(10)
      setSessionTimeoutMins(60)
      setAllowedDomains("example.com\nacme.com")
      setSsoGoogle(true)
      setSsoGithub(false)
    }
    if (!section || section === "Email") {
      setFromName(companyName)
      setFromEmail("no-reply../../..example.com")
      setSmtpHost("smtp.sendprovider.com")
      setSmtpPort(587)
      setSmtpUser("apikey")
      setSmtpPass("")
      setSmtpTLS(true)
    }
    if (!section || section === "Billing") {
      setCurrency("USD")
      setInvoicePrefix("INV")
      setTaxRate(0)
      setRequireBillingAddress(true)
    }
    if (!section || section === "Features") {
      setFeatures({ newUI: true, betaFeatures: false, aiSummaries: true, auditLogs: true, fileUploads: true })
    }
    if (!section || section === "Logging & Data") {
      setLogLevel("info")
      setRetentionDays(90)
      setRedactPII(true)
    }
    toast({
      title: "Settings reset",
      description: section ? `${section} restored to defaults.` : "All sections restored to defaults.",
    })
  }

  const onUpload = (file: File, setter: (v: string) => void) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setter(result)
    }
    reader.readAsDataURL(file)
  }

  const canSendTestEmail = useMemo(() => {
    return Boolean(fromEmail && smtpHost && smtpPort && smtpUser && smtpTLS !== null)
  }, [fromEmail, smtpHost, smtpPort, smtpUser, smtpTLS])

  const sendTestEmail = () => {
    if (!canSendTestEmail) return
    toast({ title: "Test email queued", description: `A test message will be sent to ${fromEmail}.` })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <Header sidebarCollapsed={sidebarCollapsed} />

      <main className={cn("transition-all duration-300 pt-16", sidebarCollapsed ? "ml-16" : "ml-64")}>
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
            <p className="text-gray-600 mt-1">
              Configure global settings for your platform. Changes affect all workspaces unless otherwise noted.
            </p>
          </div>

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="general" className="gap-2">
                <Globe className="h-4 w-4" />
                General
              </TabsTrigger>
              <TabsTrigger value="branding" className="gap-2">
                <ImageIcon className="h-4 w-4" />
                Branding
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="email" className="gap-2">
                <Mail className="h-4 w-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="billing" className="gap-2">
                <CreditCard className="h-4 w-4" />
                Billing
              </TabsTrigger>
              <TabsTrigger value="features" className="gap-2">
                <Rocket className="h-4 w-4" />
                Features
              </TabsTrigger>
              <TabsTrigger value="logging" className="gap-2">
                <FileText className="h-4 w-4" />
                Logging & Data
              </TabsTrigger>
            </TabsList>

            {/* General */}
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-gray-500" />
                    General
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="appName">Application Name</Label>
                      <Input id="appName" value={appName} onChange={(e) => setAppName(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                    </div>
                    <div className="grid gap-2 md:col-span-2">
                      <Label htmlFor="baseUrl" className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4 text-gray-400" />
                        Base URL
                      </Label>
                      <Input
                        id="baseUrl"
                        value={baseUrl}
                        onChange={(e) => setBaseUrl(e.target.value)}
                        placeholder="https://app.example.com"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Default Locale</Label>
                      <Select value={locale} onValueChange={setLocale}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select locale" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en-US">English (US)</SelectItem>
                          <SelectItem value="en-GB">English (UK)</SelectItem>
                          <SelectItem value="de-DE">Deutsch (DE)</SelectItem>
                          <SelectItem value="fr-FR">Français (FR)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Timezone</Label>
                      <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="America/New_York">America/New_York</SelectItem>
                          <SelectItem value="Europe/Berlin">Europe/Berlin</SelectItem>
                          <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => onReset("General")} className="gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Reset
                    </Button>
                    <Button onClick={() => onSave("General")} className="gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Branding */}
            <TabsContent value="branding">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-gray-500" />
                    Branding
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid gap-3">
                      <Label>Logo</Label>
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-lg border bg-white overflow-hidden flex items-center justify-center">
                          {logoPreview ? (
                            <img
                              src={logoPreview || "/placeholder.svg"}
                              alt="Logo"
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files && onUpload(e.target.files[0], (v) => setLogoPreview(v))}
                        />
                      </div>
                    </div>

                    <div className="grid gap-3">
                      <Label>Favicon</Label>
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded border bg-white overflow-hidden flex items-center justify-center">
                          {faviconPreview ? (
                            <img
                              src={faviconPreview || "/placeholder.svg"}
                              alt="Favicon"
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <ImageIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files && onUpload(e.target.files[0], (v) => setFaviconPreview(v))}
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label>Accent Color</Label>
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={accentColor}
                          onChange={(e) => setAccentColor(e.target.value)}
                          className="h-10 w-16 rounded border bg-white"
                          aria-label="Accent color"
                        />
                        <Badge variant="secondary" style={{ backgroundColor: `${accentColor}22`, color: accentColor }}>
                          {accentColor}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label>Login Headline</Label>
                      <Input value={loginHeadline} onChange={(e) => setLoginHeadline(e.target.value)} />
                    </div>
                  </div>

                  <Separator />
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => onReset("Branding")} className="gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Reset
                    </Button>
                    <Button onClick={() => onSave("Branding")} className="gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-gray-500" />
                    Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between rounded-lg border bg-white p-4">
                      <div>
                        <p className="font-medium">Enforce 2FA</p>
                        <p className="text-sm text-gray-600">Require two-factor auth for all admins.</p>
                      </div>
                      <Switch checked={enforce2FA} onCheckedChange={setEnforce2FA} />
                    </div>

                    <div className="grid gap-2">
                      <Label>Password Minimum Length</Label>
                      <Input
                        type="number"
                        min={8}
                        max={128}
                        value={minPasswordLen}
                        onChange={(e) => setMinPasswordLen(Number(e.target.value))}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label>Session Timeout (minutes)</Label>
                      <Input
                        type="number"
                        min={15}
                        max={480}
                        value={sessionTimeoutMins}
                        onChange={(e) => setSessionTimeoutMins(Number(e.target.value))}
                      />
                    </div>

                    <div className="grid gap-2 md:col-span-2">
                      <Label>Allowed Email Domains (one per line)</Label>
                      <Textarea
                        rows={4}
                        value={allowedDomains}
                        onChange={(e) => setAllowedDomains(e.target.value)}
                        placeholder="example.com"
                      />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border bg-white p-4">
                      <div>
                        <p className="font-medium">Google SSO</p>
                        <p className="text-sm text-gray-600">Allow signing in with Google accounts.</p>
                      </div>
                      <Switch checked={ssoGoogle} onCheckedChange={setSsoGoogle} />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border bg-white p-4">
                      <div>
                        <p className="font-medium">GitHub SSO</p>
                        <p className="text-sm text-gray-600">Allow signing in with GitHub accounts.</p>
                      </div>
                      <Switch checked={ssoGithub} onCheckedChange={setSsoGithub} />
                    </div>
                  </div>

                  <Separator />
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => onReset("Security")} className="gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Reset
                    </Button>
                    <Button onClick={() => onSave("Security")} className="gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Email */}
            <TabsContent value="email">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-gray-500" />
                    Email (SMTP)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid gap-2">
                      <Label>From Name</Label>
                      <Input value={fromName} onChange={(e) => setFromName(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                      <Label>From Email</Label>
                      <Input type="email" value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} />
                    </div>

                    <div className="grid gap-2">
                      <Label>SMTP Host</Label>
                      <Input value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                      <Label>SMTP Port</Label>
                      <Input
                        type="number"
                        min={1}
                        value={smtpPort}
                        onChange={(e) => setSmtpPort(Number(e.target.value))}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label>Username</Label>
                      <Input value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                      <Label>Password</Label>
                      <Input type="password" value={smtpPass} onChange={(e) => setSmtpPass(e.target.value)} />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border bg-white p-4 md:col-span-2">
                      <div>
                        <p className="font-medium">Use TLS</p>
                        <p className="text-sm text-gray-600">Secure connection with STARTTLS/TLS.</p>
                      </div>
                      <Switch checked={smtpTLS} onCheckedChange={setSmtpTLS} />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-between flex-wrap">
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => onReset("Email")} className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Reset
                      </Button>
                      <Button onClick={() => onSave("Email")} className="gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                    <Button variant="secondary" disabled={!canSendTestEmail} onClick={sendTestEmail} className="gap-2">
                      <TestTube2 className="h-4 w-4" />
                      Send Test Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Billing */}
            <TabsContent value="billing">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-gray-500" />
                    Billing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid gap-2">
                      <Label>Default Currency</Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger>
                          <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="JPY">JPY</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label>Invoice Prefix</Label>
                      <Input value={invoicePrefix} onChange={(e) => setInvoicePrefix(e.target.value)} />
                    </div>

                    <div className="grid gap-2">
                      <Label>Tax Rate (%)</Label>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        step={0.1}
                        value={taxRate}
                        onChange={(e) => setTaxRate(Number(e.target.value))}
                      />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border bg-white p-4">
                      <div>
                        <p className="font-medium">Require Billing Address</p>
                        <p className="text-sm text-gray-600">Collect address details on checkout.</p>
                      </div>
                      <Switch checked={requireBillingAddress} onCheckedChange={setRequireBillingAddress} />
                    </div>
                  </div>

                  <Separator />
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => onReset("Billing")} className="gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Reset
                    </Button>
                    <Button onClick={() => onSave("Billing")} className="gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Features */}
            <TabsContent value="features">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-gray-500" />
                    Feature Toggles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(
                      [
                        { key: "newUI", label: "New UI", desc: "Enable the latest interface for all users." },
                        { key: "betaFeatures", label: "Beta Features", desc: "Opt-in users to beta features." },
                        { key: "aiSummaries", label: "AI Summaries", desc: "Generate AI-powered summaries." },
                        { key: "auditLogs", label: "Audit Logs", desc: "Capture admin and user actions." },
                        { key: "fileUploads", label: "File Uploads", desc: "Allow file attachments in messages." },
                      ] as { key: FeatureKey; label: string; desc: string }[]
                    ).map((f) => (
                      <div key={f.key} className="flex items-center justify-between rounded-lg border bg-white p-4">
                        <div>
                          <p className="font-medium">{f.label}</p>
                          <p className="text-sm text-gray-600">{f.desc}</p>
                        </div>
                        <Switch
                          checked={features[f.key]}
                          onCheckedChange={(v) => setFeatures((prev) => ({ ...prev, [f.key]: v }))}
                        />
                      </div>
                    ))}
                  </div>

                  <Separator />
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => onReset("Features")} className="gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Reset
                    </Button>
                    <Button onClick={() => onSave("Features")} className="gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Logging & Data */}
            <TabsContent value="logging">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bug className="h-5 w-5 text-gray-500" />
                    Logging & Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid gap-2">
                      <Label>Log Level</Label>
                      <Select value={logLevel} onValueChange={(v) => setLogLevel(v as typeof logLevel)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="error">Error</SelectItem>
                          <SelectItem value="warn">Warn</SelectItem>
                          <SelectItem value="info">Info</SelectItem>
                          <SelectItem value="debug">Debug</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label>Retention (days)</Label>
                      <Input
                        type="number"
                        min={1}
                        max={3650}
                        value={retentionDays}
                        onChange={(e) => setRetentionDays(Number(e.target.value))}
                      />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border bg-white p-4 md:col-span-2">
                      <div>
                        <p className="font-medium">Redact PII in Logs</p>
                        <p className="text-sm text-gray-600">Mask emails, tokens, and other sensitive data.</p>
                      </div>
                      <Switch checked={redactPII} onCheckedChange={setRedactPII} />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-between">
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => onReset("Logging & Data")} className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Reset
                      </Button>
                      <Button onClick={() => onSave("Logging & Data")} className="gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" className="gap-2" onClick={() => toast({ title: "Export started" })}>
                        <FileText className="h-4 w-4" />
                        Export Logs
                      </Button>
                      <Button
                        variant="secondary"
                        className="gap-2"
                        onClick={() => toast({ title: "Logs purged", description: "Retention policy applied." })}
                      >
                        <KeyRound className="h-4 w-4" />
                        Purge Old Logs
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
