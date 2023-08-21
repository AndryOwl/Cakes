const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const ingredients = require('./ingredients.json');
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
  res.render('add-ingredient', { jsonData }); // Pass jsonData to the template
});


app.post('/add-ingredient', (req, res) => {
  const newIngredient = {
    id: ingredients.length + 1,
    name: req.body.name,
    price: parseFloat(req.body.price),
    amount: req.body.amount,
    dishId: findDishIdByName(req.body.dishName), // Call a function to find dishId
  };

  // Add the new ingredient to your ingredients array
  ingredients.push(newIngredient);

  // Write the updated ingredients array back to ingredients.json
  fs.writeFile('./ingredients.json', JSON.stringify(ingredients), err => {
    if (err) {
      console.error('Error writing to ingredients.json:', err);
      // Handle the error appropriately
    } else {
      console.log('Ingredient added and data written to ingredients.json');
    }
  });

  res.redirect('/');
});

// Function to find dishId by dishName in dishes.json
function findDishIdByName(dishName) {
  const dish = jsonData.find(dish => dish.name === dishName);
  return dish ? dish.id : null;
}




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
