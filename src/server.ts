import "dotenv/config";

import { Server } from "http";
import { prisma } from "./app/config/prisma";
import app from "./app";

const port = process.env.PORT;

let server: Server;

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("*** database connected successfully ***");

    server = app.listen(port, () => {
      console.log(`*** server is running on port: ${port} ***`);
    });
  } catch (error) {
    console.log("*** error on connecting database...");
  }
};

(async () => {
  await startServer();
  //    seed mock data
})();

process.on("unhandledRejection", (err) => {
  console.log("server is closing... ");
  console.log(err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.log("server is closing... ");
  console.log(err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("SIGTERM", (err) => {
  console.log("server is closing... ");
  console.log(err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});
