import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './index.css';
import Home from './routes/home';
import ErrorPage from './routes/error';
import reportWebVitals from './reportWebVitals';
import Assets from './routes/assets';
import Companies from './routes/companies'; 

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/assets",
    element: <Assets />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/companies",
    element: <Companies />,
    errorElement: <ErrorPage />,
  }, 
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
