import { Navigate, useLocation } from "react-router-dom";
// importo la funzione di hook
import { useAuth } from "../contexts/AuthContext";

// creo un middleware che controlli se isLogged è settato su true o false
// e quindi se l'utente abbia effettuato o meno il login
const LogChecker = ({ children }) => {
  // estrapolo isLogged dai valori di useAuth
  const { isLogged } = useAuth();
  // attivo uselocation così da tenere memoria della pagina 
  // che l'utente voleva visitare prima del redirect forzato
  const location = useLocation();

  // se isLogged è false l'utente non avrà effettuato il login
  // di conseguenza verrà redirezionato sulla pagina di login
  if (!isLogged) {
    // una volta verificato lo stato di isLogged
    // effettuo un redirect alla dashboard
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
}

export default LogChecker;