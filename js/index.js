document.addEventListener('DOMContentLoaded', () => {
    const selectForm = document.getElementById('select-form');
    const viewIngredientsButton = document.getElementById('view-ingredients-button');
    const ingredientsContainer = document.getElementById('ingredients-container');
  
    viewIngredientsButton.addEventListener('click', async () => {
      const selectedDishId = selectForm.dish.value;
      const response = await axios.get(`/ingredients/${selectedDishId}`);
      const ingredients = response.data;
  
      let ingredientsList = '<h2>Ingredients:</h2><ul>';
      ingredients.forEach(ingredient => {
        ingredientsList += `<li>${ingredient.name} - Price: ${ingredient.price}, Amount: ${ingredient.amount}</li>`;
      });
      ingredientsList += '</ul>';
  
      ingredientsContainer.innerHTML = ingredientsList;
    });
  });
  