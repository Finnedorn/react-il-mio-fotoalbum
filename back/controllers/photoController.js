// importo fs e path, i moduli nativi di express per la gestione file e percorsi
const fs = require("fs");
const path = require("path");
// importo ed inizializzo prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// importo slugify per generare uno slug unico
const slugify = require("slugify");
// importo la classe che estende Error da me generata per la formattazione degli errori
const RestErrorFormatter = require("../utils/restErrorFormatter");
// importo le var ambientali
require("dotenv").config();
const port = process.env.PORT || 3000;

// funzione di creazione di uno slug unique
const createUniqueSlug = async (title) => {
  let slug = slugify(title, { lower: true });
  let uniqueSlug = slug;
  let count = 1;

  // Verifica se lo slug esiste già nel database
  while (await prisma.photo.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${slug}-${count}`;
    count++;
  }

  return uniqueSlug;
};

// funzione per eliminare una immagine di una photo
const photoImgDeleter = (file) => {
  try {
    // elaboro il path del file dell'img che voglio eliminare
    // dirname e' la variabile globale di nodejs che contiene
    // il nome della directory in cui si trova lo script attualmente in esecuzione
    // e' utile per costruire percorsi relativi ai file 
    const filePath = path.join(__dirname, "../public/photoFolder/" + file);
    // elimino l'elemento traminte la funzione unlinkSync
    fs.unlinkSync(filePath);
  } catch (err) {
    console.log(`Errore nel processo di eliminazione dell'immagine ${file}.`);
  }
};

// funzione di creazione di un elemento in db
const store = async (req, res, next) => {
  // estraggo gli elementi dalla req tramite destructurizing
  const { title, description, visible, categories, userId } = req.body;
  try {
    // creo un pacchetto dati in cui mi assicuro di convertire i value nel formato giusto
    // questo perche' in caso di invio di un file multipartformdata, ogni valore che mi arriva sara' una string 
    const storeData = {
      title,
      // creo uno slug univoco dal title
      slug: await createUniqueSlug(title),
      description,
      // trasformo visible in un booleano
      visible: visible === "true" ? true : false,
      // trasformo il valore di id in numerico
      userId: parseInt(userId),
      // connect e' una dicitura di prisma usata per creare una relazione
      // mi assicuro che il valore di id sia di tipo numerico
      categories: {
        connect: categories.map((category) => ({ id: parseInt(category) })),
      },
    };

    // ricevendo un elemento multipart form-data dove immagine viene inserita in una sezione differente dal body
    // vado a ricercarmelo nel pacchetto req.file e genero il link da inviare al db per il recupero file
    if (req.file) {
      storeData.image = `http://localhost:${port}/photoFolder/${req.file.filename}`;
    }

    // creo l'elemento in db con prisma
    const photo = await prisma.photo.create({
      data: storeData,
    });
    // invio un feedback di avvenuta procedura + un json con i dati inviati al db
    res.send(`Photo caricata con successo: ${JSON.stringify(photo, null, 2)}`);

  } catch (error) {
    // se il processo non va a buon fine elimino l'immagine
    photoImgDeleter(req.file.filename);
    // storo in una const la nuova istanza di RestErrorFormatter contente lo status e il message da me personlizzato
    const errorFormatter = new RestErrorFormatter(
      404,
      `Errore nella creazione dela Photo: ${error}`
    );
    // passo il tutto che verrà intercettato dal middleware di gestione errori (allErrorFormatter)
    next(errorFormatter);
  }
};

