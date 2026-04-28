import app from "./src/app.js";
import "dotenv/config";

const PORT = process.env.PORT || 2999;

const server = app.listen(PORT, () => {
    console.log(`START PROJECT WITH ${PORT}`)
})