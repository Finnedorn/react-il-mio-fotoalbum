// importo ed inizializzo prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// importo i moduli relativi alle password ed ai token
const { passwordHusher } = require("../utils/pswAndToken");

// seeder che popolerà il db con elementi presi da un array
const userSeeder = async () => {
  try {
    const users = [
      {
        name: "User01",
        email: "user01@example.it",
        password: "User123",
      }
    ];
    // itero sull'array con ciclo for
    for (let user of users) {
      // per ogni elemento effettuo una create
      const createdUser = await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: await passwordHusher(user.password),
        },
      });
      console.log(`User "${user.name}" registrato con successo.`);
    }
    console.log("Registrazione utenti completata.");
  } catch (error) {
    console.error("Errore durante la registrazione :", error);
  } finally {
    await prisma.$disconnect();
  }
};


userSeeder();

// quindi passo sul package json per settare il comando di attivazione...