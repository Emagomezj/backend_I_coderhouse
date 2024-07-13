import path from "path";

export const paths = {
    root: path.dirname(""),
    src: path.join(path.dirname(""), "src"),
    public: path.join(path.dirname(""), "src", "public"),
    img: path.join(path.dirname(""), "src", "public", "img"),
    css: path.join(path.dirname(""), "src", "public", "css"),
    js: path.join(path.dirname(""), "src", "public", "js"),
    views: path.join(path.dirname(""), "src", "views"),
    data: path.join(path.dirname(""), "src","data")
}