// importo ed inizializzo prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// importo la classe che estende Error da me generata per la formattazione degli errori
const RestErrorFormatter = require("../utils/restErrorFormatter");
// importo i moduli relativi alle password ed ai token 
const {
    tokenGenerator, 
    passwordHusher,
    passwordComparer
} = require("../utils/pswAndToken");


// funzione di registrazione utente
const register = async (req, res, next) => {
    // estraggo i valori dalla request tramite destructuring
    const {email, name , password} = req.body;
    try{
        // creo l'elemento in db usando la funzione create di prisma
        const user = await prisma.user.create({
            data: {
                email,
                name, 
                // essendo la funzione che regola la creazione dell'elemento asyncrona
                // pure tutte le funzioni che si attuano all'interno di essa devono esserlo
                // altrimenti queste partiranno prima di essa stessa
                password: await passwordHusher(password)
            }
        });

        // creo un pacchetto da inviare 
        // alla funzione di generazione del token 
        const data = {
            id: user.id,
            email: user.email,
            name: user.name
        }
        const token = tokenGenerator(data);

        // ritorno un json con un mes di feedback, il token generato ed i dati inviati
        res.json({
            message: "Registrazione Avvenuta con successo",
            token: token,
            data
        });

    }catch(error){
        // in caso di errore, apro una nuova istanza di RestErrorFormatter in cui inseriro codice e mes
        const errorFormatter = new RestErrorFormatter(
            404,
            `Errore nel processo di registrazione: ${error}`
        );
        // tramite next(nome della const da inviare) invio tutto ai mid successivi 
        // in linea di ordine capaci di accogliere l'errore ovvero il mid allErrorFormatter
        next(errorFormatter); 
    }
};


// funzione di login dell'utente
const login = async (req, res, next) => {
    const {email, password} = req.body;
    try {
        const user = await prisma.user.findFirst({
            where: {
                email
            }
        });
        // in caso di mail non corrispondente a quelle gia' presenti in db
        if(!user){
            const errorFormatter = new RestErrorFormatter(
                400,
                'Email o Password errati'
            );
            next(errorFormatter);
        }
        // faccio un confronto tra la psw della req e quella dell'utente registrato in db
        const isValid = await passwordComparer(password, user.password);
        // in caso non corrisponda, mando un messaggio di errore 
        if(!isValid){
            const errorFormatter = new RestErrorFormatter(
                400,
                'Email o Password errati'
            );
            next(errorFormatter);
        } 
        // se entrambi i controlli (email e psw) vanno a buon fine creo un pacchetto coi dati utente presi dal db
        const data = {
            id: user.id,
            email: user.email,
            name: user.name
        }
        // genero il token 
        const token = tokenGenerator(data);
        // riporto un feedback positivo, aggiungo il token ed i dati dell'utente
        res.json({
            message: "Login Avvenuto con successo",
            token,
            data
        });

    }catch(error){
        const errorFormatter = new RestErrorFormatter(
            404,
            `Errore nel processo di login: ${error}`
        );
        next(errorFormatter); 
    }
};


module.exports= {
    register,
    login,
}