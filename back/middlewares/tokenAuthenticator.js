const jwt = require("jsonwebtoken");
require("dotenv").config();
const RestErrorFormatter = require("../utils/restErrorFormatter");

const tokenAuthenticator = (req, res, next) => {
    // prendo i valori inviati dall'utente nell'header della request
    // in postman -> headers -> authorization: 'Bearer ' + token
    const authToken = req.headers.authorization;
    if(!authToken) {
        const errorFormatter = new RestErrorFormatter(
            404,
            "Necessiti di un token per accedere alla seguente route"
        );
        next(errorFormatter); 
    }
    // splitto il token per togliere il suffisso Bearer
    // e mi storo in tokenSplitted solo il valore del token
    const tokenSplitted = authToken.split(" ")[1];

    // verifico il token con il metodo verify
    // accetta 2 parametri: il token, la key che ho storata nell'env
    // inoltre mi restituisce un callback con 2 parametri: err e user 
    jwt.verify(tokenSplitted, process.env.JWT_SECRET, (err, user) => {
        if(err) {
            let errorMessage = "Accesso negato:"
            switch(err.message){
                case "jwt expired":
                    errorMessage += "Token scaduto";
                break;
                case "jwt malformed":
                    errorMessage += "Token non corretto";
                break;
                default:
                    errorMessage += "Token non valido";
                break;
            }
            const errorFormatter = new RestErrorFormatter(
                404,
                errorMessage
            );
            next(errorFormatter); 
        }
        // se il token è valido l'utente non incapperà nel catch

        req.user = user;
        next();
    });
}

module.exports=tokenAuthenticator;
