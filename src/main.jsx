import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import {Home, Department, Doctor} from './components/index.js';
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
        path: "/department",
        element: <Department />
      },
      {
        path: "/doctor",
        element: <Doctor />
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
