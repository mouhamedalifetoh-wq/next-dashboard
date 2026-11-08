import SideNav from '@/app/ui/dashboard/sidenav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:h-screen md:min-h-0 md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="grow p-5 pb-28 sm:p-6 sm:pb-28 md:overflow-y-auto md:p-10 md:pb-10">
        {children}
      </div>
    </div>
  );
}
