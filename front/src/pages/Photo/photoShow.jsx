import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import DetailsComponent from "../../assets/components/photoDetails/DetailsComponent";
import FormComponent from "../../assets/components/photoDetails/FormComponent";
const apiUrl = import.meta.env.VITE_BASE_API_URL;

const PhotoShow = () => {
  // estrapolo lo slug dall'url con l'hook useParams di react router
  // restituisce un oggetto di coppie chiave/valore dei parametri dell'URL
  const { slug } = useParams();
  // tengo memoria dello state attuale della pagina
  const location = useLocation();
  // hook di react router responsabile utilizzato per effettuare redirect
  const navigate = useNavigate();
  // se ho modo di estrapolare dallo state i dati di photo li storo in initialPhoto
  // state è una proprietà di location e può essere usata per passare dati tramite la navigazione 
  // in questo caso sto sfruttando uselocation per provare ad estrapolare i dati di photo dall'url
  const initialPhoto = location.state?.photo || null;
  // se tra i dati di url è presente lo slug lo storo in initialSlug 
  // altrimenti mi prendo lo slug estrapolato da useParams
  const initialSlug = initialPhoto?.slug || slug;



  // la var hook in cui inserirò i dati della photo corrente
  // ha valore di initialPhoto in quanto è pensato per ottimizzare
  // la ricezione dei dati di photo attraverso l'url se possibile 
  // (ovvero nel caso implementassi la navigazione tra una single page e l'altra con bottoni di next e prev) 
  const [photo, setPhoto] = useState(initialPhoto);
  // var hook responsabile dell'attivazione del loader
  const [loading, setLoading] = useState(true);
  // isLogged importato da useAuth necessario a determinare se un utente sia loggato meno
  // e di conseguenza se abilitare o meno la visione dei pulsanti di edit & delete
  const { isLogged } = useAuth();
  // var hook responsabile dello show dei pulsanti edit & delete
  const [updateMode, setUpdateMode] = useState(false);
  // var hook che raccoglie lo slug dell'elemento da eliminare
  const [deleteItem, setDeleteItem ] = useState(initialSlug);
  // importo le categories per il form
  const [categories, setCategories] = useState(null);


  // funzione per richiedere dal backend le categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(apiUrl + `/categories/`);
        setCategories(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    if(categories === null) {
      fetchCategories()
    }
  }, []);

  // funzione per regolare il set falsedell'update mode
  const backToPage = () => {
    setUpdateMode(false);
  };

  // useffect che attiva la funzione di richiesta info del singolo elemento
  useEffect(() => {
    // effettuo la chiamata per recuperare il singolo elemento
    const fetchSinglePhoto = async () => {
      try {
        // attivo il loader
        setLoading(true);
        const response = await axios.get(`${apiUrl}/photos/${initialSlug}`);
        // aggiorno photo coi dati della response ricevuti dalla call
        setPhoto(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        // disattivo il loader
        setLoading(false);
      }
    };

    if (!photo) {
      fetchSinglePhoto();
    } else {
      setLoading(false);
    }
    
  }, [initialSlug, photo ]); //si attiva al cambiamento del valore dello slug o di uno dei valori di photo

  
  // se loading è ancora su true dispongo un messaggio 
  if (loading) {
    return <div>Caricamento in corso...</div>;
  }
  // se la photo non è presente dispongo un messaggio
  if (!photo) {
    return <div>Photo non trovata o non più presente.</div>;
  }

  // funzione di delete 
  const deletePhoto = async () => {
    // effettuo la chiamata di delete al backend 
    await axios.delete(apiUrl + `/photos/` + deleteItem);
    // effettuo un redirect dell'utente alla pagina precedente (index photos)
    navigate("/photos");
  }

  return (
    <div className="container">
      <div className="bg-light d-flex justify-content-center rounded-3 overflow-hidden my-5">
        {updateMode ? (
          <FormComponent
            photo={photo}
            categoriesData={categories}
            setPhoto={setPhoto}
            setUpdateMode={setUpdateMode}
            backToPage={backToPage}
          />
        ) : (
          <DetailsComponent
            photo={photo}
            isLogged={isLogged}
            setUpdateMode={setUpdateMode}
            setDeleteMode={deletePhoto}
          />
        )}
      </div>
    </div>
  );
};

export default PhotoShow;
