// import i moduli di react-router
import { NavLink } from "react-router-dom";
// importo l'hook di autenticazione
import { useAuth } from "../../../contexts/AuthContext";

function Navbar() {
  const navPages = [
    {
      label: "Home",
      path: "/",
    },
    {
      label: "Posts",
      path: "/posts",
    },
  ];

  const { isLogged, logOut } = useAuth();

  return (
    <>
      <nav
        className={`navbar navbar-expand-lg ${
          isLogged ? "bg-black" : "bg-light"
        }`}
      >
        <div className="container-fluid bg">
          <div className=" w-100">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex justify-content-between">
              <div className=" d-flex">
                {navPages.map((page, index) => (
                  <li key={index} className="nav-item fs-3 p-2">
                    {/* il componente NavLink è simile al componente Link,
                                quindi fronisce la possibilità di navigare attraverso le pagine,
                                 ma in questo caso applica al link attivo la classe .active */}
                    <NavLink
                      to={page.path}
                      className={`nav-link active ${
                        isLogged ? "text-light" : "text-black"
                      }`}
                      aria-current="page"
                    >
                      {page.label}
                    </NavLink>
                  </li>
                ))}
              </div>
              {/* linkbutton per la login e register page */}
              {isLogged === true ? (
                <div>
                  {/* pulsante di logout */}
                  <li
                    onClick={logOut}
                    style={{ cursor: "pointer" }}
                    className=" nav-item fs-3 p-2 text-light"
                  >
                    <span className=" nav-link active text-light" aria-current="page">
                      Logout
                    </span>
                  </li>
                </div>
              ) : (
                <div className="d-flex">
                  {/* <li className=" nav-item fs-3 p-2">
                    <NavLink
                      to={`/register`}
                      className=" nav-link active"
                      aria-current="page"
                    >
                      Registrati
                    </NavLink>
                  </li> */}
                  <li className=" nav-item fs-3 p-2">
                    <NavLink
                      to={`/login`}
                      className=" nav-link active"
                      aria-current="page"
                    >
                      Login
                    </NavLink>
                  </li>
                </div>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
