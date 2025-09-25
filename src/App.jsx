import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./layouts/app-layout";
import LandingPage from "./pages/landing";
import Onboarding from "./pages/onboarding";
import OpeningDetails from "./pages/OpeningDetails";
import OpeningsList from "./pages/OpeningsList";
import PostOpening from "./pages/PostOpening";
import SavedOpenings from "./pages/SavedOpenings";
import MyApplications from "./pages/MyApplications";
import { ThemeProvider } from "./components/theme-provider";
import ProtectedRoute from "./components/protected-route";
import "./App.css";

const router= createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />
      },
      {
        path: "/onboarding",
        element: (<ProtectedRoute>
        <Onboarding />
        </ProtectedRoute>)
      },
      {
        path: "/openingList",
        element: (<ProtectedRoute>
          <OpeningsList />
        </ProtectedRoute>)
      },
      {
        path: "/openingDetails/:id",
        element:(<ProtectedRoute> <OpeningDetails/></ProtectedRoute>)
      },
      {
        path: "/postOpening",
        element:(<ProtectedRoute> <PostOpening /></ProtectedRoute>)
      },
      {
        path: "/savedOpenings",
        element: (<ProtectedRoute><SavedOpenings /></ProtectedRoute>)
      },
      {
        path: "/myApplications",
        element: (<ProtectedRoute><MyApplications /></ProtectedRoute>)
      },
    ]
  }
])

function App() {


  return (  
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />  
    </ThemeProvider>)
}

export default App
