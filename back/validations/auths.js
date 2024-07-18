// modulo in cui settero le funzioni di checkschema da dare al validator

// import prisma per poter effettuare le operazioni di controllo sugli elementi 
// confrontandogli con gli elementi gia presenti in db
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// checkSchema per la registrazione 
const registerChecker = {
    email: {
        // specifico dove trovare il valore
        in:["body"],
        notEmpty: {
            errorMessage: "Email è un campo obbligatorio.",
            // bail e un opzione che se fallisce (false) mi impedisce di proseguire con le validazioni
            bail: true,
        },
        isEmail: {
            errorMessage: "Email deve essere una mail.",
            bail: true,
        },
        // ricerco tra le mail già presenti in db se vi è già una mail identica
        custom: {
            options: async (mail) => {
                // uso la funione findFirst di prisma per ricercare il primo elemento in db che matcha con le caratteristiche da me inserite 
                const mailToFind = await prisma.user.findFirst({
                  where: {
                    email: mail,
                  },
                });
                // se mailtoFind mi da true significa che ho gia un amail del genere in db pertanto...
                if (mailToFind) {
                  throw new Error("Questa Email è già stata registrata!");
                }
                return true;
            },
        }
    },
    name: {
        in:["body"],
        isString: {
            errorMessage: "Name deve essere una stringa",
            bail: true,
        },
    },
    // ho solo questi controlli sulla password in quanto 
    // lascerò tutto il lavoro al sistema hashing psw di jsonwebtoken
    password: {
        in: ["body"],
        notEmpty: {
            errorMessage: 'Password è un campo obbligatorio.',
            bail: true
        },
        isString: {
            errorMessage: 'Password deve essere una stringa.',
            bail: true
        },
        isLength: {
            errorMessage: 'Password deve essere di almeno 8 caratteri',
            options: {min: 8}
        }
    }
};

// checkSchema per la registrazione
// avendo l'utente gia fatto la pratica di registrazione, controllero solo mail e psw
const loginChecker = {
    email: {
        in:["body"],
        notEmpty: {
            errorMessage: "Email è un campo obbligatorio.",
            bail: true,
        },
        isEmail: {
            errorMessage: "Email deve essere una mail.",
            bail: true,
        },
    },
    password: {
        in: ["body"],
        notEmpty: {
            errorMessage: 'Password è un campo obbligatorio.',
            bail: true
        },
        isString: {
            errorMessage: 'Password deve essere una stringa.',
        }
    }
};

module.exports= {
    registerChecker,
    loginChecker
}