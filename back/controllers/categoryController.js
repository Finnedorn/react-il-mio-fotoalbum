// importo ed inizializzo prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// importo RestErrorFormatter
const RestErrorFormatter = require("../utils/restErrorFormatter");

// funzione di creazione di un elemento in db
const store = async (req, res, next) => {
  // estropo i valori dal req.body
  const { name } = req.body;
  try {
    // li uso per creare l'elemento in db
    const category = await prisma.category.create({
      data: {
        name,
      },
    });
    res.send(
      `category creato con successo: ${JSON.stringify(category, null, 2)}`
    );
  } catch (error) {
    const errorFormatter = new RestErrorFormatter(
      404,
      `Errore nella creazione del category: ${error}`
    );
    next(errorFormatter);
  }
};

// funzione di recupero di tutti i più elementi dal db
const index = async (req, res) => {
  try {
    // richiamo tutti gli elementi dal db
    const categorys = await prisma.category.findMany();
    res.json(categorys);
  } catch (err) {
    const errorFormatter = new RestErrorFormatter(
      404,
      `Errore nella richiesta di visualizzazione: ${err}`
    );
    next(errorFormatter);
  }
};

// funzione di recupero di un elemento selezionato tramite id
const show = async (req, res) => {
  try {
    // estrapolo l'id dalla request
    const { id } = req.params;
    // filtro dal db l'elemento secondo quell'id
    const category = await prisma.category.findUnique({
      where: {
        // trasformo l'id da string a number affichè il db lo legga
        id: parseInt(id),
      },
      // seleziono pure tutti gli elementi ad esso relazionati
      include: {
        photos: {
          select: {
            title: true,
          },
        },
      },
    });
    if (category) {
      res.json(category);
    } else {
      res.status(401).send("category non trovato");
    }
  } catch (err) {
    const errorFormatter = new RestErrorFormatter(
      404,
      `Errore nei parametri passati per la ricerca: ${err}`
    );
    next(errorFormatter);
  }
};

// funzione di update di un elemento selezionato tramite id
const update = async (req, res) => {
  try {
    // estrapolo l'id dalla request
    const { id } = req.params;
    // estrapolo il nuovo valore da sostituire al vecchio con l'update
    const { name } = req.body;
    // effettuo l'update dell'elemento con id pari a quello specificato nella request
    const category = await prisma.category.update({
  
      where: {
        id: parseInt(id),
      },
      data: {
        name,
      },
    });

    res.send(
      `category aggiornato con successo: ${JSON.stringify(category, null, 2)}`
    );

  } catch (err) {
    const errorFormatter = new RestErrorFormatter(
      404,
      `Errore nei parametri passati per l'operazione di update : ${error}`
    );
    next(errorFormatter);
  }
};

// funzione di delete di un elemento selezionato tramite id
const destroy = async (req, res) => {
  try {
    // estrapolo l'id dalla request
    const { id } = req.params;
    // effettuo il delete dell'elemento con id pari a quello specificato nella request
    await prisma.category.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.json("category eliminato con successo");
  } catch (err) {
    const errorFormatter = new RestErrorFormatter(
      404,
      `Errore nei parametri passati l'operazione di delete : ${error}`
    );
    next(errorFormatter);
  }
};

module.exports = {
  store,
  index,
  show,
  update,
  destroy,
};
