// importo ed inizializzo prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// importo i moduli relativi alle password ed ai token
const { passwordHusher, tokenGenerator } = require("../utils/pswAndToken");

// seeder che popolerà il db con elementi presi da un array
const userSeeder = async () => {
  try {
    const users = [
      {
        name: "Daniele",
        email: "daniele@example.com",
        password: "Daniele123",
      },
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

      const data = {
        id: user.id,
        email: user.email,
        name: user.name,
      };
      const token = tokenGenerator(data);

      console.log({
        message: "Registrazione Avvenuta con successo",
        token: token,
        data,
      });
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
