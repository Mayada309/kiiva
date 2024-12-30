import AdminSidebar from '@/components/admin/sidebar/AdminSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import React from 'react';

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SidebarProvider>
        <AdminSidebar />
        <main className='ml-4'>
          <SidebarTrigger />
          <section className='w-[80vw]'>{children}</section>
        </main>
      </SidebarProvider>
    </>
  );
}

export default DashboardLayout;
