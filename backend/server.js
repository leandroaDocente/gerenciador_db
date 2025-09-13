const express = require('express');
const cors = require('cors');

const app = express();
const db = require('./db');

const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/tasks", (req,res) => {
    db.query("SELECT * FROM tasks", (err, results) => {
        if(err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get("/tasks/:id", (req, res) => {
    db.query("SELECT * FROM tasks WHERE id = ?", [req.params.id], (err, results) => {
        if(err) return res.status(500).json({ error: err.message });
        if(results.length === 0) return res.status(404).json({ error: "Tarefa não encontrada" });
        res.json(results[0]);
    });
});

app.post("/tasks", (req, res) => {
    const { title, description } = req.body;
    db.query("INSERT INTO tasks (title, description) VALUES (?, ?)", [title, description],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: results.insertId, title, description, completed: false });
        }
    );
});

app.put("/tasks/:id", (req, res) => {
    const {title, description, completed } = req.body;
    db.query("UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?",
        [title, description, completed, req.params.id], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.affectedRows === 0) return res.status(404).json({ error: "Tarefa não encontrada" });
            res.json({ id: req.params.id, title, description, completed });
        }
    );
})

app.delete("/tasks/:id", (req, res) => {
    db.query("DELETE FROM tasks WHERE id = ?", [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) return res.status(404).json({ error: "Tarefa não encontrada" });
        res.status(204).send();
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
