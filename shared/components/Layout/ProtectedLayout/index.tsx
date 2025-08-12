import Header from './Header';
import SideBar from './Sidebar';

interface BaseLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  return (
    <main className="flex items-start justify-start h-svh overflow-hidden">
      <SideBar />
      <div className="h-full overflow-y-auto w-full">
        <Header />
        {children}
      </div>
    </main>
  );
};

export default ProtectedLayout;
