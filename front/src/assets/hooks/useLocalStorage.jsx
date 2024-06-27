import { useState, useEffect } from "react";

// creo un hook personalizzato che al login prenda due parametri:
// key e value e li piazzi in localStorage o aggiorni il valore in caso di key gia esistente
const useLocalStorage = (initialValue, itemKey) => {
  // recupero dal local storage il valore della key dell'oggetto
  // getItem è la funzione con la quale recupero un elemento dal localStorage del browser
  const storedValue = localStorage.getItem(itemKey);

  const [state, setState] = useState(() => {
    // in caso non vi fosse alcuna key associabile ad itemkey, il valore sarà null
    // perciò se tale condizione si verificasse
    if (storedValue === null) {
      // storo in localStorage un obj con key = itemkey e value = valore di initialValue
      // setItem(key,value) è la funzione col quale posso inserire in localStorage un elemento
      // uso Json.stringify in quanto i è l'unico formato accettato per l'inserimento di un valore in localStorage
      localStorage.setItem(itemKey, JSON.stringify(initialValue));
      return initialValue;
    }
    // se storedValue è undefined rimane undefined, altrimenti lo aggiorno col valore di storedValue
    return storedValue === "undefined" ? undefined : JSON.parse(storedValue);
  });

  // al cambiamento di state e/o itemkey
  // aggiorno il valore in localStorage
  useEffect(() => {
    localStorage.setItem(itemKey, JSON.stringify(state));
  }, [state, itemKey]);

  // setto una funzione per
  const changeState = (payload) => {
    // se payload è una funzione do a state il suo valore
    // e aggiorno il suo valore in localStorage
    if (typeof payload === "function") {
      setState((prevState) => {
        const newState = payload(prevState);
        localStorage.setItem(itemKey, JSON.stringify(newState));
        return newState;
      });
    } else {
      // se payload non è una funzione creo un nuovo stato
      // e storo il nuovo valore in localStorage
      setState(payload);
      localStorage.setItem(itemKey, JSON.stringify(payload));
    }
  };

  // ritorno un array con state ed il risultato della funzione
  return [state, changeState];
};



export default useLocalStorage;
