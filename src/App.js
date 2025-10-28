import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMeal, setSelectedMeal] = useState(null);

  // Fetch recipes by ingredient
  const fetchMeals = async () => {
    if (!input.trim()) {
      setError("Please enter an ingredient, like 'chicken' or 'egg'.");
      setMeals([]);
      return;
    }
    setLoading(true);
    setError("");
    setSelectedMeal(null);
    try {
      const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${input}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.meals) {
        setMeals(data.meals);
      } else {
        setMeals([]);
        setError("No recipes found. Try a different ingredient.");
      }
    } catch (err) {
      setError("Error fetching recipes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch full details for one meal
  const fetchMealDetails = async (idMeal) => {
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`
      );
      const data = await res.json();
      setSelectedMeal(data.meals[0]);
    } catch {
      setError("Failed to load meal details.");
    }
  };

  return (
    <div className="app">
      <h1>🍳 Recipe Ideas for Taylor</h1>
      <p>Find meals based on ingredients you have at home.</p>

      <div className="search-bar">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter an ingredient (e.g. chicken)"
        />
        <button onClick={fetchMeals}>Search</button>
      </div>

      {loading && <p>Loading recipes...</p>}
      {error && <p className="error">{error}</p>}

      <div className="grid">
        {meals.map((meal) => (
          <div
            key={meal.idMeal}
            className="card"
            onClick={() => fetchMealDetails(meal.idMeal)}
          >
            <img src={meal.strMealThumb} alt={meal.strMeal} />
            <h3>{meal.strMeal}</h3>
          </div>
        ))}
      </div>

      {selectedMeal && (
        <div className="popup" onClick={() => setSelectedMeal(null)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedMeal.strMealThumb}
              alt={selectedMeal.strMeal}
              className="popup-img"
            />
            <h2>{selectedMeal.strMeal}</h2>
            <p>
              <strong>Category:</strong> {selectedMeal.strCategory}
            </p>
            <p>
              <strong>Area:</strong> {selectedMeal.strArea}
            </p>

            <h4>Ingredients:</h4>
            <ul>
              {Array.from({ length: 20 }).map((_, i) => {
                const ingredient = selectedMeal[`strIngredient${i + 1}`];
                const measure = selectedMeal[`strMeasure${i + 1}`];
                if (ingredient && ingredient.trim() !== "") {
                  return (
                    <li key={i}>
                      {measure} {ingredient}
                    </li>
                  );
                }
                return null;
              })}
            </ul>

            <h4>Instructions:</h4>
            <p className="instructions">{selectedMeal.strInstructions}</p>

            {selectedMeal.strYoutube && (
              <a
                href={selectedMeal.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="youtube-link"
              >
                ▶ Watch on YouTube
              </a>
            )}

            <button className="close-btn" onClick={() => setSelectedMeal(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
