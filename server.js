const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
const db = 'mongodb+srv://junkuser:abc@testdummy.8xodcfs.mongodb.net/300391713-riya';
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Book Schema
const BookSchema = new mongoose.Schema({
    bookId: { type: Number, unique: true, required: true },
    bookTitle: { type: String,  required: true },
    bookAuthor:  { type: String,  required: true },
    description: {type: String}
  
});

const Book = mongoose.model('BookDB', BookSchema);

// Routes
//Get all books
// @Route GET /api/v1/book
app.get('/api/v1/book', async (req, res) => {
    const books = await Book.find();
    res.json(books);
});

//Add a book
// @Route POST /api/v1/book

app.post('/api/v1/book', async (req, res) => {
    const { bookId, bookTitle, bookAuthor, description } = req.body;
    try {
        const book = new Book({ bookId, bookTitle, bookAuthor, description });
        await book.save();
        res.status(201).json(book);
    } catch (err) {
        if (err.code === 11000) { // Duplicate key error
            res.status(400).json({ message: 'Book ID already exists. Please add another ID.' });
        } else {
            res.status(500).json(err);
        }
    }
});


//Get a single book
// @Route POST /api/v1/book/:id
app.get('/api/v1/book/:id', async (req, res) => {
    const book = await Book.findOne({ bookId: req.params.id });
    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

//Update a single book
// @Route put /api/v1/book/:id
app.put('/api/v1/book/:id', async (req, res) => {
    const { bookTitle, bookAuthor, description } = req.body;
    const book = await Book.findOneAndUpdate({ bookId: req.params.id }, { bookTitle, bookAuthor, description}, { new: true });
    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

//Delete a single book
// @Route Delet /api/v1/book/:id
app.delete('/api/v1/book/:id', async (req, res) => {
    const book = await Book.findOneAndDelete({ bookId: req.params.id });
    if (book) {
        res.json({ message: 'Book deleted' });
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));