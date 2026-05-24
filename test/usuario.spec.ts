import { describe, test, beforeEach, expect } from "vitest";
import request from "supertest";

import { app } from "../src/app.js";
import { Usuario } from "../src/models/usuario.js";
import { Series } from "../src/models/serie.js";

const buildUserPayload = (tag: string) => ({
  nombre: `Usuario ${tag}`,
  nombre_usr: `ut_usuario_${tag}`,
  correo: `ut_usuario_${tag}@example.com`,
  generos: ["drama"],
});

const buildSeriePayload = (userId: string) => ({
  nombre: "Los Soprano",
  sinopsis: "Una familia mafiosa en Nueva Jersey.",
  año_estreno: 1999,
  n_temporadas: 6,
  duracion_media_capitulo: 55,
  n_episodios_temporada: [["temporada 1", 13]],
  reparto: [["James Gandolfini", "Tony Soprano"]],
  direccion: [["David Chase", "Creador"]],
  generos: ["drama"],
  usuarios: [userId],
});

beforeEach(async () => {
  await Series.deleteMany({ nombre: /^UT_SERIE_USUARIO_SPEC_/ });
  await Usuario.deleteMany({ nombre_usr: /^ut_usuario_/ });
});

describe("POST /usuario", () => {
  test("Should successfully create a new user", async () => {
    const payload = buildUserPayload("post_ok");

    await request(app)
      .post("/usuario")
      .send(payload)
      .expect(201);
  });

  test("Should fail when payload is invalid", async () => {
    await request(app)
      .post("/usuario")
      .send({
        nombre: "Al",
        nombre_usr: "ab",
        correo: "not-an-email",
        generos: ["drama"],
      })
      .expect(500);
  });
});

describe("GET /usuario", () => {
  test("Should return 404 when filtered user does not exist", async () => {
    await request(app).get("/usuario?nombre_usr=ut_usuario_no_existe").expect(404);
  });

  test("Should return users filtered by nombre_usr", async () => {
    const userA = await new Usuario(buildUserPayload("get_a")).save();
    await new Usuario(buildUserPayload("get_b")).save();

    const response = await request(app)
      .get(`/usuario?nombre_usr=${userA.nombre_usr}`)
      .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].nombre_usr).toBe(userA.nombre_usr);
  });
});

describe("PATCH /usuario", () => {
  test("Should return 400 when nombre_usr query is missing", async () => {
    await request(app).patch("/usuario").send({ nombre: "Nuevo" }).expect(400);
  });

  test("Should return 400 when update field is not allowed", async () => {
    const user = await new Usuario(buildUserPayload("patch_invalid")).save();

    await request(app)
      .patch(`/usuario?nombre_usr=${user.nombre_usr}`)
      .send({ campo_no_permitido: "valor" })
      .expect(400);
  });

  test("Should return 404 when user is not found", async () => {
    await request(app)
      .patch("/usuario?nombre_usr=no_existe")
      .send({ nombre: "Nuevo Nombre" })
      .expect(404);
  });

  test("Should update user when request is valid", async () => {
    const user = await new Usuario(buildUserPayload("patch_ok")).save();

    const response = await request(app)
      .patch(`/usuario?nombre_usr=${user.nombre_usr}`)
      .send({ nombre: "Nombre Actualizado" })
      .expect(200);

    expect(response.body.nombre).toBe("Nombre Actualizado");
  });
});

describe("DELETE /usuario", () => {
  test("Should return 400 when nombre_usr query is missing", async () => {
    await request(app).delete("/usuario").expect(400);
  });

  test("Should return 404 when user is not found", async () => {
    await request(app).delete("/usuario?nombre_usr=no_existe").expect(404);
  });

  test("Should delete user when linked series exists", async () => {
    const user = await new Usuario(buildUserPayload("delete_ok")).save();
    await request(app)
      .post("/series")
      .send({
        ...buildSeriePayload(user._id.toString()),
        nombre: "UT_SERIE_USUARIO_SPEC_DELETE",
      })
      .expect(201);

    const response = await request(app)
      .delete(`/usuario?nombre_usr=${user.nombre_usr}`)
      .expect(200);

    const deleted = await Usuario.findOne({ nombre_usr: user.nombre_usr });
    expect(response.body.nombre_usr).toBe(user.nombre_usr);
    expect(deleted).toBeNull();
  });
});

