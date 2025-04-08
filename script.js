document.addEventListener('DOMContentLoaded', () => {
    const generateItemsBtn = document.getElementById('generateItems');
    const calculateBtn = document.getElementById('calculate');
    const itemsContainer = document.getElementById('itemsContainer');
    const resultDiv = document.getElementById('result');
    const solutionText = document.getElementById('solutionText');
    const solutionTableBody = document.getElementById('solutionTableBody');

    // Helper to create item input field
    function createItem(index) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item flex items-center gap-4 p-2 bg-gray-50 rounded-lg shadow-sm';

        const value = Math.floor(Math.random() * 20) + 1;
        const weight = Math.floor(Math.random() * 10) + 1;

        const label = String.fromCharCode(65 + index); // A, B, C...

        itemDiv.innerHTML = `
            <span class="w-12 font-semibold text-gray-700">Item ${label}:</span>
            <input type="number" class="item-value border px-2 py-1 rounded-md" placeholder="Value" min="1" value="${value}">
            <input type="number" class="item-weight border px-2 py-1 rounded-md" placeholder="Weight" min="1" value="${weight}">
        `;

        return itemDiv;
    }

    // Validate all inputs
    function validateInputs(values, weights) {
        const invalid = values.some(v => isNaN(v) || v <= 0) || weights.some(w => isNaN(w) || w <= 0);
        if (invalid) {
            alert("Please make sure all values and weights are valid positive numbers.");
        }
        return !invalid;
    }

    // Handle Generate Items
    generateItemsBtn.addEventListener('click', () => {
        const itemCount = parseInt(document.getElementById('itemCount').value);
        itemsContainer.innerHTML = '';

        for (let i = 0; i < itemCount; i++) {
            itemsContainer.appendChild(createItem(i));
        }

        resultDiv.style.display = 'none';
    });

    // Auto-generate default items on load
    generateItemsBtn.click();

    // Handle Calculate
    calculateBtn.addEventListener('click', () => {
        const maxWeight = parseInt(document.getElementById('maxWeight').value);
        const valueInputs = document.querySelectorAll('.item-value');
        const weightInputs = document.querySelectorAll('.item-weight');

        const itemValues = Array.from(valueInputs).map(input => parseInt(input.value));
        const itemWeights = Array.from(weightInputs).map(input => parseInt(input.value));

        if (!validateInputs(itemValues, itemWeights)) return;

        const solution = knapsack(maxWeight, itemWeights, itemValues, itemValues.length);
        renderSolution(solution, itemValues, itemWeights);
    });

    // Render results
    function renderSolution(solution, values, weights) {
        const itemCount = values.length;

        solutionText.innerHTML = `
            <p><strong>Maximum Knapsack Capacity:</strong> ${document.getElementById('maxWeight').value}</p>
            <p><strong>Maximum Value Achievable:</strong> ${solution.maxValue}</p>
            <p><strong>Total Weight Used:</strong> ${solution.totalWeight}</p>
        `;

        solutionTableBody.innerHTML = '';
        for (let i = 0; i < itemCount; i++) {
            const row = document.createElement('tr');
            row.className = solution.selectedItems[i] ? 'bg-green-50' : '';
            row.innerHTML = `
                <td>${String.fromCharCode(65 + i)}</td>
                <td>${values[i]}</td>
                <td>${weights[i]}</td>
                <td>${solution.selectedItems[i] ? '✔️' : '❌'}</td>
            `;
            solutionTableBody.appendChild(row);
        }

        resultDiv.style.display = 'block';
    }

    // 0/1 Knapsack DP Algorithm
    function knapsack(maxWeight, weights, values, n) {
        const dp = Array(n + 1).fill().map(() => Array(maxWeight + 1).fill(0));

        for (let i = 1; i <= n; i++) {
            for (let w = 1; w <= maxWeight; w++) {
                if (weights[i - 1] <= w) {
                    dp[i][w] = Math.max(
                        values[i - 1] + dp[i - 1][w - weights[i - 1]],
                        dp[i - 1][w]
                    );
                } else {
                    dp[i][w] = dp[i - 1][w];
                }
            }
        }

        let w = maxWeight;
        const selectedItems = Array(n).fill(false);
        let totalWeight = 0;

        for (let i = n; i > 0; i--) {
            if (dp[i][w] !== dp[i - 1][w]) {
                selectedItems[i - 1] = true;
                totalWeight += weights[i - 1];
                w -= weights[i - 1];
            }
        }

        return {
            maxValue: dp[n][maxWeight],
            selectedItems,
            totalWeight
        };
    }
});
