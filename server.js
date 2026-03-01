// Подключаем зависимости
const express = require('express');
const cors = require('cors');

// Создаём Express приложение
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());           // Разрешаем кросс-доменные запросы
app.use(express.json());   // Автоматически парсим JSON в теле запроса

// =============================================
// In-memory хранилище данных
// =============================================
// Простой массив, который хранит наши объекты. 
// При перезапуске сервера данные теряются — для тестов это нормально! [citation:1][citation:4]
let items = [
  { id: 1, name: 'Laptop', price: 999.99 },
  { id: 2, name: 'Mouse', price: 29.99 },
  { id: 3, name: 'Keyboard', price: 89.99 }
];

// Счётчик для генерации новых ID
let nextId = 4;

// =============================================
// CRUD ЭНДПОИНТЫ
// =============================================

// ---------- CREATE (POST) ----------
// Создаём новый элемент
app.post('/api/items', (req, res) => {
  try {
    // Получаем данные из тела запроса [citation:7]
    const { name, price } = req.body;
    
    // Валидация: проверяем, что name и price есть
    if (!name || price === undefined) {
      return res.status(400).json({ 
        error: 'Please provide name and price' 
      });
    }
    
    // Создаём новый объект с уникальным ID
    const newItem = {
      id: nextId++,
      name: name,
      price: price
    };
    
    // Добавляем в массив
    items.push(newItem);
    
    // Возвращаем созданный объект с кодом 201 (Created) [citation:4]
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------- READ all (GET) ----------
// Получаем все элементы
app.get('/api/items', (req, res) => {
  res.json(items);
});

// ---------- READ one (GET by ID) ----------
// Получаем один элемент по ID
app.get('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find(i => i.id === id);
  
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  res.json(item);
});

// ---------- UPDATE (PUT) ----------
// Полностью обновляем элемент
app.put('/api/items/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, price } = req.body;
    
    // Валидация
    if (!name || price === undefined) {
      return res.status(400).json({ 
        error: 'Please provide name and price' 
      });
    }
    
    // Ищем индекс элемента в массиве
    const index = items.findIndex(i => i.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    // Обновляем элемент [citation:4]
    items[index] = {
      id: id,
      name: name,
      price: price
    };
    
    res.json(items[index]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------- DELETE ----------
// Удаляем элемент
app.delete('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = items.findIndex(i => i.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  // Удаляем элемент из массива [citation:4]
  items.splice(index, 1);
  
  // Возвращаем 204 No Content (успешно, но без тела ответа) [citation:4]
  res.status(204).send();
});

// =============================================
// ЗАПУСК СЕРВЕРА
// =============================================
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📦 API endpoints:`);
  console.log(`   GET    http://localhost:${PORT}/api/items`);
  console.log(`   GET    http://localhost:${PORT}/api/items/:id`);
  console.log(`   POST   http://localhost:${PORT}/api/items`);
  console.log(`   PUT    http://localhost:${PORT}/api/items/:id`);
  console.log(`   DELETE http://localhost:${PORT}/api/items/:id`);
});