import Footer from './Footer';
import Header from './Header';

interface BaseLayoutProps {
  children: React.ReactNode;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto py-8 px-6">{children}</main>
      <Footer />
    </div>
  );
};

export default BaseLayout;
