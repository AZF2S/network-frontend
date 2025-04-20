import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./pages/About";
import Account from "./pages/Account";
import BecomeMember from "./pages/BecomeMember";
import Calendar from "./pages/Calendar";
import ContactUs from "./pages/ContactUs";
import Faq from "./pages/Faq";
import Forum from "./pages/Forum";
import Home from "./pages/Home";
import Map from "./pages/Map";
import Resources from "./pages/Resources";
import Search from "./pages/Search";
import ContactList from "./pages/ContactList";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Accessibility from "./pages/Accessibility";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ThankYou from "./pages/ThankYou";
import SubmitResource from "./pages/SubmitResource";
import ThankYouContactUs from "./pages/ThankYouContactUs";
import React from "react";
import { useState, useEffect } from "react";
import Newsletter from "./pages/Newsletter";
import { useAuth } from "./contexts/AuthContext";
import { authApi } from "./api";
import MembershipForm from "./pages/MembershipForm";
import AdminPanel from "./pages/AdminPanel";
import RenewMembership from "./pages/RenewMembership";
import MembershipAcceptanceDialog from "./components/Dialogs/MembershipAcceptance";
import { DialogProvider } from "./utils/DialogProvider";
import { IsMemberGuard } from './utils/RouteGuards';

function App() {
  const [open, setOpen] = useState(false);
  const [showMembershipAcceptance, setShowMembershipAcceptance] = useState(false);

  const { user, setIsAuthenticated, setUser, setIsAdmin } = useAuth();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: userData } = await authApi.getCurrentUser();
        setIsAuthenticated(true);
        setUser(userData);

        if (userData.recentlyverified) {
          setShowMembershipAcceptance(true);
        }

        try {
          await authApi.isAdmin();
          setIsAdmin(true);
        } catch (error) {
          setIsAdmin(false);
        }
      } catch (error) {
        console.log("Not authenticated or error fetching user:", error);
        setIsAuthenticated(false);
        setUser(null);
        setIsAdmin(false);
      }
    };

    initializeAuth();
  }, [setIsAuthenticated, setUser, setIsAdmin]);

  return (
      <div className="relative min-h-screen">
        <DialogProvider>
          <BrowserRouter>
            <Navbar open={open} setOpen={setOpen} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/account" element={<Account />} />
              <Route path="/become-a-member" element={<BecomeMember />} />
              <Route path="/calendar" element={<IsMemberGuard user={user}><Calendar /></IsMemberGuard>} />
              <Route path="/contact-list" element={<IsMemberGuard user={user}><ContactList /></IsMemberGuard>} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/forum" element={<IsMemberGuard user={user} uri="/forum"><Forum /></IsMemberGuard>} />
              <Route path="/map" element={<Map />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/search" element={<Search />} />
              <Route path="/newsletter" element={<Newsletter />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/accessibility" element={<Accessibility />} />
              <Route path="/login" element={<Login />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="submit-a-resource" element={<SubmitResource />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/thank-you-contact-us" element={<ThankYouContactUs />} />
              <Route path="/membership-form" element={<MembershipForm />} />
              <Route path="/renew-membership" element={<RenewMembership />} />
              <Route path="/admin-panel" element={<AdminPanel />} />
              <Route path="*" element={<Home />} />
            </Routes>
            <Footer />
          </BrowserRouter>
          <MembershipAcceptanceDialog
              open={showMembershipAcceptance}
              onClose={() => setShowMembershipAcceptance(false)}
          />
        </DialogProvider>
      </div>
  );
}

export default App;