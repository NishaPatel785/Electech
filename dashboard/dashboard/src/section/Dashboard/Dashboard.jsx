import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CategoryIcon from '@mui/icons-material/Category';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import Products from '../Products/Products';
import Brands from '../Brands/Brand';
import Category from '../Category/Category';
import Subcategory from '../SubCategories/SubCategories';
import BentoIcon from '@mui/icons-material/Bento';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import logo from "./Logo2.png";
import GroupsIcon from '@mui/icons-material/Groups';
import Users from '../Users/Users';
import Orders from '../Orders/Orders';
import DescriptionIcon from '@mui/icons-material/Description';
import { useNavigate } from 'react-router-dom';


const NAVIGATION = [
  { segment: 'dashboard', title: 'Dashboard', icon: <DashboardIcon /> },
  { segment: 'user', title: 'Users', icon: <GroupsIcon /> },
  { segment: 'products', title: 'Products', icon: <BentoIcon /> },
  { segment: 'brands', title: 'Brands', icon: <LocalLibraryIcon /> },
  { segment: 'categories', title: 'Categories', icon: <CategoryIcon /> },
  { segment: 'subcategories', title: 'SubCategories', icon: <CategoryIcon /> },
  { segment: 'orders', title: 'Orders', icon: <DescriptionIcon /> },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function Dashboard() {
  return <Typography>Welcome to the Dashboard</Typography>;
}



function DemoPageContent({ pathname }) {
  const renderPage = () => {
    switch (pathname) {
      case '/dashboard': return <Dashboard />;
      case '/user': return <Users />;
      case '/products': return <Products />;
      case '/brands': return <Brands />;
      case '/categories': return <Category />;
      case '/subcategories': return <Subcategory />;
      case '/orders': return <Orders />;
      default: return <Typography>Page Not Found</Typography>;
    }
  };

  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      {renderPage()}
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function DashboardLayoutAccount(props) {
  const { window } = props;
  const user=JSON.parse(sessionStorage.getItem('user'));
  const navigate=useNavigate()

  const [session, setSession] = React.useState({
    user: {
      name: `${user.first_name} ${user.last_name}`,
      email:`${user.email}`,
      image: 'https://avatars.githubusercontent.com/u/19550456',
    },
  });

  const authentication = React.useMemo(() => ({
    signIn: () => setSession({ user: session.user }),
    signOut: () => {sessionStorage.removeItem('refreshToken'),sessionStorage.removeItem('user'),navigate('/login')}
  }), [session.user]);

  const router = useDemoRouter('/dashboard');
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <AppProvider
      session={session}
      authentication={authentication}
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
      branding={{
        logo: (
          <Box sx={{ height: 80, display: 'flex', alignItems: 'center', pl: 1 }}>
          <img
            src={logo}
            alt="Your Logo"
            style={{
              height: '500px',
              width: 'auto',
              maxHeight: '100px',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </Box>
        ),
        appName: ' ',
      }}
    >
      <DashboardLayout>
        <DemoPageContent pathname={router.pathname} />
      </DashboardLayout>
    </AppProvider>
  );
}

DashboardLayoutAccount.propTypes = {
  window: PropTypes.func,
};

export default DashboardLayoutAccount;
