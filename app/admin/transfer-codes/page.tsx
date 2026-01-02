"use client"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { ChevronDown, ChevronUp } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())
const genCode = () => Math.floor(100000 + Math.random() * 900000).toString()

export default function AdminTransferCodesPage() {
  const { toast } = useToast()
  const { data, mutate } = useSWR("/api/admin/transfer-codes", fetcher)
  const { data: usersData } = useSWR("/api/admin/users", fetcher)

  const [cot, setCot] = useState("")
  const [imf, setImf] = useState("")
  const [esi, setEsi] = useState("")
  const [dco, setDco] = useState("")
  const [tax, setTax] = useState("")
  const [tac, setTac] = useState("")
  const [saving, setSaving] = useState(false)

  const [showUserDialog, setShowUserDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [expandedSections, setExpandedSections] = useState({
    codes: true,
    users: false,
  })

  useEffect(() => {
    if (data?.codes) {
      setCot(data.codes.cot || "")
      setImf(data.codes.imf || "")
      setTac(data.codes.tac || "")
      setEsi(data.codes.esi || "")
      setDco(data.codes.dco || "")
      setTax(data.codes.tax || "")
    }
  }, [data])

  const save = async () => {
    setSaving(true)
    const res = await fetch("/api/admin/transfer-codes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cot, imf, esi, dco, tax, tac }),
    })
    if (res.ok) {
      toast({ title: "Saved", description: "Transfer codes updated" })
      mutate()
    } else {
      toast({ title: "Error", description: "Failed to save transfer codes" })
    }
    setSaving(false)
  }

  const toggleUserTransfer = async (userId: string, currentState: boolean) => {
    const res = await fetch("/api/admin/users/toggle-transfer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, enable: !currentState }),
    })

    if (res.ok) {
      toast({
        title: "Success",
        description: `Transfer ${!currentState ? "enabled" : "disabled"} for user`,
      })
      // Refresh users list
      mutate("/api/admin/users")
    } else {
      toast({ title: "Error", description: "Failed to update user transfer status" })
    }
  }

  return (
    <div className="p-6 space-y-6 pt-[60px]">
      <div>
        <h1 className="text-3xl font-bold">Transfer Management</h1>
        <p className="text-muted-foreground">Manage global codes and per-user transfer permissions</p>
      </div>

      {/* Global Transfer Codes Section */}
      <Card>
        <CardHeader
          onClick={() =>
            setExpandedSections({
              ...expandedSections,
              codes: !expandedSections.codes,
            })
          }
          className="cursor-pointer flex items-center justify-between"
        >
          <div>
            <CardTitle>Global Transfer Codes</CardTitle>
            <CardDescription>Set or generate verification codes (COT, IMF, ESI, DCO, TAX, TAC)</CardDescription>
          </div>
          {expandedSections.codes ? <ChevronUp /> : <ChevronDown />}
        </CardHeader>

        {expandedSections.codes && (
          <CardContent className="space-y-4">
            {[
              { label: "COT Code", value: cot, set: setCot },
              { label: "IMF Code", value: imf, set: setImf },
              { label: "ESI Code", value: esi, set: setEsi },
              { label: "DCO Code", value: dco, set: setDco },
              { label: "TAX Code", value: tax, set: setTax },
              { label: "TAC Code", value: tac, set: setTac },
            ].map((row) => (
              <div key={row.label}>
                <label className="text-sm block mb-1 font-medium">{row.label}</label>
                <div className="flex items-center justify-center gap-2">
                  <div className="flex-1">
                    <Input value={row.value} onChange={(e) => row.set(e.target.value)} />
                  </div>
                  <Button type="button" variant="outline" onClick={() => row.set(genCode())}>
                    Generate
                  </Button>
                </div>
              </div>
            ))}

            <div className="flex gap-2">
              <Button onClick={save} disabled={saving}>
                {saving ? "Saving..." : "Save Codes"}
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Per-User Transfer Permissions Section */}
      <Card>
        <CardHeader
          onClick={() =>
            setExpandedSections({
              ...expandedSections,
              users: !expandedSections.users,
            })
          }
          className="cursor-pointer flex items-center justify-between"
        >
          <div>
            <CardTitle>User Transfer Permissions</CardTitle>
            <CardDescription>Enable or disable transfer for individual users</CardDescription>
          </div>
          {expandedSections.users ? <ChevronUp /> : <ChevronDown />}
        </CardHeader>

        {expandedSections.users && (
          <CardContent>
            <div className="space-y-2">
              {usersData?.users?.map((user: any) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50"
                >
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.bankInfo?.bio?.firstname} {user.bankInfo?.bio?.lastname}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={user.bankAccount?.canTransfer ? "default" : "outline"}
                    onClick={() => toggleUserTransfer(user._id, user.bankAccount?.canTransfer)}
                  >
                    {user.bankAccount?.canTransfer ? "Enabled" : "Disabled"}
                  </Button>
                </div>
              ))}
              {!usersData?.users?.length && <p className="text-center text-muted-foreground py-4">No users found</p>}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
