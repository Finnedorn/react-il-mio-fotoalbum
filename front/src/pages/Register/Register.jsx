import { useState } from "react";
// importo l'hook di autenticazione
import { useAuth } from "../../contexts/AuthContext";

// creo la pagina di login dell'utente
const Register = () => {
  // estrapolo la funzione register
  const { register } = useAuth();

  // setto la var obj da riempire coi valori del form
  const dataToRegister = {
    name: "",
    email: "",
    password: "",
  };

  // setto la var accountData con valore di dataToRegister, che aggiornerò coi dati del form
  const [accountData, setAccountData] = useState(dataToRegister);

  //
  const [signError, setSignError] = useState(null);

  const changeData = (key, value) => {
    setAccountData((curr) => ({
      ...curr,
      [key]: value,
    }));
  };

  // al submit del form
  // prendo l'evento ed effettuo un prevent default
  // attivo la funzione di register che cambia il valore di isLogged
  // ed invia i dati al backend
  // permettendo all'utente di bypassare il middleware
  const handleLogin = async (e) => {
    // prevento il refresh della pagina
    e.preventDefault();

    try {
      await register(accountData);
      setAccountData(dataToVerify);
    } catch (error) {
      setSignError(error);
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
            <form className="d-flex flex-wrap justify-content-center p-3">
              <div className=" w-100">
                <label className="d-flex align-items-center py-3">
                  <span className="fs-3 pe-5 me-3">Nome</span>
                  <input
                    className="form-control w-50"
                    type="text"
                    value={accountData.name}
                    onChange={(e) => changeData("name", e.target.value)}
                  />
                </label>
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
              <button
                onClick={handleLogin}
                className=" btn btn-primary fs-4 mt-3"
              >
                Registrati
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
