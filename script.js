document.addEventListener('DOMContentLoaded', () => {
    const generateItemsBtn = document.getElementById('generateItems');
    const calculateBtn = document.getElementById('calculate');
    const itemsContainer = document.getElementById('itemsContainer');
    const resultDiv = document.getElementById('result');
    const solutionText = document.getElementById('solutionText');
    const solutionTableBody = document.getElementById('solutionTableBody');

    const dpTableContainer = document.createElement('div');
    dpTableContainer.id = 'dpTableContainer';
    dpTableContainer.className = 'overflow-x-auto mt-6 border p-4 rounded-lg bg-gray-50';
    resultDiv.appendChild(dpTableContainer);

    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = "Download Solution PDF";
    downloadBtn.className = "mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded";
    downloadBtn.style.display = "none";
    resultDiv.appendChild(downloadBtn);

    function createItem(index) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item flex items-center gap-4 p-2 bg-gray-100 rounded-lg shadow-sm my-2';

        const label = String.fromCharCode(65 + index);
        itemDiv.innerHTML = `
            <span class="w-16 font-semibold text-gray-700">Item ${label}:</span>
            <input type="number" class="item-value itemCount border px-2 py-1 rounded-md" placeholder="Value" min="1" />
            <input type="number" class="item-weight itemCount border px-2 py-1 rounded-md" placeholder="Weight" min="1" />
        `;
        return itemDiv;
    }

    function validateInputs(values, weights) {
        const invalid = values.some(v => isNaN(v) || v <= 0) || weights.some(w => isNaN(w) || w <= 0);
        if (invalid) {
            alert("Please make sure all values and weights are valid positive numbers.");
        }
        return !invalid;
    }

    generateItemsBtn.addEventListener('click', () => {
        const itemCount = parseInt(document.getElementById('itemCount').value);
        itemsContainer.innerHTML = '';
        for (let i = 0; i < itemCount; i++) {
            itemsContainer.appendChild(createItem(i));
        }
        resultDiv.style.display = 'none';
        downloadBtn.style.display = 'none';
    });

    generateItemsBtn.click();

    calculateBtn.addEventListener('click', () => {
        const maxWeight = parseInt(document.getElementById('maxWeight').value);
        const valueInputs = document.querySelectorAll('.item-value');
        const weightInputs = document.querySelectorAll('.item-weight');

        const itemValues = Array.from(valueInputs).map(input => parseInt(input.value));
        const itemWeights = Array.from(weightInputs).map(input => parseInt(input.value));

        if (!validateInputs(itemValues, itemWeights)) return;

        const solution = knapsack(maxWeight, itemWeights, itemValues, itemValues.length);
        renderSolution(solution, itemValues, itemWeights);
        renderDpTable(solution.dp);
        downloadBtn.style.display = "inline-block";
    });

    downloadBtn.addEventListener('click', () => {
        const element = document.createElement('div');

        const itemsList = Array.from(document.querySelectorAll('.item')).map((el, i) => {
            const label = String.fromCharCode(65 + i);
            const value = el.querySelector('.item-value').value;
            const weight = el.querySelector('.item-weight').value;
            return `<li>Item ${label}: Value = ${value}, Weight = ${weight}</li>`;
        }).join('');

        const watermark = `<p style="text-align: center; margin-top: 30px; opacity: 0.4;">Powered by YourName</p>`;

        const solutionHTML = solutionText.innerHTML;
        const solutionTableHTML = document.getElementById('solutionTable')?.outerHTML || '';
        const dpTableHTML = document.getElementById('dpTableContainer')?.outerHTML || '';

        element.innerHTML = `
            <div style="font-family: Arial, sans-serif;">
                <h1 style="text-align:center;">0/1 Knapsack Problem Solution</h1>
                <h3>Knapsack Capacity: ${document.getElementById('maxWeight').value}</h3>
                <h4>Items:</h4>
                <ul>${itemsList}</ul>
                ${solutionHTML}
                <br><h4>Selected Items Table:</h4>
                ${solutionTableHTML}
                <br><h4>Dynamic Programming Table:</h4>
                ${dpTableHTML}
                ${watermark}
            </div>
        `;

        document.body.appendChild(element);

        html2pdf().from(element).set({
            margin: 0.5,
            filename: 'knapsack_solution.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        }).save().then(() => {
            document.body.removeChild(element);
        });
    });

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

    function renderDpTable(dp) {
        const table = document.createElement('table');
        table.className = 'table-auto border-collapse border text-xs md:text-sm';
        const header = document.createElement('tr');
        header.innerHTML = '<th class="border px-2 py-1">Item \\ Weight</th>' +
            dp[0].map((_, w) => `<th class="border px-2 py-1">${w}</th>`).join('');
        table.appendChild(header);

        dp.forEach((row, i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td class="border px-2 py-1">${i}</td>` +
                row.map(cell => `<td class="border px-2 py-1">${cell}</td>`).join('');
            table.appendChild(tr);
        });

        dpTableContainer.innerHTML = '<h3 class="font-bold mb-2">Dynamic Programming Table</h3>';
        dpTableContainer.appendChild(table);
    }

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
            totalWeight,
            dp
        };
    }
});
downloadBtn.addEventListener('click', () => {
    const element = document.createElement('div');
    element.style.padding = "20px";
    element.style.fontFamily = "Arial, sans-serif";
    element.style.width = "100%";
    element.style.boxSizing = "border-box";

    // Build item list
    const itemsList = Array.from(document.querySelectorAll('.item')).map((el, i) => {
        const label = String.fromCharCode(65 + i);
        const value = el.querySelector('.item-value').value;
        const weight = el.querySelector('.item-weight').value;
        return `<li>Item ${label}: Value = ${value}, Weight = ${weight}</li>`;
    }).join('');

    // Gather the tables
    const solutionHTML = document.getElementById('solutionText')?.outerHTML || '';
    const solutionTableHTML = document.getElementById('solutionTable')?.outerHTML || '';
    const dpTableHTML = document.getElementById('dpTableContainer')?.outerHTML || '';
    const watermark = `<p style="text-align: center; margin-top: 30px; opacity: 0.3;">Powered by YourName</p>`;

    // Set full HTML
    element.innerHTML = `
        <h2 style="text-align:center; margin-bottom: 10px;">0/1 Knapsack Problem Report</h2>
        <h4>Knapsack Capacity: ${document.getElementById('maxWeight').value}</h4>
        <ul>${itemsList}</ul>
        ${solutionHTML}
        <br><h4>Selected Items:</h4>${solutionTableHTML}
        <br><h4>Dynamic Programming Table:</h4>${dpTableHTML}
        ${watermark}
    `;

    document.body.appendChild(element); // Make sure it's on the page

    // Delay rendering PDF until DOM is fully ready
    setTimeout(() => {
        html2pdf()
            .from(element)
            .set({
                margin: 0.5,
                filename: 'knapsack_solution.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
            })
            .save()
            .then(() => {
                document.body.removeChild(element); // Clean up
            });
    }, 500); // small delay ensures rendering is complete
});
