const express = require('express');
const app = express();

// Servir el archivo script.js
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.send('Hello from Render!');
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running...');
});
