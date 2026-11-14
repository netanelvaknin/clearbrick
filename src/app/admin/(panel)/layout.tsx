import { AdminNav } from "./admin-nav"

// Pages behind login get the admin sidebar (drawer on phones); the login page doesn't.
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminNav />
      <div className="md:ps-60">{children}</div>
    </>
  )
}
