const express = require('express');
const redis = require('redis');
const app = express();
const client = redis.createClient({ host: 'redis' }); // 'redis' est le nom du service dans docker-compose

app.use(express.static('public'));
app.use(express.json());

client.connect().catch(console.error);

app.get('/todos', async (req, res) => {
    try {
        const todos = await client.lRange('todos', 0, -1);
        res.json(todos);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/todos', async (req, res) => {
    try {
        const todo = req.body.todo;
        await client.rPush('todos', todo);
        res.status(201).send('Todo added');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
