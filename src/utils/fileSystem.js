import fs from "fs";
import paths from "./path.js";

const deleteImage = async (filename) => {
    const filepath = `${paths.img}/${filename}`;

    try {
        await fs.promises.unlink(filepath);
    } catch (error) {
        console.log(`No existe el archivo ${filename}`);
    }
};

export default {
    deleteImage,
};