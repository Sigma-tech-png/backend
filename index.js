const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB подключен"))
.catch(err => console.log(err));

// Схема и модель для имени
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

// Роут для сохранения имени
app.post('/api/save-name', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: "Имя не может быть пустым" });

        const newUser = new User({ name });
        await newUser.save();

        res.status(201).json({ message: "Имя сохранено" });
    } catch (err) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));