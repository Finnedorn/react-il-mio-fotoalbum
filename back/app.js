const express = require("express");
const app = express();
// importo dotenv per leggere le variabili ambientali
require("dotenv").config();
const port = process.env.PORT || 3000;
// importo cors per bypassare le cors policies
const cors = require("cors");
// importo i router per settare le routes del server
const photoRouter = require("./router/photoRouter");
const authRouter = require("./router/authRouter");
const categoryRouter = require("./router/categoryRouter");
// importo i mid di gestione errori
const notFoundFormatter = require("./middlewares/404errorFormatter");
const allErrorFormatter = require("./middlewares/allErrorFormatter");
// abilito le chiamate provenienti da altri indirizzi
app.use(cors({}));
// abilito il mid per l'utilizzo della cartella public
app.use(express.static("public"));
// abilito il mid per la lettura dei file json
app.use(express.json());


// abilito le routes del server


// attivo i mid seeder per popolare il db

app.use("/auth", authRouter);

app.use("/photos", photoRouter);

app.use("/categories", categoryRouter);




// abilito il mid di errore 404 
app.use(notFoundFormatter);

// abilito il mid per il catching degli errori
app.use(allErrorFormatter);


// tramite la funzione listen avvio il server che rimarrà in ascolto di eventiali richieste
app.listen(port, () => {
  console.log(`Sto runnando il server sulla porta: ${port}`);
});
