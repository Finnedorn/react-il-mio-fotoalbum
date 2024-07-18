// importo jsonwebtoken con cui gestirò tutti i processi 
// legati al login/registrazione utente ed autenticazione
const jwt = require("jsonwebtoken");
// importo dotenv per utilizzar ele var ambientali
require("dotenv").config();
// importo bcrypt, una libreria che sfrutterò per fare l'hashing/cryptaggio
// delle password utente prima di inviarle al db
const bcrypt = require("bcrypt");


// funzione che genera un token della durata di tot tempo che l'utente sfrutterà per loggare in pagina
const tokenGenerator = (payload, expiresIn = '2h') => {
    // la funzione sign, nativa di jsonwebtoken (jwt), crea un token personalizzato 
    // la funzione accetta 3 parametri: 
    // (payload o contenuto della chiamata, 
    // la secret key storata nella var ambientale,
    //  tempo di durata del token esprimibile in s/m/h/y)  
    const newToken = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn});
    return newToken;
}

// funzione che si occupa del cryptaggio della password
const passwordHusher = async(password) => {
    // la funzione hash, nativa di jwt, accetta 2 parametri:
    // (l'elemento da cryptare in questo caso la psw utente,
    // e il salt ovvero il livello di cryptaggio che vogliamo dare)
    const hushed = await bcrypt.hash(password, 10);
    return hushed;
}

// funzione che confronta la psw inviata per il login quella già storata in db 
const passwordComparer = async(password, passwordHushed) => {
    // la funzione compare, nativa di bcrypt, accetta 2 parametri
    // il primo non cryptato, il secondo si, e li mette a confronto
    // returna true o false
    const isValid = bcrypt.compare(password, passwordHushed);
    return isValid;
}

module.exports= {
    tokenGenerator,
    passwordHusher,
    passwordComparer
}