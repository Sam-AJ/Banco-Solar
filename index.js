const express = require('express');
const app = express();

app.listen(3000, () => console.log("Servidor activo http://localhost:3000"));

app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/index.html`)
})
