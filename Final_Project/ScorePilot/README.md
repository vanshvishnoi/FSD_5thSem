# AMCAT Score Calculator — React Frontend

A frontend implementation of the supplied C++ weighted-score calculator.

## Requirements
- Node.js 18 or later
- npm

## Run locally
1. Extract the project ZIP.
2. Open the project folder in VS Code.
3. Open the terminal in that folder.
4. Install dependencies:

   ```bash
   npm install
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the local URL printed by Vite (usually http://localhost:5173).

## Build for production

```bash
npm run build
```

## Scoring formula
- Computer Programming: 15%
- Automata: 25%
- English Comprehension: 10%
- Quantitative Ability (Advanced): 10%
- Automata Fix: 20%
- Computer Science: 5%
- Logical Ability: 15%

The app validates section scores from 0 to 100, prevents duplicate candidate names (case-insensitive), and saves records in browser LocalStorage. No backend or database is required.

## Project structure

```text
amcat-score-calculator/
├── index.html
├── package.json
├── README.md
└── src/
    ├── App.jsx
    ├── main.jsx
    └── styles.css
```
