const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Sample JSON data for dishes
let jsonData = require('./database.json');

app.get('/', (req, res) => {
  res.render('index', { jsonData });
});

app.get('/add', (req, res) => {
  res.render('add');
});

let highestId = jsonData.reduce((maxId, component) => Math.max(maxId, component.id), 0);

app.post('/add', (req, res) => {
  const newComponent = {
    id: ++highestId,
    name: req.body.name,
    // Add more fields as needed
  };

  jsonData.push(newComponent);

  fs.writeFile('./database.json', JSON.stringify(jsonData), err => {
    if (err) {
      console.error('Error writing to database.json:', err);
    } else {
      console.log('Data written to database.json');
    }
  });

  res.redirect('/');
});

// Route to add ingredients
app.get('/add-ingredient', (req, res) => {
  res.render('add-ingredient');
});

app.post('/add-ingredient', (req, res) => {
  const newIngredient = {
    id: jsonData.length + 1, // You can adjust this based on your needs
    name: req.body.name,
    price: parseFloat(req.body.price),
    amount: req.body.amount,
    // Add more ingredient fields as needed
  };


  fs.readFile('./ingredients.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading ingredients.json:', err);
      return;
    }

    const ingredients = JSON.parse(data);
    ingredients.push(newIngredient);

    fs.writeFile('./ingredients.json', JSON.stringify(ingredients), err => {
      if (err) {
        console.error('Error writing to ingredients.json:', err);
      } else {
        console.log('Data written to ingredients.json');
      }
    });
  });

  res.redirect('/');
});


app.get('/ingredients/:dishId', (req, res) => {
  const dishId = req.params.dishId;



  // Read the ingredients from ingredients.json
  fs.readFile('./ingredients.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading ingredients.json:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const ingredients = JSON.parse(data);
    const filteredIngredients = ingredients.filter(ingredient => ingredient.dishId === dishId);

    res.json(filteredIngredients);
  });
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
