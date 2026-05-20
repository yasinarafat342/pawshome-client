import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../components/shared/MainLayout';
import DashboardLayout from '../components/shared/DashboardLayout';
import PrivateRoute from './PrivateRoute';

// Pages
import Home from '../pages/home/Home';
import AllPets from '../pages/pets/AllPets';
import PetDetails from '../pages/pets/PetDetails';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import NotFound from '../pages/NotFound';

// Dashboard Pages
import AddPet from '../pages/dashboard/AddPet';
import MyListings from '../pages/dashboard/MyListings';
import MyRequests from '../pages/dashboard/MyRequests';
import UpdatePet from '../pages/dashboard/UpdatePet';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: 'pets', element: <AllPets /> },
      {
        path: 'pets/:id',
        element: (
          <PrivateRoute>
            <PetDetails />
          </PrivateRoute>
        ),
      },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <MyRequests /> },
      { path: 'my-requests', element: <MyRequests /> },
      { path: 'add-pet', element: <AddPet /> },
      { path: 'my-listings', element: <MyListings /> },
      { path: 'update-pet/:id', element: <UpdatePet /> },
    ],
  },
  { path: '*', element: <NotFound /> },
]);

export default router;
