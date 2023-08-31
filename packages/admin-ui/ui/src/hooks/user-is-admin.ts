import { useAdminGetSession } from "medusa-react"
import { useMemo } from "react"

export const useIsAdmin = () => {
  const { user } = useAdminGetSession()

  const isAdmin = useMemo(() => {
    return user?.role === "admin"
  }, [user])

  return isAdmin
}
