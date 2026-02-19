/**
 * Generate Clean Mathematical Explanation via Netlify Function Proxy
 */
export const generateExplanation = async (
    func: string,
    a: number,
    b: number,
    resultValue: number,
    intervals: number,
    error: number,
    isDouble: boolean = false,
    c?: number,
    d?: number
) => {
    let prompt = "";

    if (isDouble) {
        prompt = `
You are a modern AI Mathematics Tutor.

STRICT OUTPUT RULES:
- Use CLEAN Markdown formatting.
- No long paragraphs.
- Add spacing between every section.
- Use emojis for structure.
- Bold key terms.
- Use block LaTeX ($$ $$) for equations.

Solve the double integral:

$$ \\int_{${c}}^{${d}} \\int_{${a}}^{${b}} ${func} \\, dx \\, dy $$

---

# 🧠 STEP 1: Analytical Solution

### ✏️ 1.1 Inner Integral (with respect to x)

$$ \\int_{${a}}^{${b}} ${func} \\, dx $$

Treat 'y' as constant. Show integration steps.

### ✏️ 1.2 Outer Integral (with respect to y)

Integrate the result of 1.1 from ${c} to ${d}.

$$ \\int_{${c}}^{${d}} [Result] \\, dy $$

### ✅ Exact Volume

$$ = (Exact Answer) $$

**Decimal Approximation:** (Value)

---

# 🔢 STEP 2: Numerical Double Integration

- **Grid Size:** ${intervals} x ${intervals}
- **Numerical Volume:** ${resultValue}
- **Estimated Error:** ${error.toExponential(2)}

Explain that we summed volumes of ${intervals * intervals} prisms.

---

# 🎯 Conclusion

One short final sentence.
`;
    } else {
        // Single Integral Prompt
        prompt = `
You are a modern AI Mathematics Tutor.

STRICT OUTPUT RULES:
- Use CLEAN Markdown formatting.
- No long paragraphs.
- Add spacing between every section.
- Use emojis for structure.
- Bold key terms.
- Use block LaTeX ($$ $$) for equations.

Solve the definite integral:

$$ f(x) = ${func} $$
from a = ${a} to b = ${b}

---

# 🧠 STEP 1: Analytical Solution

### ✏️ 1.1 Find the Antiderivative

$$
F(x) = \\int ${func} \\, dx
$$

Show the integration rule clearly.

### ✏️ 1.2 Apply Fundamental Theorem of Calculus

$$
\\int_{${a}}^{${b}} ${func} \\, dx = F(${b}) - F(${a})
$$

Substitute values clearly and simplify step-by-step.

### ✅ Exact Result

$$
= (Exact Answer Here)
$$

**Decimal Approximation:**  
Show decimal value clearly.

---

# 🔢 STEP 2: Adaptive Trapezoidal Rule

- **Intervals Used:** ${intervals}
- **Numerical Result:** ${resultValue}
- **Estimated Error:** ${error.toExponential(2)}

Explain adaptive refinement in 2 short bullet points.

---

# 📊 Comparison Table

| Method | Result |
|--------|--------|
| Analytical | (Exact Value) |
| Numerical | ${resultValue} |

---

# 🎯 Final Conclusion

One short concluding sentence only.
`;
    }

    try {
        const response = await fetch("/api/gemini", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to fetch analytical solution");
        }

        const data = await response.json();
        return data.text;
    } catch (error) {
        console.error("Explanation generation failed:", error);
        return "⚠️ Unable to generate explanation. Please check your network or try again later.";
    }
};

/**
 * Legacy init function - no longer needed with Netlify Functions but kept for compatibility
 */
export const initGemini = (_apiKey: string) => {
    return true;
};

