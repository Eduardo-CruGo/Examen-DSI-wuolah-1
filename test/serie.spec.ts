import { describe, test, beforeEach } from "vitest";
import request from "supertest";

import { app } from "../src/app.js"
import { Usuario } from "../src/models/usuario.js";
import { Series } from "../src/models/serie.js";

const firstUsuario = {
	nombre: "Eduardo Segredo",
	nombre_usr: "esegredo",
	correo: "esegredo@example.com",
	generos: ["drama"],
};

beforeEach(async () => {
	await Series.deleteMany();
	await Usuario.deleteMany();
	await new Usuario(firstUsuario).save();
});

describe("POST /series", () => {
	test("Should successfully create a new series", async () => {
		const usuario = await Usuario.findOne({ nombre_usr: firstUsuario.nombre_usr });

		await request(app)
			.post("/series")
			.send({
				nombre: "Los Soprano",
				sinopsis: "Una familia mafiosa en Nueva Jersey.",
				año_estreno: 1999,
				n_temporadas: 6,
				duracion_media_capitulo: 55,
				n_episodios_temporada: [["temporada 1", 13]],
				reparto: [["James Gandolfini", "Tony Soprano"]],
				direccion: [["David Chase", "Creador"]],
				generos: ["drama"],
				usuarios: [usuario!._id],
			})
			.expect(201);
	});
});
