const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// in questo file andrò a definire le regola di validazione
//  del mio checkSchema che invierò al mio modulo validator
// per la procedura di controllo errori e validazione 

// controllo che lo slug passato per la ricerca dell'elemento in db non sia errato
// o non corrispondente ad alcuno slug già presente in db
const slugChecker = {
  slug: {
    in: ["params"],
    isString: {
      error: "Lo Slug deve essere una stringa",
      bail: true,
    },
    custom: {
      options: async (slug) => {
        const slugToFind = await prisma.photo.findFirst({
          where: {
            slug: slug,
          },
        });
        if (!slugToFind) {
          throw new Error("slug errato o non corrispondente");
        }
        return true;
      },
    },
  },
};

// controllo che i parametri inviati per la creazione di un nuovo elemento in db siano corretti
// per gli elementi in relazione, effettuo un controllo per capire se i parametri corrispondono
// ad elementi effettivamente presenti in db
const bodyChecker = {
  title: {
    in: ["body"],
    notEmpty: {
      error: "Title è un campo obbligatorio",
      bail: true,
    },
    isString: {
      error: "Title deve essere una stringa",
      bail: true,
    },
  },
  description: {
    in: ["body"],
    notEmpty: {
      error: "Description è un campo obbligatorio",
      bail: true,
    },
    isString: {
      error: "Description deve essere una stringa",
      bail: true,
    },
  },
  visible: {
    in: ["body"],
    isBoolean: {
      error: "Published deve essere un booleano",
    },
  },
  categories: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Categories è un campo obbligatorio.",
      bail: true,
    },
    isArray: {
      error: "Categories deve essere un array",
    },
    custom: {
      options: async (array) => {
        console.log(array)
        if (array.length === 0) {
          throw new Error("le Categories devono contenere almeno un elemento");
        }
        const notIntegerId = array.find((el) => isNaN(parseInt(el)));
        if (notIntegerId) {
          throw new Error(
            "Uno o più ID tra le Categories non sono costituiti da numeri interi"
          );
        }
        const categoriesToFind = await prisma.category.findMany({
          where: {
            id: {
              in:array.map(el => parseInt(el))
            }
          },
        });
        if (categoriesToFind.length !== array.length) {
          throw new Error(
            "Uno o più elementi fra tra le Categories inseriti non è corretto o non esiste"
          );
        }
        return true;
      },
    },
  },
};

module.exports = {
  slugChecker,
  bodyChecker,
};