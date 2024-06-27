const express = require("express");
// importo il modulo per la gestione delle routes
const router = express.Router();
// importo il modulo per i percorso file
const path = require("path");
// importo il controller con le funzioni di CRUD
const photoController = require("../controllers/photoController");
// importo il mid di token autenticazione
const tokenAuthenticator = require("../middlewares/tokenAuthenticator");
// importo i mid di validazione
const validator = require("../middlewares/validator");
const { slugChecker, bodyChecker } = require("../validations/photos");
// importo il mid per la gestione dei multipart form data
const multer = require("multer");
// setto multer affinchè ciò che viene inviato venga storato in public
const storage = multer.diskStorage({
  // stipo tutto nella cartella photoFolder in public
  destination: "public/photoFolder",
  //genero nome di file unico per ogni elemento uploadato...
  filename: (req, file, cf) => {
    // ...usando l'estensione del file (.jpg,.png, etc..) + la data in millisec
    const fileType = path.extname(file.originalname);
    cf(null, String(Date.now()) + fileType);
  },
});
// setto multer affinchè utilizzi lo storage
const upload = multer({ storage });




// setto le rotte di /photos



// route agli elementi
router.get("/", photoController.index);

// route al singolo elemento
router.get("/:slug", validator(slugChecker), photoController.show);



// piazzo il mid di autenticazione in questo modo
// così da proteggere tutte le rotte da questa in poi 
router.use(tokenAuthenticator);


// route di caricamento photo
router.post(
  "/",
  // mid di gestione upload immagini
  upload.single("image"),
  // mid di validazione
  validator(bodyChecker),
  photoController.store
);

// route update di un elemento
router.put(
  "/:slug",
  upload.single("image"),
  validator(slugChecker),
  validator(bodyChecker),
  photoController.update
);

// route di delete di un elemento
router.delete("/:slug", validator(slugChecker), photoController.destroy);

module.exports = router;
