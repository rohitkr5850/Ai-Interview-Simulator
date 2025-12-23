import { useTheme } from '../context/ThemeContext.jsx';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

const Layout = ({ children }) => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col transition-colors ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <Navbar />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;

