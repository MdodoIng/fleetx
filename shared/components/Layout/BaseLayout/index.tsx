import Header from './Header';

interface BaseLayoutProps {
  children: React.ReactNode;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Header />
      <main className="">{children}</main>
    </div>
  );
};

export default BaseLayout;
