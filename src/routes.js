import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
import User from './pages/User';
import NotFound from './pages/Page404';
import Clients from './pages/Clients';
import Folders from './pages/Folders';
import AccountActivities from './pages/AccountActivities';
import Tasks from './pages/Tasks';
import Documents from './pages/Documents';
import CaseStatus from './pages/CaseStatus';
import Profile from './pages/Profile';
import Calendar from './pages/Calendar';
import ForgetPassword from './pages/ForgetPassword';
import ApproveUser from './pages/ApproveUser';
import LicencesList from './pages/LicencesList';
import ChangePassword from './pages/ChangePassword';
import AddNewRecords from './pages/AddNewRecords';
import CaseType from "./pages/CaseType";
import AccountActivity from "./pages/AccountActivity";
import ProcessType from "./pages/ProcessType";
import TaskType from "./pages/TaskType";
import CourtOffice from "./pages/CourtOffice";
import LicenceSettings from "./pages/LicenceSettings";
import ConnectedLicences from "./pages/ConnectedLicences";

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" replace /> },
        { path: 'app', element: <DashboardApp /> },
        { path: 'user', element: <User /> },
        { path: 'clients', element: <Clients /> },
        { path: 'folders', element: <Folders /> },
        { path: 'accountActivities', element: <AccountActivities /> },
        { path: 'tasks', element: <Tasks /> },
        { path: 'documents', element: <Documents /> },
        { path: 'calendar', element: <Calendar /> },
        { path: 'caseStatus', element: <CaseStatus /> },
        { path: 'caseType', element: <CaseType /> },
        { path: 'processType', element: <ProcessType /> },
        { path: 'taskType', element: <TaskType /> },
        { path: 'courtOffice', element: <CourtOffice /> },
        { path: 'accountActivity', element: <AccountActivity /> },
        { path: 'addNewRecords', element: <AddNewRecords /> },
        { path: 'licenceSettings', element: <LicenceSettings /> }
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: 'approveUser', element: <ApproveUser /> },
        { path: 'changePassword', element: <ChangePassword /> },
        { path: '404', element: <NotFound /> },
        { path: '/', element: <Navigate to="/dashboard" /> },
        { path: '*', element: <Navigate to="/404" /> },
        { path: 'profile', element: <Profile /> },
        { path: 'forgotPassword', element: <ForgetPassword /> },
        { path: 'licencesList/:id', element: <LicencesList /> },
        { path: 'connectedLicences', element: <ConnectedLicences /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
