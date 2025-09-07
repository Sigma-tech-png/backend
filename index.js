const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config(); // подключаем .env

const app = express();
app.use(cors());
app.use(express.json());

// Функция подключения к базе
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Подключение к MongoDB успешно");
  } catch (err) {
    console.error("❌ Ошибка подключения к MongoDB:", err.message);
    process.exit(1); // завершаем приложение, если база не подключена
  }
}
connectDB();

// Схема и модель
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// POST — сохраняем имя
app.post("/api/set-name", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Имя обязательно" });
    }

    const user = new User({ name });
    await user.save();

    res.json({ message: "Имя сохранено", name });
  } catch (err) {
    console.error("Ошибка при сохранении имени:", err.message);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// GET — получаем последнее имя
app.get("/api/get-name", async (req, res) => {
  try {
    const user = await User.findOne().sort({ _id: -1 });
    if (!user) {
      return res.status(404).json({ error: "Имя не найдено" });
    }
    res.json({ name: user.name });
  } catch (err) {
    console.error("Ошибка при получении имени:", err.message);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Сервер работает на http://localhost:${PORT}`));