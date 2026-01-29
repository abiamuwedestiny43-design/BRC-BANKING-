"use client"

import type React from "react"
import * as Portal from "@radix-ui/react-portal"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, DollarSign, CheckCircle, Trash2, Zap, ArrowUpRight, ArrowDownLeft, X, ShieldAlert, Cpu } from "lucide-react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

interface UserActionsProps {
  userId: string
}

export default function UserActions({ userId }: UserActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [txOpen, setTxOpen] = useState(false)
  const [txType, setTxType] = useState<"credit" | "debit">("credit")
  const [txAmount, setTxAmount] = useState<string>("")
  const [txCurrency, setTxCurrency] = useState<string>("USD")
  const [txDesc, setTxDesc] = useState<string>("")
  const [txSuccess, setTxSuccess] = useState(false)
  const router = useRouter()

  const openTxModal = async (type: "credit" | "debit") => {
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
    setTxOpen(true)
  }

  const submitTransaction = async () => {
    if (!txAmount || Number.isNaN(Number(txAmount)) || Number(txAmount) <= 0) {
      alert("Invalid liquidity volume detected. Please re-input.")
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
          description: txDesc || `System ${txType === 'credit' ? 'Credit' : 'Debit'}`,
        }),
      })
      if (res.ok) {
        setTxSuccess(true)
        router.refresh()
        setTimeout(() => {
          setTxOpen(false)
          setTxSuccess(false)
        }, 1500)
      } else {
        const j = await res.json().catch(() => ({}))
        alert(j?.message || "Protocol transmission failed.")
      }
    } catch (err) {
      console.error("[HB BANK] admin tx error:", err)
      alert("System fault detected during migration.")
    } finally {
      setIsLoading(false)
    }
  }

  const [menuOpen, setMenuOpen] = useState(false)
  const [activeBtn, setActiveBtn] = useState<HTMLButtonElement | null>(null)

  const handleAction = async (action: string) => {
    setMenuOpen(false)
    setIsLoading(true)
    try {
      switch (action) {
        case "view":
          router.push(`/admin/users/${userId}/edit`) // Fixed: Changed view details to edit page for admin
          break
        case "approve":
          const approveResponse = await fetch("/api/admin/users/approve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          })
          if (approveResponse.ok) {
            router.refresh()
          } else {
            alert("Approval protocol failed.")
          }
          break
        case "delete":
          if (confirm("Initiate permanent data erasure for this node? This cannot be reversed.")) {
            const deleteResponse = await fetch(`/api/admin/users/${userId}`, {
              method: "DELETE",
            })
            if (deleteResponse.ok) {
              router.refresh()
            } else {
              alert("Node deletion protocol aborted.")
            }
          }
          break
        case "credit":
          await openTxModal("credit")
          break
        case "debit":
          await openTxModal("debit")
          break
      }
    } catch (error) {
      console.error("Action error:", error)
      alert("Executive override error.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="relative">
        <Button
          variant="ghost"
          ref={(node) => setActiveBtn(node)}
          onClick={(e) => {
            e.stopPropagation()
            setMenuOpen(!menuOpen)
          }}
          className="h-10 px-4 rounded-xl bg-white/5 hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-500 border border-white/5 hover:border-emerald-500/20 transition-all gap-2 font-black uppercase tracking-widest text-[10px] relative z-[40]"
        >
          <Cpu className="h-3 w-3" /> Protocols
        </Button>

        {menuOpen && (
          <Portal.Root>
            <div
              className="fixed inset-0 z-[100]"
              onClick={(e) => {
                e.stopPropagation()
                setMenuOpen(false)
              }}
            />
            <div
              style={{
                position: 'fixed',
                top: activeBtn ? activeBtn.getBoundingClientRect().bottom + 8 : 0,
                right: activeBtn ? window.innerWidth - activeBtn.getBoundingClientRect().right : 0,
              }}
              className="w-56 bg-[#001c10] border border-emerald-500/20 backdrop-blur-xl rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-[101] animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => handleAction("view")}
                className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-white hover:bg-white/5 transition-colors text-left"
              >
                <Edit className="h-4 w-4 text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">Edit Metadata</span>
              </button>

              <div className="h-px bg-white/5 mx-2 my-2" />

              <button
                onClick={() => handleAction("credit")}
                className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-white hover:bg-emerald-500/10 transition-colors group text-left"
              >
                <ArrowUpRight className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Credit Assets</span>
              </button>

              <button
                onClick={() => handleAction("debit")}
                className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-white hover:bg-blue-500/10 transition-colors group text-left"
              >
                <ArrowDownLeft className="h-4 w-4 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Debit Assets</span>
              </button>

              <div className="h-px bg-white/5 mx-2 my-2" />

              <button
                onClick={() => handleAction("approve")}
                className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-white hover:bg-white/5 transition-colors text-left"
              >
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">Approve Account</span>
              </button>

              <button
                onClick={() => handleAction("delete")}
                className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-red-500 hover:bg-red-500/10 transition-colors text-left"
              >
                <Trash2 className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Delete Account</span>
              </button>
            </div>
          </Portal.Root>
        )}
      </div>

      <Dialog open={txOpen} onOpenChange={setTxOpen}>
        <DialogContent className="sm:max-w-md bg-[#001c10] border-emerald-500/20 text-white rounded-[2.5rem] overflow-hidden p-0 shadow-3xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="p-8 space-y-8 relative z-10">
            <DialogHeader>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-black uppercase tracking-[0.2em] mb-4">
                <Zap className="w-3 h-3" /> Asset Migration Protocol
              </div>
              <DialogTitle className="text-3xl font-black italic tracking-tighter flex items-center gap-3">
                {txType === "credit" ? (
                  <>
                    <ArrowUpRight className="w-8 h-8 text-emerald-500" />
                    Asset <span className="text-emerald-500">Credit</span>
                  </>
                ) : (
                  <>
                    <ArrowDownLeft className="w-8 h-8 text-blue-400" />
                    Asset <span className="text-blue-400">Debit</span>
                  </>
                )}
              </DialogTitle>
              <DialogDescription className="text-slate-500 font-medium">
                {txType === "credit"
                  ? "Initializing intra-system credit migration to subject node."
                  : "Initializing intra-system debit extraction from subject node."
                }
              </DialogDescription>
            </DialogHeader>

            {txSuccess ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-6 text-center animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                  <CheckCircle className="w-10 h-10 text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-widest">Protocol Success</h3>
                  <p className="text-slate-500 text-sm mt-2">Assets have been successfully synchronized.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Asset Volume (Amount)</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={txAmount}
                      onChange={(e) => setTxAmount(e.target.value)}
                      placeholder="0.00"
                      className="bg-white/5 border-white/10 rounded-2xl h-14 text-2xl font-black text-white focus:border-emerald-500 transition-all pl-10"
                    />
                    <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500/50" />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Currency Matrix</Label>
                  <Select value={txCurrency} onValueChange={setTxCurrency}>
                    <SelectTrigger className="bg-white/5 border-white/10 rounded-2xl h-12 text-white">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#001c10] border-white/10 text-white">
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

                <div className="space-y-3">
                  <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Protocol Remark (Optional)</Label>
                  <Input
                    value={txDesc}
                    onChange={(e) => setTxDesc(e.target.value)}
                    placeholder={`System ${txType === 'credit' ? 'Injection' : 'Extraction'}`}
                    className="bg-white/5 border-white/10 rounded-2xl h-12 text-white italic"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="ghost" onClick={() => setTxOpen(false)} className="flex-1 h-12 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 font-black uppercase tracking-widest text-[10px]">
                    Abort
                  </Button>
                  <Button
                    onClick={submitTransaction}
                    disabled={isLoading}
                    className={`flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl ${txType === 'credit'
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20'
                      : 'bg-blue-500 hover:bg-blue-400 text-white shadow-blue-500/20'
                      }`}
                  >
                    {isLoading ? "Transmitting..." : `Execute ${txType === 'credit' ? 'Credit' : 'Debit'}`}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {!txSuccess && (
            <div className="bg-black/40 p-4 flex items-center gap-3 border-t border-white/5">
              <ShieldAlert className="w-5 h-5 text-yellow-500/50" />
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-tight">
                Warning: This executive override will bypass standard verification protocols and modify ledger state directly.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
