document.addEventListener('DOMContentLoaded', () => {
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const heightSlider = document.getElementById('height-slider');
    const weightSlider = document.getElementById('weight-slider');
    const calculateBtn = document.getElementById('calculate');
    const bmiResult = document.getElementById('bmi');
    const categoryResult = document.getElementById('category');
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    const gaugeFill = document.querySelector('.gauge-fill');
    const tips = document.querySelectorAll('.tip');
    let currentTipIndex = 0;

    // Theme switching
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // Slider and input synchronization
    function syncInputs(input, slider) {
        input.addEventListener('input', () => {
            slider.value = input.value;
            updateGauge();
        });

        slider.addEventListener('input', () => {
            input.value = slider.value;
            updateGauge();
        });
    }

    syncInputs(heightInput, heightSlider);
    syncInputs(weightInput, weightSlider);

    // BMI calculation
    calculateBtn.addEventListener('click', () => {
        const height = parseFloat(heightInput.value);
        const weight = parseFloat(weightInput.value);

        if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
            showError('Please enter valid height and weight values');
            return;
        }

        const bmi = calculateBMI(height, weight);
        const category = getBMICategory(bmi);

        updateResult(bmi, category);
        updateGauge(bmi);
        updateCategoryIcon(category);
        showHealthTips(category);
    });

    function calculateBMI(height, weight) {
        const heightInMeters = height / 100;
        return weight / (heightInMeters * heightInMeters);
    }

    function getBMICategory(bmi) {
        if (bmi < 18.5) return 'Underweight';
        if (bmi < 25) return 'Normal';
        if (bmi < 30) return 'Overweight';
        return 'Obese';
    }

    function updateResult(bmi, category) {
        bmiResult.textContent = bmi.toFixed(1);
        categoryResult.textContent = category;
        
        // Update BMI value color and animation
        const bmiValue = document.querySelector('.bmi-value');
        bmiValue.setAttribute('data-category', category.toLowerCase());
        
        // Update category display
        categoryResult.className = `bmi-category ${category.toLowerCase()}`;
        
        // Update gauge fill color
        const gaugeFill = document.querySelector('.gauge-fill');
        gaugeFill.setAttribute('data-category', category.toLowerCase());
        
        // Update result section background
        const resultSection = document.querySelector('.result');
        resultSection.setAttribute('data-category', category.toLowerCase());
        
        // Add animation class
        bmiValue.classList.add('animate');
        setTimeout(() => bmiValue.classList.remove('animate'), 1000);
    }

    function updateGauge(bmi) {
        if (!bmi) return;
        
        const maxBMI = 40;
        const percentage = Math.min((bmi / maxBMI) * 100, 100);
        gaugeFill.style.height = `${percentage}%`;
        
        // Update gauge color based on BMI category
        const category = getBMICategory(bmi);
        let color;
        switch(category) {
            case 'Underweight': color = 'var(--info-color)'; break;
            case 'Normal': color = 'var(--success-color)'; break;
            case 'Overweight': color = 'var(--warning-color)'; break;
            case 'Obese': color = 'var(--danger-color)'; break;
        }
        gaugeFill.style.backgroundColor = color;
    }

    function updateCategoryIcon(category) {
        const icon = document.querySelector('.category-icon i');
        let iconClass;
        switch(category) {
            case 'Underweight': iconClass = 'fa-arrow-down'; break;
            case 'Normal': iconClass = 'fa-check'; break;
            case 'Overweight': iconClass = 'fa-exclamation'; break;
            case 'Obese': iconClass = 'fa-exclamation-triangle'; break;
        }
        icon.className = `fas ${iconClass}`;
    }

    function showHealthTips(category) {
        tips.forEach(tip => tip.classList.remove('active'));
        currentTipIndex = (currentTipIndex + 1) % tips.length;
        tips[currentTipIndex].classList.add('active');
    }

    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: var(--danger-color);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            animation: slideIn 0.3s ease-out;
        `;
        document.body.appendChild(errorDiv);
        setTimeout(() => {
            errorDiv.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => errorDiv.remove(), 300);
        }, 3000);
    }

    // Input validation
    [heightInput, weightInput].forEach(input => {
        input.addEventListener('input', (e) => {
            const value = e.target.value;
            if (value < 0) {
                e.target.value = '';
            }
        });
    });

    // Auto-rotate health tips
    setInterval(() => {
        tips.forEach(tip => tip.classList.remove('active'));
        currentTipIndex = (currentTipIndex + 1) % tips.length;
        tips[currentTipIndex].classList.add('active');
    }, 5000);
});