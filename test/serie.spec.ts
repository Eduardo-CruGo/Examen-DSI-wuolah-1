import { describe, test, beforeEach, expect } from "vitest";
import request from "supertest";

import { app } from "../src/app.js";
import { Usuario } from "../src/models/usuario.js";
import { Series } from "../src/models/serie.js";

const buildUserPayload = (tag: string) => ({
  nombre: `Usuario ${tag}`,
	nombre_usr: `ut_serie_usuario_${tag}`,
	correo: `ut_serie_usuario_${tag}@example.com`,
  generos: ["drama"],
});

const buildSeriePayload = (userId: string) => ({
	nombre: `UT_SERIE_SPEC_${userId}`,
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
	await Series.deleteMany({ nombre: /^UT_SERIE_SPEC_/ });
	await Usuario.deleteMany({ nombre_usr: /^ut_serie_usuario_/ });
});

describe("POST /series", () => {
	test("Should successfully create a new series", async () => {
		const usuario = await new Usuario(buildUserPayload("post_ok")).save();

		const response = await request(app)
			.post("/series")
			.send(buildSeriePayload(usuario._id.toString()));

		console.log("DEBUG_SERIE_POST", response.status, response.body);
		expect(response.status).toBe(201);
	});

	test("Should fail when one user does not exist", async () => {
		await request(app)
			.post("/series")
			.send(buildSeriePayload("507f1f77bcf86cd799439011"))
			.expect(404);
	});
});

describe("GET /series", () => {
	test("Should return all series", async () => {
		const usuario = await new Usuario(buildUserPayload("get_all")).save();
		await request(app)
			.post("/series")
			.send(buildSeriePayload(usuario._id.toString()))
			.expect(201);

		const response = await request(app).get("/series").expect(200);
		expect(response.body).toHaveLength(1);
		expect(response.body[0].nombre).toContain("UT_SERIE_SPEC_");
	});
});

describe("GET /series/:id", () => {
	test("Should return one series by id", async () => {
		const usuario = await new Usuario(buildUserPayload("get_id_ok")).save();
		const created = await request(app)
			.post("/series")
			.send(buildSeriePayload(usuario._id.toString()))
			.expect(201);

		const response = await request(app).get(`/series/${created.body._id}`).expect(200);
		expect(response.body._id).toBe(created.body._id);
	});

	test("Should return 404 when series is not found", async () => {
		await request(app).get("/series/507f1f77bcf86cd799439011").expect(404);
	});
});

describe("PATCH /series/:id", () => {
	test("Should update a series", async () => {
		const usuario = await new Usuario(buildUserPayload("patch_ok")).save();
		const created = await request(app)
			.post("/series")
			.send(buildSeriePayload(usuario._id.toString()))
			.expect(201);

		const response = await request(app)
			.patch(`/series/${created.body._id}`)
			.send({ nombre: "The Sopranos" })
			.expect(200);

		expect(response.body.nombre).toBe("The Sopranos");
	});

	test("Should return 404 when updated users do not exist", async () => {
		const usuario = await new Usuario(buildUserPayload("patch_user_404")).save();
		const created = await request(app)
			.post("/series")
			.send(buildSeriePayload(usuario._id.toString()))
			.expect(201);

		await request(app)
			.patch(`/series/${created.body._id}`)
			.send({ usuarios: ["507f1f77bcf86cd799439011"] })
			.expect(404);
	});

	test("Should return 404 when series is not found", async () => {
		await request(app)
			.patch("/series/507f1f77bcf86cd799439011")
			.send({ nombre: "Nada" })
			.expect(404);
	});
});

describe("DELETE /series/:id", () => {
	test("Should delete one series", async () => {
		const usuario = await new Usuario(buildUserPayload("delete_ok")).save();
		const created = await request(app)
			.post("/series")
			.send(buildSeriePayload(usuario._id.toString()))
			.expect(201);

		await request(app).delete(`/series/${created.body._id}`).expect(200);
		await request(app).get(`/series/${created.body._id}`).expect(404);
	});

	test("Should return 404 when deleting a non-existing series", async () => {
		await request(app).delete("/series/507f1f77bcf86cd799439011").expect(404);
	});
});
