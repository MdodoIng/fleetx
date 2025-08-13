'use clinet';
import { withAuth } from './withAuth';
import Header from './Header';
import SideBar from './Sidebar';
import { SearchX } from 'lucide-react';

interface BaseLayoutProps {
  children: React.ReactNode;
  header?: {
    title: string;
  };
}

const ProtectedLayout: React.FC<BaseLayoutProps> = ({ children, header }) => {
  return (
    <section className="flex items-start justify-start h-svh overflow-hidden">
      <SideBar />
      <div className="h-full overflow-y-auto w-full">
        <Header {...header} />
        {children}
      </div>
    </section>
  );
};

export default ProtectedLayout;
