import { useLocation, Outlet } from 'react-router-dom';
import Header from './components/Header/Header';

const Layout = () => {
  const location = useLocation();
  const showHeader = location.pathname !== '/';

  return (
    <div>
      {showHeader && <Header />}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

