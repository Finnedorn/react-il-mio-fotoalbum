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
    // estraggo i valori dallla request
    const {email, name , password} = req.body;
    try{
        // creo l'elemento in db
        const user = await prisma.user.create({
            data: {
                email,
                name, 
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

        res.json({
            message: "Registrazione Avvenuta con successo",
            token: token,
            data
        });

    }catch(error){
        const errorFormatter = new RestErrorFormatter(
            404,
            `Errore nel processo di registrazione: ${error}`
        );
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

        if(!user){
            const errorFormatter = new RestErrorFormatter(
                400,
                'Email o Password errati'
            );
            next(errorFormatter);
        }

        const isValid = await passwordComparer(password, user.password);

        if(!isValid){
            const errorFormatter = new RestErrorFormatter(
                400,
                'Email o Password errati'
            );
            next(errorFormatter);
        } 

        const data = {
            id: user.id,
            email: user.email,
            name: user.name
        }

        const token = tokenGenerator(data);

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