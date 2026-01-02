"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, DollarSign, CheckCircle, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

interface UserActionsProps {
  userId: string
}

export default function UserActions({ userId }: UserActionsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [txOpen, setTxOpen] = useState(false)
  const [txType, setTxType] = useState<"credit" | "debit">("credit")
  const [txAmount, setTxAmount] = useState<string>("")
  const [txCurrency, setTxCurrency] = useState<string>("USD")
  const [txDesc, setTxDesc] = useState<string>("")
  const [txSuccess, setTxSuccess] = useState(false)
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setIsOpen(!isOpen)
  }

  const openTxModal = async (type: "credit" | "debit", e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setTxType(type)
    setTxAmount("")
    setTxDesc("")
    try {
      const res = await fetch(`/api/admin/users/${userId}`)
      if (res.ok) {
        const data = await res.json()
        const assigned = data?.user?.bankInfo?.system?.currency
        setTxCurrency(assigned || "USD")
      } else {
        setTxCurrency("USD")
      }
    } catch {
      setTxCurrency("USD")
    }
    setIsOpen(false)
    setTxOpen(true)
  }

  const submitTransaction = async () => {
    if (!txAmount || Number.isNaN(Number(txAmount)) || Number(txAmount) <= 0) {
      alert("Enter a valid amount")
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          type: txType,
          amount: Number(txAmount),
          currency: txCurrency,
          description: txDesc || `Admin ${txType}`,
        }),
      })
      if (res.ok) {
        const j = await res.json()
        setTxSuccess(true)
        alert(
          `Successfully ${txType === "credit" ? "credited" : "debited"} ${Number(txAmount).toLocaleString()} ${txCurrency}`,
        )
        router.refresh()
        setTimeout(() => setTxOpen(false), 900)
      } else {
        const j = await res.json().catch(() => ({}))
        alert(j?.message || "Transaction failed")
      }
    } catch (err) {
      console.error("[v0] admin tx error:", err)
      alert("Transaction failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAction = async (action: string, e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setIsLoading(true)
    setIsOpen(false)

    try {
      switch (action) {
        case "view":
          router.push(`/admin/users/${userId}`)
          break
        case "approve":
          const approveResponse = await fetch("/api/admin/users/approve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          })
          if (approveResponse.ok) {
            router.refresh()
            alert("User approved successfully")
          } else {
            alert("Failed to approve user")
          }
          break
        case "delete":
          if (confirm("Are you sure you want to delete this user?")) {
            const deleteResponse = await fetch(`/api/admin/users/${userId}`, {
              method: "DELETE",
            })
            if (deleteResponse.ok) {
              router.refresh()
              alert("User deleted successfully")
            } else {
              alert("Failed to delete user")
            }
          }
          break
        case "credit":
          await openTxModal("credit", e)
          break
        case "debit":
          await openTxModal("debit", e)
          break
      }
    } catch (error) {
      console.error("Action error:", error)
      alert("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative inline-block">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        disabled={isLoading}
        className="h-8 w-8 p-0 hover:bg-gray-100"
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 bottom-0 z-50 bg-white border rounded-md shadow-lg py-1 min-w-[200px]">
          <button
            onClick={(e) => handleAction("view", e)}
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
          >
            <Edit className="mr-2 h-4 w-4" />
            View Details
          </button>

          <button
            onClick={(e) => handleAction("credit", e)}
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Credit Funds
          </button>
          <button
            onClick={(e) => handleAction("debit", e)}
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
          >
            <DollarSign className="mr-2 h-4 w-4 rotate-180" />
            Debit Funds
          </button>

          <button
            onClick={(e) => handleAction("approve", e)}
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Approve Account
          </button>

          <button
            onClick={(e) => handleAction("delete", e)}
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete User
          </button>
        </div>
      )}

      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}

      <Dialog open={txOpen} onOpenChange={setTxOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{txType === "credit" ? "Credit Account" : "Debit Account"}</DialogTitle>
            <DialogDescription>Enter the transaction details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={txAmount}
                onChange={(e) => setTxAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={txCurrency} onValueChange={setTxCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD — US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR — Euro</SelectItem>
                  <SelectItem value="GBP">GBP — British Pound</SelectItem>
                  <SelectItem value="JPY">JPY — Japanese Yen</SelectItem>
                  <SelectItem value="INR">INR — Indian Rupees</SelectItem>
                  <SelectItem value="CHF">CHF — Swiss Franc</SelectItem>
                  <SelectItem value="CAD">CAD — Canadian Dollar</SelectItem>
                  <SelectItem value="AUD">AUD — Australian Dollar</SelectItem>
                  <SelectItem value="SGD">SGD — Singapore Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Input value={txDesc} onChange={(e) => setTxDesc(e.target.value)} placeholder={`Admin ${txType}`} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setTxOpen(false)} disabled={txSuccess}>
                Cancel
              </Button>
              <Button onClick={submitTransaction} disabled={isLoading || txSuccess}>
                {isLoading ? "Processing..." : txType === "credit" ? "Credit" : "Debit"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
