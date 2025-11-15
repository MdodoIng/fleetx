import Header from './Header';
import { AnimatePresence, motion } from 'framer-motion';

interface BaseLayoutProps {
  children: React.ReactNode;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex flex-col w-full"
      >
        <Header />
        <main className="">{children}</main>
      </motion.div>
    </AnimatePresence>
  );
};

export default BaseLayout;
