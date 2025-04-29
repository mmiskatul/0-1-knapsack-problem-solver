# 0/1 Knapsack Problem Solver

[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/mmiskatul/0-1-knapsack-problem-solver.git)
[![Live Demo](https://img.shields.io/badge/Live-Demo-green?logo=netlify)](https://knapsack-problem-solver.netlify.app/)

A dynamic programming solution for the **0/1 Knapsack Problem**, implemented in Python (or your language). This solver computes the optimal selection of items (with given weights and values) to maximize total value without exceeding the knapsack’s weight capacity. Includes a **web-based demo** for interactive use.

---

## Features
- **Dynamic Programming** – Efficient pseudo-polynomial time solution (`O(nW)`).
- **Web Interface** – Interactive demo hosted on Netlify ([try it here](https://knapsack-problem-solver.netlify.app/)).
- **Input Flexibility** – Handles custom item lists and capacities.
- **Output Details** – Returns:
  - Maximum achievable value.
  - Indices of selected items.
  - Total weight of the solution.

---

## Usage

### 1. Local Setup (Python)
#### Prerequisites
- Python 3.x

#### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/mmiskatul/0-1-knapsack-problem-solver.git
   cd 0-1-knapsack-problem-solver
   ```

2. Run the solver:
   ```bash
   python knapsack.py
   ```
   *(Modify `knapsack.py` to input your items/capacity or use CLI arguments.)*

#### Example Input
```python
items = [
    {"weight": 2, "value": 3},
    {"weight": 3, "value": 4},
    {"weight": 4, "value": 5},
]
capacity = 5
```

#### Example Output
```
Maximum value: 7
Selected items: [0, 1]  (indices)
Total weight: 5
```

---

### 2. Web Demo
Visit the live demo to interactively solve the problem:  
👉 [https://knapsack-problem-solver.netlify.app/](https://knapsack-problem-solver.netlify.app/)

**How to use the web app**:
1. Enter item weights/values (comma-separated).
2. Set the knapsack capacity.
3. Click "Solve" to see the optimal solution.

---

## Algorithm
- **Dynamic Programming Table (`dp[i][w]`)**:
  - `i`: Number of items considered.
  - `w`: Current weight capacity.
  - `dp[i][w]`: Maximum value achievable with the first `i` items and capacity `w`.

- **Optimization**: Space complexity reduced to `O(W)` (1D array).

---

## Project Structure
```
.
├── knapsack.py          # Core solver (Python)
├── web-app/             # Source code for the Netlify demo (if public)
├── README.md
└── LICENSE
```

---

## License
[MIT](LICENSE) © [Md. Miskatul Masabi]  

