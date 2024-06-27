import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const apiUrl = import.meta.env.VITE_BASE_API_URL;

const PhotoShow = () => {
  // uso L'hook useParams per estrapolarmi lo slug della single page del photo che ho cliccato
  const { slug } = useParams();
  // tengo memoria dello state della pagina in caso volessi implementare in futuro
  // dinamiche di scorrimento tra le varia single pages tramite pulsanti "+" e "-"
  const location = useLocation();
  // ho un valore di state per questa photo ? altrimenti ha valore null
  // questo mi servirà quando abiliterò lo scorrimento delle single pages
  const initialPhoto = location.state?.photo || null;
  // ho un valore per di photo di tipo slug ? altrimenti ha valore dello slug portato con useParams
  const initialSlug = initialPhoto?.slug || slug;

  const [photo, setPhoto] = useState(initialPhoto);
  // setto un hook per attivare un loader nel mentre che carico gli elementi a schermo
  const [loading, setLoading] = useState(true);

  // effettuo la chiamata per la single page
  const fetchSinglePhoto = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/photos/${initialSlug}`);
      setPhoto(response.data);
    } catch (error) {
      console.log(error);
      setLoading(false);
      return <div>Errore durante il caricamento della pagina: {error}</div>;
    } finally {
      // in ogni caso setto il loader a false così da disporre o l'errore o il risultato della chiamata
      setLoading(false);
    }
  };

  // al cambiamento del valore di initialSlug
  // (es: scorro tra le pagine o ricarico la pagina con un params differente)
  // effettuo la chiamata solo se non ho già valori per photo
  useEffect(() => {
    if (!photo) {
      fetchSinglePhoto();
    } else {
      setLoading(false);
    }
  }, [initialSlug]);

  if (loading) {
    return <div>Carico la Photo...</div>;
  }

  if (!photo) {
    return <div>Photo non trovata o non più presente.</div>;
  }

  const { isLogged } = useAuth();

  return (
    <div className="container">
      <div className=" bg-light d-flex justify-content-center rounded-3 overflow-hidden my-5">
        <div
          style={{
            overflow: "hidden",
          }}
        >
          {photo.image ? (
            <img src={photo.image} alt={`Image of ${photo.title}`} />
          ) : (
            <img
              src="https://placehold.co/600x400"
              alt={`Image of ${photo.title}`}
            />
          )}
        </div>
        <div className=" d-flex justify-content-center w-75">
          <div className="p-5">
            <div>
              <h2
                style={{
                  marginBottom: "10px",
                }}
              >
                {photo.title}
              </h2>
              <p
                style={{
                  fontSize: "1.3rem",
                  padding: "10px 0px",
                }}
              >
                {photo.description}
              </p>
            </div>
            <div>
              <div className={`d-flex mb-3 ${isLogged ? "d-block" : "d-none"}`}>
                <span className="badge text-bg-primary fs-5 me-2 text-light">
                  stato:
                  {photo.visible === true ? "pubblicata" : "non pubblicata"}
                </span>
              </div>
              {photo.categories.map((category, index) => (
                <span
                  key={index}
                  className={`tag text-bg-secondary badge fs-5 me-2 text-light`}
                >
                  {category.name}
                </span>
              ))}
            </div>
            <div className="d-flex justify-content-between align-items-center align-content-center mt-5">
              <div>
                {/* se l'utente è loggato lo redireziono alla index altrimenti lo reindirizzo alla Home */}
                <Link to={isLogged ? "../" : "/"} relative="path">
                  <button className="btn btn-success me-2">
                    Torna alla Pagina Precedente
                  </button>
                </Link>
              </div>
              <div className={`d-flex ${isLogged ? "d-block" : "d-none"}`}>
                <button
                className="btn btn-success me-2"
                onClick={console.log("edit")}
                >
                  edit
                </button>
                <button
                className="btn btn-success me-2"
                onClick={console.log("delete")}
                >
                  delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoShow;
