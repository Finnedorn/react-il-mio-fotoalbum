// importo i componenti di react router-dom per la creazione di un sistema di routing
import { BrowserRouter, Routes, Route } from "react-router-dom";
// importo i layout
import Layout from "./assets/components/Layout/Layout";
// importo il provider di photos
import { PhotoProvider } from "./contexts/PhotoContext";
// importo il provider di autenticazione
import { AuthProvider } from "./contexts/AuthContext";
// importo il middleware di autenticazione
import LogChecker from "./middlewares/logChecker";
// importo la pagina di login
import Login from "./pages/Login/Login";

// import le rotte alle varie pagine
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/notFound";
// import le routes di photos
import PhotoIndex from "./pages/Photo/photoIndex";
import PhotoShow from "./pages/Photo/photoShow";
import PhotoCreate from "./pages/Photo/photoCreate";

function App() {
  return (
    <div className="App">
      {/* browserRouter e' un componente originario di router-dom e 
      funge da base per definire le varie route attraverso i tag Routes */}
      <BrowserRouter>
        {/* photoProvider e' un provider personalizzato che sharera 
        il contenuto della chiamata photos con tutte le routes al suo interno */}
        <PhotoProvider>
          {/* l'authprovider si occupera di capire se l'utente ha effettuato o no il login */}
          <AuthProvider>
            <Routes>
              {/* Estensione del layout "nav + footer" a tutte le pagine */}
              <Route path="/" element={<Layout />}>
                {/* Rotte pubbliche */}
                <Route path="*" element={<NotFound />} />
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                {/* rotta show versione pubblica */}
                <Route path="photos/:id" element={<PhotoShow />} />
              </Route>

              {/* Rotte protette dal middleware di autenticazione */}
              <Route
                path="/"
                element={
                  <LogChecker>
                    <Layout />
                  </LogChecker>
                }
              >
                <Route path="photos">
                  <Route index element={<PhotoIndex />} />
                  <Route path="create" element={<PhotoCreate />} />
                </Route>
              </Route>
            </Routes>
          </AuthProvider>
        </PhotoProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
