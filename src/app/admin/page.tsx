import { AdminApp } from "@/components/admin/admin-app";

// Demo admin panel for the school presentation. In production this would be guarded server-side
// (ADMIN_PASSWORD + signed session cookie) and read from PostgreSQL, see CLAUDE.md §9.
export default function AdminPage() {
  return <AdminApp />;
}
