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
// importo la pagina di register
import Register from "./pages/Register/Register";

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
      <BrowserRouter>
        <PhotoProvider>
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
