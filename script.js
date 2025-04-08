async function getFoodRecommendations(query) {
    const apiKey = 'uoLcriEu2xdFzFrjjyQWAw==ZQHPFtn2N5KnsuIZ';
    const apiUrl = `https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(apiUrl, {
            headers: { 'X-Api-Key': apiKey }
        });

        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data); 
        return data.items || [];
    } catch (error) {
        console.error('Error fetching nutritional data:', error);
        return [];
    }
}

async function calculateBMI() {
    const weight = parseFloat(document.getElementById("weightInput").value);
    const height = parseFloat(document.getElementById("heightInput").value);
    const calorieInput = parseFloat(document.getElementById("caloriesInput").value);

    const bmiResultDiv = document.getElementById("bmiResult");
    const calorieResultDiv = document.getElementById("calorieResult");
    const recommendationsDiv = document.getElementById("recommendations"); 

    bmiResultDiv.innerHTML = "";
    calorieResultDiv.innerHTML = "";
    recommendationsDiv.innerHTML = "";

    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
        bmiResultDiv.innerHTML = "<p style='color: red;'>Please enter a valid weight and height.</p>";
        return;
    }

    const bmi = weight / (height * height);
    let category = "";

    if (bmi < 18.5) {
        category = "Underweight";
    } else if (bmi >= 18.5 && bmi < 24.9) {
        category = "Normal weight";
    } else if (bmi >= 25 && bmi < 29.9) {
        category = "Overweight";
    } else {
        category = "Obese";
    }

    bmiResultDiv.innerHTML = `<p>Your BMI is <strong>${bmi.toFixed(2)}</strong> (<strong>${category}</strong>).</p>`;

    let message = "";
    let foodQuery = "";

    if (isNaN(calorieInput)) {
        calorieResultDiv.innerHTML = "<p style='color: red;'>Please enter a valid calorie intake.</p>";
        return;
    }

    if (calorieInput < 1200) {
        message = "Your calorie intake is too low. You need more nutrition!";
        foodQuery = "avocado, peanut butter, whole milk, cheese, nuts, eggs, oats";
    } else if (calorieInput >= 1200 && calorieInput <= 2000) {
        message = "Your calorie intake is healthy! Keep it up.";
    } else {
        message = "Your calorie intake is high. Consider balancing your diet.";
        foodQuery = "broccoli, cucumber, spinach, berries, egg whites, lean chicken, fish";
    }

    calorieResultDiv.innerHTML = `<p>${message}</p>`;

    if (foodQuery) {
        const recommendations = await getFoodRecommendations(foodQuery);
        if (recommendations.length > 0) {
            let recommendationsHtml = `<p>Here are some recommended foods:</p><ul>`;
            recommendations.forEach(item => {
                recommendationsHtml += `<li><strong>${item.name}</strong>: ${item.calories} calories per 100g</li>`;
            });
            recommendationsHtml += "</ul>";
            recommendationsDiv.innerHTML = recommendationsHtml;
        } else {
            recommendationsDiv.innerHTML = "<p>Unable to fetch food recommendations at this time.</p>";
        }
    }
}

