import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './pages/Home';
import Hotels from './pages/Hotels';
import Login from './pages/Login';
import Register from './pages/Register';
import ClientDashboard from './pages/dashboard/ClientDashboard';
import GerantDashboard from './pages/dashboard/GerantDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import MonCompte from './pages/MonCompte';
import AjouterEtablissement from './pages/Gerant/AjouterEtablissement';
import Explore from "./pages/Explore";
import EtablissementDetails from "./pages/EtablissementDetails";
import ReservationForm from "./pages/ReservationForm";
import ReservationFormRestaurant from "./pages/ReservationFormRestaurant";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPhoto, setUserPhoto] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);

    const photo = localStorage.getItem("userPhoto");
    setUserPhoto(photo || null);
  }, []);

  return (
    <div className="min-h-screen w-screen overflow-x-hidden">

      {/* ✅ Navbar fixée */}
      <Navbar
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        userPhoto={userPhoto}
      />

      {/* ✅ Le padding-top est géré ici, donc plus besoin de pt-20 dans les pages */}
      <div className="">

        <Routes>
        <Route
  path="/"
  element={
    <Home
      isAuthenticated={isAuthenticated}
      setIsAuthenticated={setIsAuthenticated}
      userPhoto={userPhoto}
    />
  }
/>

          <Route path="/hotels" element={<Hotels />} />
          <Route path="/reserver/:id" element={<ReservationForm />} />
          <Route path="/etablissements/:id/reserver" element={<ReservationFormRestaurant />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/etablissement/:id" element={<EtablissementDetails />} />
          <Route path="/explore/:ville" element={<Explore />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/client" element={<ClientDashboard />} />
          <Route path="/dashboard/gerant" element={<GerantDashboard nom="Moustapha" />} />
          <Route path="/dashboard/admin" element={<AdminDashboard nom="Abissa" />} />
          <Route path="/profil" element={<MonCompte setUserPhoto={setUserPhoto} />} />
          <Route path="/moncompte" element={<MonCompte />} />
          <Route path="/gerant/ajouter-etablissement" element={<AjouterEtablissement />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;


