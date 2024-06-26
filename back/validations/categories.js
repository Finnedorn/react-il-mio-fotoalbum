const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// controllo che l'ID fornito sia un numero
const idChecker = {
    id: {
        in: ["params"],
        isInt: {
            error: "l'ID deve essere un numero intero"
        },
        custom: {
            options: async(id) => {
                const idToCheck = parseInt(id);
                if(isNaN(idToCheck)) {
                    throw new Error('l\'\ ID deve essere un numero');
                }
                return true;
            }
        }
    }
}

// controllo se il parametro "name" sia corretto e che non sia già esistente in db
const nameChecker = {
    name: {
      in: ["body"],
      notEmpty: {
        errorMessage: "Name è un campo obbligatorio.",
        bail: true,
      },
      isString: {
        error: "Name deve essere una stringa",
        bail: true,
      },
      custom: {
        options: async (value) => {
          const nameToFind = await prisma.category.findFirst({
            where: {
              name: value,
            },
          });
          if (nameToFind) {
            throw new Error("Esiste già una Category con quel nome");
          }
          return true;
        },
      },
    },
};


module.exports = {
    idChecker,
    nameChecker
}