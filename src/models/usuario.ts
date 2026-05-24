import { Document, model, Schema } from 'mongoose';
import validator from 'validator';

type Genero = "acción" | "aventura" | "drama" | "suspense" | "deportivo" | "humor" | "biografía";
enum GenerosPermitidos { "acción", "aventura", "drama", "suspense", "deportivo", "humor", "biografía" }

export interface IUsuario extends Document {
    nombre: string,
    nombre_usr: string,
    correo: string,
    generos: Genero[],
}

const UsuarioSchema = new Schema<IUsuario> ({
    nombre: {
        type: String,
        required: true,
        validate: (value: string) => {
            if (value.length < 3) {
                throw new Error ("El nombre tiene que tener al menos 3 caracteres")
            }
        }
    },
    nombre_usr: {
        type: String,
        required: true,
        unique: true,
        validate: (value: string) => {
            if (value.length < 3) {
                throw new Error ("El nombre tiene que tener al menos 3 caracteres")
            }
        }
    },
    correo: {
        type: String,
        required: true,
        unique: true,
        validate: (value: string) => {
            if (!validator.default.isEmail(value)) {
                throw new Error ("El email introducido no es valido")
            }
        }
    },
    generos: {
        type: [String],
        required:true,
        enum: GenerosPermitidos,
    }
})

export const Usuario = model<IUsuario>('Usuario', UsuarioSchema )