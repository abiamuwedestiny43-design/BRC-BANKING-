"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [localEnabled, setLocalEnabled] = useState(true)
  const [globalEnabled, setGlobalEnabled] = useState(true)
  const [bulkBusy, setBulkBusy] = useState(false)
  const [singleBusy, setSingleBusy] = useState(false)
  const [singleUserId, setSingleUserId] = useState("")

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const [localRes, globalRes] = await Promise.all([
          fetch("/api/admin/settings/local-transfer"),
          fetch("/api/admin/settings/global-transfer"),
        ])
        const localData = await localRes.json()
        const globalData = await globalRes.json()

        if (!mounted) return
        if (!localRes.ok) setError(localData?.message || "Failed to load settings")
        else setLocalEnabled(Boolean(localData.enabled))

        if (!globalRes.ok) setError((prev) => prev || globalData?.message || "Failed to load settings")
        else setGlobalEnabled(Boolean(globalData.enabled))
      } catch {
        setError("Failed to load settings")
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const handleSaveGlobal = async () => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/settings/global-transfer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: globalEnabled }),
      })
      const data = await res.json()
      if (!res.ok) setError(data?.message || "Failed to save")
    } catch {
      setError("Failed to save")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveLocal = async () => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/settings/local-transfer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: localEnabled }),
      })
      const data = await res.json()
      if (!res.ok) setError(data?.message || "Failed to save")
    } catch {
      setError("Failed to save")
    } finally {
      setSaving(false)
    }
  }

  const bulkSetUsersTransfer = async (canTransfer: boolean) => {
    setBulkBusy(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/settings/users-transfer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ canTransfer }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.message || "Failed to update users")
      }
    } catch {
      setError("Failed to update users")
    } finally {
      setBulkBusy(false)
    }
  }

  return (
    <div className="min-h-screen p-6 pt-[60px] md:p-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="text-muted-foreground">Manage global system options for transfers and security.</p>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Transfers</CardTitle>
            <CardDescription>Configure global transfer behaviors.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Enable Global Transfers</Label>
                <p className="text-sm text-muted-foreground">
                  When disabled, no user can initiate any transfer (local or international).
                </p>
              </div>
              <Switch
                checked={globalEnabled}
                onCheckedChange={setGlobalEnabled}
                disabled={loading || saving}
                aria-label="Enable Global Transfers"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSaveGlobal} disabled={loading || saving}>
                {saving ? "Saving..." : "Save Global"}
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Enable Local Transfers</Label>
                <p className="text-sm text-muted-foreground">When disabled, users cannot initiate local transfers.</p>
              </div>
              <Switch
                checked={localEnabled}
                onCheckedChange={setLocalEnabled}
                disabled={loading || saving}
                aria-label="Enable Local Transfers"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSaveLocal} disabled={loading || saving}>
                {saving ? "Saving..." : "Save Local"}
              </Button>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="text-base">Bulk User Transfer Permission</Label>
              <p className="text-sm text-muted-foreground">
                Override per-user transfer permission for all users at once.
              </p>
              <div className="flex flex-col md:flex gap-3">
                <Button variant="default" disabled={bulkBusy} onClick={() => bulkSetUsersTransfer(true)}>
                  {bulkBusy ? "Working..." : "Enable transfers for all users"}
                </Button>
                <Button variant="secondary" disabled={bulkBusy} onClick={() => bulkSetUsersTransfer(false)}>
                  {bulkBusy ? "Working..." : "Disable transfers for all users"}
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label className="text-base">Per-user Transfer Permission</Label>
              <p className="text-sm text-muted-foreground">
                Toggle transfer permission for a single user by their ID (find it in Admin &gt; Users).
              </p>
              <div className="flex flex-col md:flex-row gap-3">
                <Input
                  placeholder="Enter User ID (Mongo ObjectId)"
                  value={singleUserId}
                  onChange={(e) => setSingleUserId(e.target.value)}
                />
                <Button
                  disabled={singleBusy || !singleUserId}
                  onClick={async () => {
                    setSingleBusy(true)
                    setError(null)
                    try {
                      const res = await fetch("/api/admin/users/toggle-transfer", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ userId: singleUserId }),
                      })
                      const data = await res.json()
                      if (!res.ok) setError(data?.message || "Failed to toggle")
                    } catch {
                      setError("Failed to toggle")
                    } finally {
                      setSingleBusy(false)
                    }
                  }}
                >
                  {singleBusy ? "Working..." : "Toggle for User"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
