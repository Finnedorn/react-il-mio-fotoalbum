import { useState } from "react";
import { NavLink } from "react-router-dom";
// importo l'hook di autenticazione
import { useAuth } from "../../contexts/AuthContext";

// creo la pagina di login dell'utente
const Login = () => {
  // estrapolo la funzione logIn
  const { logIn } = useAuth();

  const dataToVerify = {
    email: "",
    password: "",
  };

  const [accountData, setAccountData] = useState(dataToVerify);

  const [logError, setLogError] = useState(null);

  const changeData = (key, value) => {
    setAccountData((curr) => ({
      ...curr,
      [key]: value,
    }));
  };

  // al submit del form
  // prendo l'evento ed effettuo un prevent default
  // attivo la funzione di login che cambia il valore di isLogged
  // peremttendo all'utente di bypassare il middleware
  const handleLogin = async (e) => {
    console.log("login");
    // prevento il refresh della pagina
    e.preventDefault();
    try {
      await logIn(accountData);
      setAccountData(dataToVerify);
    } catch (error) {
      setLogError(error);
    }
  };

  return (
    <>
      <div className="d-flex flex-column align-items-center">
        <h1 className=" d-flex display-1 justify-content-center text-light pb-5">
          Effettua il login
        </h1>
        <div className="card p-5 rounded-4">
          <div>
            <form
              onSubmit={handleLogin}
              className="d-flex flex-wrap justify-content-center p-3"
            >
              <div className=" w-100">
                <label className="d-flex align-items-center py-3">
                  <span className="fs-3 pe-5 me-3">Email</span>
                  <input
                    className="form-control w-50"
                    type="email"
                    value={accountData.email}
                    onChange={(e) => changeData("email", e.target.value)}
                  />
                </label>
                <label className="d-flex align-items-center py-3">
                  <span className="fs-3 pe-2 me-3">Password</span>
                  <input
                    className="form-control w-50"
                    type="password"
                    value={accountData.password}
                    onChange={(e) => changeData("password", e.target.value)}
                  />
                </label>
              </div>
              <button type="submit" className=" btn btn-primary fs-4 mt-3">
                Login
              </button>
            </form>
            {/* <div className="d-flex justify-content-center pt-4">
              <h4>
                Non hai un account?
                <NavLink
                  to={`/register`}
                  className=" ms-2"
                  aria-current="page"
                >
                  Registrati
                </NavLink>
              </h4>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
