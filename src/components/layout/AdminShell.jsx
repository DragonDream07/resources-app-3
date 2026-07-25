import AdminSidebar from './AdminSidebar';
import AdminRoute from '@/routes/AdminRoute';

function AdminShell({ children }) {
  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminRoute>
  );
}

export default AdminShell;
