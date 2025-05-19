import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './pages/Home';
import Hotels from './pages/Hotels';
import Login from './pages/Login';
import Register from './pages/Register';
import ClientDashboard from './pages/dashboard/ClientDashboard';
import DashboardGerantHotel from "./pages/dashboard/GerantDashboard";
import AdminDashboard from './pages/dashboard/AdminDashboard';
import MonCompte from './pages/MonCompte';
import AjouterEtablissement from './pages/gerant/AjouterEtablissement';
import Explore from "./pages/Explore";
import EtablissementDetails from "./pages/EtablissementDetails";
import ReservationForm from "./pages/ReservationForm";
import ReservationFormRestaurant from "./pages/ReservationFormRestaurant";
import PayementSuccess from "./pages/PaymentSuccess";
import ConfigurationHotel from "./pages/dashboard/ConfigurationHotel";
import ModifierEtablissement from "./pages/dashboard/ModifierEtablissement";
import ModifierChambre from "./pages/dashboard/ModifierChambre";
import ReservationsHotel from "./pages/dashboard/ReservationsHotel";
import ToutesChambres from "./pages/dashboard/ToutesChambres";
import ListeChambres from "./pages/dashboard/ListeChambres";
import AjouterChambre from "./pages/dashboard/AjouterChambre";
import DashboardGerantRestaurant from "./pages/dashboard/DashboardGerantRestaurant";
import ReservationsRestaurant from "./pages/dashboard/ReservationsRestaurant";
import GestionTablesResto from "./pages/dashboard/GestionTablesResto";
import AjouterRestaurantForm from "./pages/dashboard/AjouterRestaurantForm";
import DetailsRestaurant from "./pages/dashboard/DetailsRestaurant";
import ModifierTable from "./pages/dashboard/ModifierTable";
import AjouterTable from "./pages/dashboard/AjouterTable";
import APropos from "./pages/APropos";
import DevenirGerant from "./pages/DevenirGerant";

import RechercheLuxvia from "./pages/RechercheLuxvia";
import ChambreDetails from "./pages/ChambreDetails";
import UploadImagesChambre from "./pages/UploadImagesChambre";
import TableDetails from "./pages/TableDetails";
import EmailVerification from "./pages/EmailVerification";
import VerificationSuccess from "./pages/VerificationSuccess";
import MenuRestaurant from "./pages/MenuRestaurant";
import GererMenu from "./pages/dashboard/GererMenu";
import RechercheResultats from "./pages/RechercheResultats";





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
<Route
  path="/gerant/configuration"
  element={<ConfigurationHotel />}
/>
<Route
  path="/gerant/etablissement/:etabId/chambres/:chambreId/modifier"
  element={<ModifierChambre />}
/>
<Route
  path="/gerant/chambre/:chambreId/modifier"
  element={<ModifierChambre />}
/>
<Route
  path="/gerant/etablissement/:etabId/ajouter-chambre"
  element={<AjouterChambre />}
/>

<Route
  path="/recherche"
  element={
    <RechercheLuxvia
      isAuthenticated={isAuthenticated}
      setIsAuthenticated={setIsAuthenticated}
      userPhoto={userPhoto}
    />
  }
/>
<Route
  path="/recherche-resultats"
  element={
    <RechercheResultats
      isAuthenticated={isAuthenticated}
      setIsAuthenticated={setIsAuthenticated}
      userPhoto={userPhoto}
    />
  }
/>


          <Route path="/hotels" element={<Hotels />} />
          <Route path="/gerant/table/:id/modifier" element={<ModifierTable />} />
          <Route path="/devenir-gerant" element={<DevenirGerant />} />
          <Route path="/chambre/:id" element={<ChambreDetails />} />
          <Route path="/dashboard/gerant/chambre/:id/images" element={<UploadImagesChambre />} />
          <Route path="/table/:id" element={<TableDetails />} />
          <Route path="/email-verification" element={<EmailVerification />} />
          <Route path="/verification-success" element={<VerificationSuccess />} />
          <Route path="/restaurant/:id/menu" element={<MenuRestaurant />} />
          <Route path="/dashboard/gerant-restaurant/menu" element={<GererMenu />} />
          

          <Route path="/dashboard/restaurant/:id/tables" element={<GestionTablesResto />} />
          <Route path="/gerant/restaurant/:id/ajouter-table" element={<AjouterTable />} />
          <Route path="/dashboard/restaurant/ajouter" element={<AjouterRestaurantForm />} />
          <Route path="/dashboard/restaurant" element={<DashboardGerantRestaurant />} />
          <Route path="/gerant/restaurant/:id/details" element={<DetailsRestaurant />} />
          <Route path="/a-propos" element={<APropos />} />
          <Route path="/dashboard/restaurant/reservations" element={<ReservationsRestaurant />} />
          <Route path="/gerant/etablissement/:id/modifier" element={<ModifierEtablissement />} />
          <Route path="/gerant/etablissement/:id/chambres" element={<ListeChambres />} />
          <Route path="/gerant/chambres" element={<ToutesChambres />} />
          <Route path="/gerant/reservations" element={<ReservationsHotel />} />
          <Route path="/reserver/:id" element={<ReservationForm />} />
          <Route path="/payement-success" element={<PayementSuccess />} />
          <Route path="/etablissements/:id/reserver" element={<ReservationFormRestaurant />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/etablissement/:id" element={<EtablissementDetails />} />
          <Route path="/explore/:ville" element={<Explore />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/client" element={<ClientDashboard />} />
          <Route path="/gerant/dashboard" element={<DashboardGerantHotel />} />
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


