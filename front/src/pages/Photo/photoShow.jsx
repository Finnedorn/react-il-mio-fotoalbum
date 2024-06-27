import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams, useLocation } from "react-router-dom";

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
  const initialSlug = initialphoto?.slug || slug; 
  
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
 

  if(!photo) {
    return <div>Photo non trovata o non più presente.</div>
  }

  return (
    <div className="container">
      <div className=" bg-light d-flex justify-content-center rounded-3 overflow-hidden my-5">
        <h1>
          pagina di show
        </h1>
      </div>
    </div>
  );
};

export default PhotoShow;
