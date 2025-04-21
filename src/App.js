import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./pages/About";
import BecomeMember from "./pages/BecomeMember";
import ContactUs from "./pages/ContactUs";
import Faq from "./pages/Faq";
import Forum from "./pages/Forum";
import Home from "./pages/Home";
import Map from "./pages/Map";
import Resources from "./pages/Resources";
import ContactList from "./pages/ContactList";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Accessibility from "./pages/Accessibility";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import SubmitResource from "./pages/SubmitResource";
import ThankYouContactUs from "./pages/ThankYouContactUs";
import React, { useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import MembershipForm from "./pages/MembershipForm";
import AdminPanel from "./pages/AdminPanel";
import RenewMembership from "./pages/RenewMembership";
import MembershipAcceptanceDialog from "./components/Dialogs/MembershipAcceptance";
import { DialogProvider } from "./utils/DialogProvider";
import { RouteGuard } from "./utils/RouteGuard"; // Kept original name

function App() {
  const [open, setOpen] = useState(false);
  const { user, showMembershipAcceptance, setShowMembershipAcceptance } = useAuth();

  return (
      <div className="relative min-h-screen">
        <DialogProvider>
          <BrowserRouter>
            <Navbar open={open} setOpen={setOpen} />
            <Routes>
              {/* Public */}
              <Route path="/" element={<Home />} />
              <Route path="*" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/map" element={<Map />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/accessibility" element={<Accessibility />} />
              <Route path="/login" element={<Login />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/thank-you-contact-us" element={<ThankYouContactUs />} />

              {/* Signed in, email verified (todo: split these up after adding email validation page */}
              <Route path="/become-a-member" element={
                <RouteGuard user={user} requires="isAuthenticated" uri="/login">
                  <RouteGuard user={user} requires="isEmailVerified" uri="/">
                    <BecomeMember />
                  </RouteGuard>
                </RouteGuard>
              } />

              <Route path="/membership-form" element={
                <RouteGuard user={user} requires="isAuthenticated" uri="/login">
                  <RouteGuard user={user} requires="isEmailVerified" uri="/">
                    <MembershipForm />
                  </RouteGuard>
                </RouteGuard>
              } />

              <Route path="/renew-membership" element={
                <RouteGuard user={user} requires="isAuthenticated" uri="/login">
                  <RouteGuard user={user} requires="isEmailVerified" uri="/">
                    <RenewMembership />
                  </RouteGuard>
                </RouteGuard>
              } />

              {/* Is member */}
              <Route path="/contact-list" element={
                <RouteGuard user={user} requires="isAuthenticated" uri="/login">
                  <RouteGuard user={user} requires="isEmailVerified" uri="/">
                    <RouteGuard user={user} requires="isMember" uri="/become-a-member">
                      <ContactList />
                    </RouteGuard>
                  </RouteGuard>
                </RouteGuard>
              } />

              <Route path="/forum" element={
                <RouteGuard user={user} requires="isAuthenticated" uri="/login">
                  <RouteGuard user={user} requires="isEmailVerified" uri="/">
                    <RouteGuard user={user} requires="isMember" uri="/become-a-member">
                      <Forum />
                    </RouteGuard>
                  </RouteGuard>
                </RouteGuard>
              } />

              <Route path="/submit-a-resource" element={
                <RouteGuard user={user} requires="isAuthenticated" uri="/login">
                  <RouteGuard user={user} requires="isEmailVerified" uri="/">
                    <RouteGuard user={user} requires="isMember" uri="/become-a-member">
                      <SubmitResource />
                    </RouteGuard>
                  </RouteGuard>
                </RouteGuard>
              } />

              {/* Admin Routes */}
              <Route path="/admin-panel" element={
                <RouteGuard user={user} requires="isAuthenticated" uri="/login">
                  <RouteGuard user={user} requires="isEmailVerified" uri="/">
                    <RouteGuard user={user} requires="isMember" uri="/become-a-member">
                      <RouteGuard user={user} requires="isAdmin" uri="/login">
                        <AdminPanel />
                      </RouteGuard>
                    </RouteGuard>
                  </RouteGuard>
                </RouteGuard>
              } />

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