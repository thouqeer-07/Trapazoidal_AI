import { evaluate } from 'mathjs';

export interface SolverResult {
    value: number;
    intervals: number;
    errorEstimate: number;
    isConverged: boolean;
    history?: { n: number; value: number; error: number }[];
}

/**
 * Evaluates a mathematical function string at a specific x value.
 */
/**
 * Evaluates a mathematical function string at a specific x (and optional y) value.
 */
export const evaluateFunction = (expression: string, x: number, y?: number): number => {
    try {
        const scope = { x, y, e: Math.E, pi: Math.PI };
        return evaluate(expression, scope);
    } catch (error) {
        console.error("Evaluation error:", error);
        return NaN;
    }
};

/**
 * Basic Trapezoidal Rule implementation for n intervals.
 */
export const trapezoidalRule = (
    expression: string,
    a: number,
    b: number,
    n: number
): number => {
    const h = (b - a) / n;
    let sum = evaluateFunction(expression, a) + evaluateFunction(expression, b);

    for (let i = 1; i < n; i++) {
        const x = a + i * h;
        sum += 2 * evaluateFunction(expression, x);
    }

    return (h / 2) * sum;
};

/**
 * Adaptive Trapezoidal Rule Solver.
 * Doubles intervals until the estimated error is within tolerance or max iterations reached.
 */
export const adaptiveTrapezoidalSolver = (
    expression: string,
    a: number,
    b: number,
    tolerance: number = 1e-6,
    maxIterations: number = 20
): SolverResult => {
    let n = 1;
    let integralPrev = trapezoidalRule(expression, a, b, n);
    const history = [{ n, value: integralPrev, error: Infinity }];

    for (let i = 0; i < maxIterations; i++) {
        n *= 2;
        const integralCurr = trapezoidalRule(expression, a, b, n);

        // Error estimation using Runge's principle for Trapezoidal Rule (Order 2)
        // Error approx 1/3 * |T_2n - T_n|
        const error = (1 / 3) * Math.abs(integralCurr - integralPrev);

        history.push({ n, value: integralCurr, error });

        if (error < tolerance) {
            return {
                value: integralCurr,
                intervals: n,
                errorEstimate: error,
                isConverged: true,
                history
            };
        }

        integralPrev = integralCurr;
    }

    return {
        value: integralPrev,
        intervals: n,
        errorEstimate: (1 / 3) * Math.abs(history[history.length - 1].value - history[history.length - 2].value), // Best guess
        isConverged: false,
        history
    };
};

/**
 * Double Trapezoidal Rule implementation for n x n grid.
 */
export const doubleTrapezoidalRule = (
    expression: string,
    a: number, // x lower
    b: number, // x upper
    c: number, // y lower
    d: number, // y upper
    n: number
): number => {
    const dx = (b - a) / n;
    const dy = (d - c) / n;
    let sum = 0;

    for (let i = 0; i <= n; i++) {
        for (let j = 0; j <= n; j++) {
            const x = a + i * dx;
            const y = c + j * dy;

            let weight = 4; // Default interior

            const isEdgeX = (i === 0 || i === n);
            const isEdgeY = (j === 0 || j === n);

            if (isEdgeX && isEdgeY) {
                weight = 1; // Corner
            } else if (isEdgeX || isEdgeY) {
                weight = 2; // Edge
            }

            sum += weight * evaluateFunction(expression, x, y);
        }
    }

    return (dx * dy / 4) * sum;
};

/**
 * Adaptive Double Trapezoidal Rule Solver.
 */
export const adaptiveDoubleTrapezoidalSolver = (
    expression: string,
    a: number,
    b: number,
    c: number,
    d: number,
    tolerance: number = 1e-5, // Slightly looser tolerance for 2D
    maxIterations: number = 10
): SolverResult => {
    let n = 2; // Start with 2x2
    let integralPrev = doubleTrapezoidalRule(expression, a, b, c, d, n);
    const history = [{ n, value: integralPrev, error: Infinity }];

    for (let i = 0; i < maxIterations; i++) {
        n *= 2;
        const integralCurr = doubleTrapezoidalRule(expression, a, b, c, d, n);
        const error = (1 / 3) * Math.abs(integralCurr - integralPrev);
        history.push({ n, value: integralCurr, error });

        if (error < tolerance) {
            return { value: integralCurr, intervals: n, errorEstimate: error, isConverged: true, history };
        }
        integralPrev = integralCurr;
    }

    return {
        value: integralPrev,
        intervals: n,
        errorEstimate: (1 / 3) * Math.abs(history[history.length - 1].value - history[history.length - 2].value),
        isConverged: false,
        history
    };
};
