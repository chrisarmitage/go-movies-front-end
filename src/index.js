import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import EditMovie from './components/EditMovie';
import ErrorPage from './components/ErrorPage';
import Genres from './components/Genres';
import GraphQL from './components/GraphQL';
import Home from './components/Home';
import Login from './components/Login';
import ManageCatalog from './components/ManageCatalog';
import Movies from './components/Movies';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { 
        index: true, 
        element: <Home />, 
      },
      {
        path: "/movies",
        element: <Movies />,
      },
      {
        path: "/genres",
        element: <Genres />,
      },
      {
        path: "/admin/movie/0",
        element: <EditMovie />,
      },
      {
        path: "/manage-catalog",
        element: <ManageCatalog />,
      },
      {
        path: "/graphql",
        element: <GraphQL />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
