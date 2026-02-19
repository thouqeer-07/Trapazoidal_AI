# 📐 Trapezoidal AI

**Trapezoidal AI** is a state-of-the-art numerical integration platform that combines classic calculus algorithms with modern artificial intelligence. It provides high-precision solutions for both single and double integrals while offering deep, AI-generated analytical insights.

---

## 🚀 Overview

The project aims to make advanced calculus intuitive and accessible. By using an **Adaptive Trapezoidal Solver**, the application ensures that results are mathematically accurate to your specified tolerance, while the **Gemini AI engine** bridge the gap between numerical approximation and symbolic theory.

---

## ✨ Key Features

-   **Adaptive Numerical Engine**: Automatically doubles intervals and grid points until the required precision is reached.
-   **Double Integral Support**: Solve volume integrals over rectangular regions with ease.
-   **AI-Powered Explanations**: Get step-by-step analytical walkthroughs, antiderivative derivations, and error analysis.
-   **Dynamic Visualizations**: See the "geometry of calculus" with interactive trapezoidal grid visualizations.
-   **Premium Modern UI**: Built with React, Tailwind CSS, and Framer Motion for a smooth, high-end experience.
-   **Netlify-Ready Security**: Fully secured with serverless functions to keep API keys safe.

---

## 🛠️ How It Works (Step-by-Step)

### 1. Function Formulation
The user inputs a mathematical expression (e.g., `x^2`, `sin(x) * cos(y)`) and defines the integration limits. The app uses `mathjs` to parse and evaluate these functions safely.

### 2. Adaptive Numerical Solving
The core engine (`solver.ts`) initiates the **Adaptive Trapezoidal Rule**:
-   It starts with a minimal number of intervals.
-   It calculates the integral and then doubles the number of intervals.
-   It compares the two results using **Runge's Principle** to estimate the error.
-   This process repeats until the error is smaller than your chosen **Tolerance**.

### 3. Secure AI Request
Once the numerical result is locked in, the app sends the problem to a **Netlify Function** (`/api/gemini`). This ensures that the Google Gemini API key remains hidden from the browser, preventing unauthorized use.

### 4. Mathematical Synthesis
The Gemini AI analyzes the specific integral and generates a structured response including:
-   **Analytical Solution**: The "by-hand" calculus steps and antiderivatives.
-   **Fundamental Theorem**: Substitution of limits and exact value calculation.
-   **Method Comparison**: Comparison of the Exact vs. Numerical results.

### 5. Visual Rendering
The results are displayed with a sleek typewriter animation and a corresponding geometric visualization of the integral's area or grid.

---

## 💻 Tech Stack

-   **Frontend**: React 19, Vite, TypeScript
-   **Styling**: Tailwind CSS, Framer Motion (Animations)
-   **Math**: Math.js, KaTeX (LaTeX rendering)
-   **AI**: Google Gemini Pro via Netlify Functions
-   **Deployment**: Netlify

---

## 🏁 Getting Started

1.  **Clone & Install**:
    ```bash
    npm install
    ```
2.  **Environment Setup**:
    Create a `.env` file with your Gemini API key (only needed for local testing):
    ```env
    VITE_GEMINI_API_KEY=your_key_here
    ```
3.  **Run Development**:
    ```bash
    npm run dev
    ```