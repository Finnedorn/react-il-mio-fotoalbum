import { createContext, useContext, useEffect, useState } from "react";
// importo useNavigate, un hook di react-router che mi permette di effettuare i redirects 
import { json, useNavigate } from "react-router-dom";
// importo l'hook di localStorage
import useLocalStorage from "../assets/hooks/useLocalStorage";

const apiUrl = import.meta.env.VITE_BASE_API_URL;
import axios from "axios";

// apro il context
const AuthContext = createContext();

// setto il provider
const AuthProvider = ({children}) => {

    // storo usenavigate in una costante per poterla utilizzare
    // una volta che esporterò logIn all'interno della pagina di login 
    const navigate = useNavigate();

    // setto lo state di login, di base su null e user come key per il localStorage
    // mi servirà ad aprire la sessione di accesso effettuato dell'utente alla pagina 
    const [user, setUser] = useLocalStorage(null, 'user');


    // setto una var per hostare i dettagli di user una volta effettuata la chiamata
    let userInfo = {
        name: "",
        email: "",
        id: ""
    };
    // setto uno state per raccogliere i dati
    const [userData, setUserData] = useState(userInfo);

    useEffect(() => {

        if(user !== null){
            userInfo = {
                name: user.name,
                email: user.email,
                id: user.id
            }
            setUserData(userInfo);
        }

    }, [user]);

    // isLogged è la const che regola il middleware di login che redireziona 
    // l'utente che cerca di accedere alle pagine private
    // alla schermata di login
    // in questo caso mi basta settare che fin tanto che il valore di user rimane null
    // l'utente non ha effettuato il login quindi islogged rimane false attivando così il middleware
    const isLogged = user !== null ? true : false;

    // funzione di registrazione utente
    const register = async(payload) => {
        console.log(payload);
        try{
            // effettuo la chiamata post inviando i dati dell'utente dal form al backend 
            const { data: response } = await axios.post(apiUrl + '/auth/register', payload, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            // aggiorno la variabile user con il valore di response
            setUser(response.data);
            // se la procedura va a buon fine salvo i dati del token in localStorage
            localStorage.setItem('accessToken', response.token);
            // redireziono alla dashboard
            navigate("/");
        }catch(err){

            const { errors } = err.response.data;
            const error = new Error(errors ? 'Errore durante la registrazione' : err.response.data);
            error.errors = errors;
            throw error;
        }
    }

    // funzione di login
    const logIn = async(payload) => {
        try{
            console.log("axios");
            // invio i dati del form di login al backend per la verifica 
            // nell'api sono nella sezione data 
            const { data: response }  = await axios.post(apiUrl + '/auth/login', payload);
            console.log(response);
            // aggiorno la variabile user con il valore di response
            setUser(response.data);
            localStorage.setItem('accessToken', response.token);
            // redireziono in dashboard
            navigate("/");
        }catch(err){

            const { errors } = err.response.data;
            const error = new Error(errors ? 'Errore di Login' : err.response.data);
            error.errors = errors;
            throw error;
        }
    }

    // premendo il tasto logout, setUser passa a null 
    // e di conseguenza pure isLogged passa a false, attivando così il middleware
    // quindi si viene rispediti fuori dalle pagine private e alla pagina di login
    const logOut = () => {
        setUser(null);
        setUserData(userInfo);
        navigate("/login");
    }

    // impacchetto tutto ciò che mi serve esportare 
    const logValue = {
        isLogged,
        register,
        logIn,
        logOut,
        userData
    }

    return(
    <>
        <AuthContext.Provider value={logValue}>
            {children}
        </AuthContext.Provider>
    </>
    )
}

// setto la mia funzione di hook 
const useAuth = () => {
    const value = useContext(AuthContext);
    if(value === undefined){
        throw new Error('Non sei dentro al Auth Provider');
    }
    return value;
}


export {AuthProvider, useAuth};