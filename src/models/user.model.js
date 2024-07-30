import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const userSchema = new Schema ({
    name: {
        type: String,
        required: [ true, "El nombre es obligatorio" ],
        uppercase: true,
        trim: true,
        minLength: [ 3, "El nombre debe tener al menos 3 caracteres" ],
        maxLength: [ 25, "El nombre debe tener como máximo 25 caracteres" ],
    },
    surname: {
        type: String,
        required: [ true, "El apellido es obligatorio" ],
        uppercase: true,
        trim: true,
        minLength: [ 3, "El apellido debe tener al menos 3 caracteres" ],
        maxLength: [ 25, "El apellido debe tener como máximo 25 caracteres" ],
    },
    email: {
        type: String,
        unique: true,
        required: [ true, "El email es obligatorio" ],
        lowercase: true,
        match: [ /^[a-z0-9.]+@[a-z0-9-]+.(com$|com.[a-z0-9]{2}$)/, "El email es inválido" ],
        validate: {
            validator: async function (email) {
                const countDocuments = await this.model("users").countDocuments({
                    _id: { $ne: this._id },
                    email,
                });
                return countDocuments === 0;
            },
            message: "El email ya está registrado",
        },
    },
    thumbnail: {
        type: String,
        required: [ true, "La imagen es obligatoria" ],
        trim: true,
    },
    // RELACIÓN FÍSICA 0:N
    carts: [{
        type: Schema.Types.ObjectId,
        ref: "carts",
    }],
}, {
    timestamps: true, // Añade timestamps para generar createdAt y updatedAt
})

userSchema.pre("findByIdAndDelete", async function (next) {
    const user = await this.model.findOne(this.getFilter()).populate("carts");

    if (user.carts && user.carts.length > 0) {
        await CartModel.deleteMany({ _id: { $in: user.carts } });
    }

    next();
});

// Índice compuesto para nombre y apellido
userSchema.index({ surname: 1, name: 1 }, { name: "idx_surname_name" });

// Agrega mongoose-paginate-v2 para habilitar las funcionalidades de paginación.
userSchema.plugin(paginate);

const UserModel = model("users", userSchema);

export default UserModel;