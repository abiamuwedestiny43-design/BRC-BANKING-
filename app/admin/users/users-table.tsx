"use client"

import Link from "next/link"
import { Plus, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import UsersTable from "./users-table"

export default function UsersPage() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("/api/admin/users")
      const data = await res.json()
      setUsers(data)
    }
    fetchUsers()
  }, [])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage all registered users here.</p>
        </div>
        <Link href="/admin/users/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add User
          </Button>
        </Link>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center gap-2"
      >
        <Input placeholder="Search users..." className="max-w-sm" />
        <Button variant="outline">
          <Search className="h-4 w-4" />
        </Button>
      </motion.div>

      {/* Users table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>User List</CardTitle>
            <CardDescription>All users in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <UsersTable users={users} />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
