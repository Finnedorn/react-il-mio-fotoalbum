// importo ed inizializzo prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// seeder che popolerà il db con elementi presi da un array
// lo sfrutto come un middleware e lo faccio partire all'avvio del server 1 volta
const categorySeeder = async () => {
  try {
    const categories = [
      "Paesaggi",
      "Ritratti",
      "Architettura",
      "Street",
      "Eventi",
      "Matrimonio",
      "Natura",
      "Macro",
      "Astratta",
      "Viaggio",
      "Moda",
      "Sport",
      "Documentario",
      "Cucina",
      "Arte",
      "Volare",
      "Mare e Laghi",
      "Notturna",
      "Astrofotografia",
      "Fauna selvatica",
      "Strada",
      "Animali",
      "Paesaggi urbani",
      "Concerti",
      "Moda",
      "Architettura urbana",
      "Monumenti storici",
    ];
    // itero sull'array con ciclo for
    for (let category of categories) {
      // per ogni elemento effettuo una create
      const createdCategory = await prisma.category.create({
        data: {
          name: category,
        },
      });
      console.log(`Categoria "${category}" creata con successo.`);
    }

    console.log("Creazione delle categorie completata.");
  } catch (error) {
    console.error("Errore durante la creazione delle categorie:", error);
  } finally {
    await prisma.$disconnect();
  }
};


categorySeeder();


// quindi passo sul package json per settare il comando di attivazione...

