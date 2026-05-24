import { describe, test, beforeEach } from "vitest";
import request from "supertest";

import { app } from "../src/app.js"
import { Usuario } from "../src/models/usuario.js";

beforeEach(async () => {
  await Usuario.deleteMany();
});

describe("POST /usuario", () => {
  test("Should successfully create a new user", async () => {
    await request(app)
      .post("/usuario")
      .send({
        nombre: "Eduardo Segredo",
        nombre_usr: "esegredo",
        correo: "esegredo@example.com",
        generos: ["drama"],
      })
      .expect(201);
  });
});

