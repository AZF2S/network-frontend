import { AuthProvider } from "./contexts/AuthContext";
import App from "./App";

function Main() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default Main;
