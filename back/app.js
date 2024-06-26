const express = require("express");
const app = express(); 
require("dotenv").config();
const port = process.env.PORT || 3000;
const cors = require("cors");

// abilito le chiamate provenienti da altri indirizzi
app.use(cors({}));

// abilito il mid per l'utilizzo della cartella public
app.use(express.static("public"));
// abilito il mid per la lettura dei file json
app.use(express.json());

// effettuo un redirect alla index di /post 
app.get('/',(req,res) =>{
    res.send('ciao');
});

app.listen(port, () => {
    console.log(`Sto runnando il server sulla porta: ${port}`);
  });