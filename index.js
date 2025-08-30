const express = require('express');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());


// Пример простого API
app.get('/api/hello', (req, res) => {
res.json({ message: 'Hello from backend' });
});


app.post('/api/echo', (req, res) => {
res.json({ you: req.body });
});


// Render сам задаёт PORT, поэтому используем process.env.PORT
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));