import multer from "multer";
import moment from "moment";
import paths from "./path.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, paths.img);
    },
    filename: function (req, file, cb) {
        const randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
        const dateTime = moment().format("DDMMYYYY_HHmmss");
        const extension = file.originalname.slice(file.originalname.lastIndexOf("."));

        const filename = `file_${randomNumber}_${dateTime}${extension}`;

        cb(null, filename);
    },
});

const uploader = multer({ storage });

export default uploader;