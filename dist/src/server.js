"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const prisma_1 = require("./app/config/prisma");
const app_1 = __importDefault(require("./app"));
const seed_admin_1 = require("./app/utils/seed-admin");
const port = process.env.PORT;
let server;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_1.prisma.$connect();
        console.log("*** database connected successfully ***");
        server = app_1.default.listen(port, () => {
            console.log(`*** server is running on port: ${port} ***`);
        });
    }
    catch (error) {
        console.log("*** error on connecting database...");
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield startServer();
    yield (0, seed_admin_1.seedAdmin)();
    //    seed mock data
}))();
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