// funzione di recupero di tutti i più elementi dal db, filtrati e paginati
const index = async (req, res, next) => {
  try {
    // creo una const dove storerò gli elementi
    //  con cui poi effettuerò la ricerca filtrata in prisma
    const where = {};
    // estrapolo dalla query ogni possobile parametro su cui filtrerò
    const { visible, title, page = 1, limit = 10 } = req.query;

    // se ho visible come valore di filtraggio...
    if (visible === "true") {
      where.visible = true;
    } else if (visible === "false") {
      where.visible = false;
    }
    // se ho title come valore di filtraggio...
    if (title) {
      where.title = { contains: title };
    }

    // gestisco la paginazione
    const offsetPage = (page - 1) * limit;
    const totalItems = await prisma.photo.count({ where });
    const totalPages = Math.ceil(totalItems / limit);

    // effettuo la ricerca delle photo in db
    const photos = await prisma.photo.findMany({
      // filtro secondo i valori specificati
      where,
      //   gestisco la paginazione
      take: limit,
      skip: offsetPage,
      include: {
        user: {
          select: {
            name: true,
          },
        },
        categories: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    res.json(photos, parseInt(page), totalPages, totalItems);
  } catch (error) {
    const errorFormatter = new RestErrorFormatter(
      404,
      `Errore nei parametri passati per la ricerca: ${error}`
    );
    next(errorFormatter);
  }
};

// funzione di recupero di un elemento singolo tramite slug
const show = async (req, res, next) => {
  try {
    // estraggo lo slug dai params
    const { slug } = req.params;
    // cerco tra gli elementi di photo in db...
    const photo = await prisma.photo.findUnique({
      // ...l'elemento con slug pari a quello estrapolato dalla request
      where: {
        slug,
      },
      // associo anche i valori di name dei db relazionati
      include: {
        user: {
          select: {
            name: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (slug) {
      res.json(photo);
    } else {
      // in caso di slug non trovato mando un errore
      res.status("401").send("errore");
    }
  } catch (error) {
    const errorFormatter = new RestErrorFormatter(
      404,
      `Errore nei parametri passati per la ricerca: ${error}`
    );
    next(errorFormatter);
  }
};

// funzione di update di un elemento selezionato tramite slug
const update = async (req, res, next) => {
  try {
    // estraggo dai params lo slug della photo selezionata per la modifica
    const { slug } = req.params;
    // estraggo dal body dellareq invece tutti i nuovi valori inviati dall'utente
    const { title, description, visible, categories } = req.body;

    // ricevendo un multipart form-data tutti gli elementi ricevuti sono string
    // quindi impacchetto tutto in una var con cui traslo
    // tutti gli elementi nel loro formato adatto alla validazione prima di inviarli al db
    const updateData = {
      title,
      // aggiorno pure lo slug col titolo nuovo
      slug: await createUniqueSlug(title),
      description,
      visible: visible === "true" ? true : false,
      categories: {
        set: categories.map((category) => ({ id: parseInt(category) })),
      },
    };


    // gestisco il file img in caso di modifica dell'immagine
    // se esistente, elimino la vecchia img e percorso relativo
    if (req.file) {
      photoImgDeleter(req.file);
      // e la sostituisco con il nuovo percorso
      updateData.image = `http://localhost:${port}/photoFolder/${req.file.filename}`;
    }

    // carico tutto in db effettuando un update dei valori
    const photo = await prisma.photo.update({
      where: {
        slug,
      },
      data: updateData,
    });

    res.send(
      `Photo aggiornata con successo: ${JSON.stringify(photo, null, 2)}`
    );
  } catch (error) {
    // se il processo non va a buon fine elimino l'immagine
    photoImgDeleter(req.file.filename);

    const errorFormatter = new RestErrorFormatter(
      404,
      `Errore nei parametri passati per l'operazione di update : ${error}`
    );
    next(errorFormatter);
  }
};

// funzione di delete di un elemento selezionato tramite slug
const destroy = async (req, res, next) => {
  try {
    // estraggo lo slug selezionato nella req per l'operazione
    const { slug } = req.params;
    // elimino in db l'elemento con slug pari a quello specificato
    const photo = await prisma.photo.delete({
      where: {
        slug,
      },
    });
    // elimino l'immagine relativa all'elemento ed il relativo percoros file
    if (photo.image) {
      photoImgDeleter(photo.image);
    }
    res.send("Photo eliminata con successo");
  } catch {
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
