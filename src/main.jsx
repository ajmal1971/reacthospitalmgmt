import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import {Home, Department, Doctor, Medicine, Patient, PatientHistory, PatientFollowupHistory} from './components/index.js';
import { Provider } from 'react-redux';
import store from './store/store.js';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
          path: "/",
          element: <Home />,
      },
      {
        path: "/departments",
        element: <Department />
      },
      {
        path: "/doctors",
        element: <Doctor />
      },
      {
        path: "/medicines",
        element: <Medicine />
      },
      {
        path: "/patient",
        element: <Patient />
      },
      {
        path: "/patient-history",
        element: <PatientHistory />
      },
      {
        path: "/patient-followup-history",
        element: <PatientFollowupHistory/>
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  </React.StrictMode>,
)
