import { currentUser } from '@/lib/auth';
import DesktopSidebar from './DesktopSidebar';
import MobileFooter from './MobileFooter';

async function Sidebar({ children }: {
  children: React.ReactNode,
}) {
  const User =await currentUser();

  return (
    <div className="h-full">
      <DesktopSidebar currentUser={User!}/>
      <MobileFooter />
      <main className="lg:pl-20 h-full">
        {children}
      </main>
    </div>
  )
}

export default Sidebar;
