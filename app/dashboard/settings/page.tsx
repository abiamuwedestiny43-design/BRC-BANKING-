// app/dashboard/settings/page.tsx
import { getCurrentUser } from "@/lib/auth"
import { toPlainObject } from "@/lib/serialization"
import SettingsClient from "./SettingsClient"
import { redirect } from "next/navigation"

export default async function SettingsPage() {
  const userDoc = await getCurrentUser()

  if (!userDoc) {
    redirect("/login")
  }

  const user = toPlainObject(userDoc)
  return <SettingsClient user={user} />
}
