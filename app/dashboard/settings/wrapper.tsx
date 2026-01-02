// app/dashboard/settings/wrapper.tsx
import { getCurrentUser } from "@/lib/auth"
import { toPlainObject } from "@/lib/serialization"
import SettingsPage from "./page"

export default async function SettingsWrapper() {
  const userDoc = await getCurrentUser()
  
  if (!userDoc) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Authentication Error</h1>
        <p>Please log in to access settings.</p>
      </div>
    )
  }

  const user = toPlainObject(userDoc)
  return <SettingsPage user={user} />
}
