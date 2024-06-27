import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
const apiUrl = import.meta.env.VITE_BASE_API_URL;

// la funzione createContext genera un contesto all'interno di react
// ovvero un modo per condivivere valori tra più componenti (come lo store in vue)
// quindi genero un Context che contiene due oggetti: un provider(componente che farà da store) 
// ed un consumer(componente che accederà ai valori del primo) 
const PhotoContext = createContext();


// genero il provider che effettuerà la chiamata axios ed accoglierà i valori di Post dal db
// esso ha un prop ovvero tutte le rotte in cui sono presenti le componenti 
// con cui voglio condividere i dati dal provider stesso
const PhotoProvider = ({ children }) => {

  // creo una variabile con useState che accolga i dati della chiamata axios
  const [photos, getPhotos] = useState(null);

  // effettuo la chiamata axios
  const fetchPhotos = async () => {
    try {
      const response = await axios.get(apiUrl + "/photos");
      getPhotos(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // effettuo la chiamata axios una sola volta al mounting della pagina
  useEffect(() => {
    fetchPhotos();
  }, []);

  return (
  <>
    {/* do al value del provider il contenuto di posts */}
    <PostContext.Provider value={{photos}}>
        {children}
    </PostContext.Provider>
  </>
  );
};

// creo la mia funzione di hook personalizzata in cui esporto il valore del context corrente
const usePhotos = () => {
  // prendo il valore di posts dal context con useContext 
  const value = useContext(PhotoContext);
  //se non sono in un consumer del GlobalContext.Provider, value sarà undefined
  // perciò creo una condizione che generi un errore per segnalarmelo
  if(value === undefined){
      throw new Error('Non sei dentro al Photo Provider');
  }
  return value;
}

// esporto il provider e lo vado a definire in App 
// ed esporto la funzione di hook che userò nelle pages 
export { PhotoProvider, usePhotos };
