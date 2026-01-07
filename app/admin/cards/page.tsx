// app/admin/cards/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, CheckCircle, XCircle, Clock, Search, CreditCard, ShieldCheck } from "lucide-react"
import { Input } from "@/components/ui/input"

interface CardWithUser {
  _id: string
  cardType: string
  vendor: string
  cardNumber: string
  status: string
  appliedDate: string
  approvedDate?: string
  cardHolderName: string
  userId: {
    bankInfo: {
      bio: {
        firstname: string
        lastname: string
      }
    }
    bankNumber: string
    email: string
  }
}

export default function AdminCardsPage() {
  const [cards, setCards] = useState<CardWithUser[]>([])
  const [filteredCards, setFilteredCards] = useState<CardWithUser[]>([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCards()
  }, [])

  useEffect(() => {
    let filtered = cards

    if (statusFilter !== "all") {
      filtered = filtered.filter(card => card.status === statusFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(card =>
        card.cardHolderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.userId.bankNumber.includes(searchTerm) ||
        card.cardNumber.includes(searchTerm.replace(/\s/g, ''))
      )
    }

    setFilteredCards(filtered)
  }, [cards, statusFilter, searchTerm])

  const fetchCards = async () => {
    try {
      const response = await fetch('/api/admin/cards')
      const data = await response.json()
      if (response.ok) {
        setCards(data.cards)
      }
    } catch (error) {
      console.error('Error fetching cards:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateCardStatus = async (cardId: string, status: string) => {
    try {
      const response = await fetch('/api/admin/cards', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardId, status }),
      })

      if (response.ok) {
        fetchCards() // Refresh the list
      }
    } catch (error) {
      console.error('Error updating card status:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-3 w-3" />
      case 'pending': return <Clock className="h-3 w-3" />
      case 'rejected': return <XCircle className="h-3 w-3" />
      default: return <AlertCircle className="h-3 w-3" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
      case 'pending': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
      case 'rejected': return 'text-red-400 bg-red-500/10 border-red-500/20'
      case 'blocked': return 'text-slate-400 bg-white/5 border-white/10'
      default: return 'text-slate-400 bg-white/5 border-white/10'
    }
  }

  if (loading) {
    return (
      <div className="p-10 text-emerald-500 font-black animate-pulse flex items-center gap-3 uppercase tracking-widest">
        <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        Syncing Card Assets...
      </div>
    )
  }

  return (
    <div className="p-4 md:p-10 space-y-10 relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <div className="space-y-2 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
          <CreditCard className="w-3 h-3" /> Card Management
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
          Card <span className="text-slate-500 italic">Issuance</span>
        </h1>
        <p className="text-slate-400 font-medium max-w-md">Overseeing physical and digital payment card applications.</p>
      </div>

      {/* Filters */}
      <Card className="bg-white/[0.03] border-white/5 rounded-[2.5rem] p-8 relative z-10 overflow-hidden">
        <div className="absolute top-0 right-0 h-32 w-32 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-500/50" />
            <Input
              placeholder="Search by name, account number, or card details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-white/5 border-white/10 rounded-2xl h-14 text-white focus:border-emerald-500 transition-all font-medium"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-14 w-full md:w-[220px] bg-white/5 border-white/10 rounded-2xl text-slate-400 font-bold">
              <SelectValue placeholder="System State" />
            </SelectTrigger>
            <SelectContent className="bg-[#001c10] border-white/10 text-slate-300">
              <SelectItem value="all">All Cards</SelectItem>
              <SelectItem value="pending">Review Required</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="rejected">Denied</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Cards Table */}
      <Card className="bg-white/[0.03] border-white/5 rounded-[3rem] overflow-hidden relative z-10">
        <CardHeader className="p-8 border-b border-white/5 bg-white/[0.01]">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-black text-white italic tracking-tight">Active Applications</CardTitle>
              <CardDescription className="text-slate-500 font-medium">{filteredCards.length} cards registered in the system.</CardDescription>
            </div>
            <div className="hidden md:flex gap-4">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Assets</p>
                <p className="text-lg font-black text-white">{cards.filter(c => c.status === 'active').length}</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-black/20 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  <th className="px-8 py-6">Applicant</th>
                  <th className="px-8 py-6">Card Details</th>
                  <th className="px-8 py-6">Account</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredCards.map((card) => (
                  <tr key={card._id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-xs uppercase tracking-tighter">
                          {card?.cardHolderName?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-black text-white uppercase tracking-tight">{card?.cardHolderName}</p>
                          <p className="text-[10px] font-black text-slate-500 tracking-widest mt-1 opacity-60 truncate max-w-[150px]">{card?.userId?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-white capitalize">{card.vendor} • {card.cardType}</p>
                        <p className="text-[10px] font-black font-mono text-emerald-500 tracking-[0.2em]">**** {card.cardNumber.slice(-4)}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-mono text-slate-400">{card?.userId?.bankNumber}</td>
                    <td className="px-8 py-6">
                      <Badge className={`px-3 py-1.5 rounded-xl border flex w-fit items-center gap-2 text-[10px] font-black uppercase tracking-widest ${getStatusColor(card.status)}Shadow ${getStatusColor(card.status)}`}>
                        {getStatusIcon(card.status)}
                        {card.status}
                      </Badge>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-end gap-2">
                        {card.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => updateCardStatus(card._id, 'active')}
                              className="h-10 px-6 rounded-xl bg-emerald-500 text-[#001c10] font-black text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all"
                            >
                              Provision
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => updateCardStatus(card._id, 'rejected')}
                              className="h-10 px-6 rounded-xl text-red-500 hover:bg-red-500/10 font-bold text-[10px] uppercase tracking-widest"
                            >
                              Deny
                            </Button>
                          </>
                        )}
                        {card.status === 'active' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updateCardStatus(card._id, 'blocked')}
                            className="h-10 px-6 rounded-xl text-slate-400 hover:bg-white/5 font-black text-[10px] uppercase tracking-widest"
                          >
                            Revoke
                          </Button>
                        )}
                        {(card.status === 'rejected' || card.status === 'blocked') && (
                          <Button
                            size="sm"
                            onClick={() => updateCardStatus(card._id, 'active')}
                            className="h-10 px-6 rounded-xl bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10"
                          >
                            Re-Activate
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredCards.length === 0 && (
              <div className="text-center py-20 space-y-4">
                <Search className="h-16 w-16 text-slate-500/20 mx-auto" />
                <p className="text-slate-500 font-medium italic">No cards found.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
