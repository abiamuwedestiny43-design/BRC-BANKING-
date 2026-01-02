// app/admin/cards/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, CheckCircle, XCircle, Clock, Search } from "lucide-react"
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
      case 'active': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'blocked': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6 pt-[60px] space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Card Applications</h1>
        <p className="text-muted-foreground">Manage card applications and approvals</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name, account number, or card number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cards Table */}
      <Card>
        <CardHeader>
          <CardTitle>Card Applications</CardTitle>
          <CardDescription>
            {filteredCards.length} card(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Card Details</TableHead>
                <TableHead>Account Number</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCards.map((card) => (
                <TableRow key={card._id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{card?.cardHolderName}</div>
                      <div className="text-sm text-muted-foreground">{card?.userId?.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {card.vendor.charAt(0).toUpperCase() + card.vendor.slice(1)} {card.cardType}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        **** {card.cardNumber.slice(-4)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{card?.userId?.bankNumber}</TableCell>
                  <TableCell>{new Date(card.appliedDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(card.status)}>
                      {getStatusIcon(card.status)}
                      <span className="ml-1">{card.status.charAt(0).toUpperCase() + card.status.slice(1)}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {card.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => updateCardStatus(card._id, 'active')}
                          >
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => updateCardStatus(card._id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {card.status === 'active' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateCardStatus(card._id, 'blocked')}
                        >
                          Block
                        </Button>
                      )}
                      {(card.status === 'rejected' || card.status === 'blocked') && (
                        <Button 
                          size="sm" 
                          onClick={() => updateCardStatus(card._id, 'active')}
                        >
                          Activate
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredCards.length === 0 && (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No cards found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
