import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AddProperty from "./pages/AddProperty.jsx";
import PropertyDetails from "./pages/PropertyDetails.jsx";
import EditProperty from "./pages/EditProperty.jsx";

import ProtectedRoute from "./component/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/add-property"
          element={<AddProperty />}
        />

        <Route
          path="/properties/:id"
          element={<PropertyDetails />}
        />

        <Route
          path="/edit-property/:id"
          element={<EditProperty />}
        />
      </Route>
    </Routes>
  );
}

export default App;