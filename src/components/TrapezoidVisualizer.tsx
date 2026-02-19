import React, { useMemo } from 'react';
import { evaluateFunction } from '../utils/solver';
import { motion } from 'framer-motion';

interface TrapezoidVisualizerProps {
    func: string;
    a: number;
    b: number;
    n: number;
}

const TrapezoidVisualizer: React.FC<TrapezoidVisualizerProps> = ({ func, a, b, n }) => {
    const width = 600;
    const height = 300;
    const padding = 40;

    // Generate data points for smooth curve
    const dataPoints = useMemo(() => {
        try {
            const points = [];
            const steps = 100; // Resolution for curve
            const step = (b - a) / steps;
            for (let i = 0; i <= steps; i++) {
                const x = a + i * step;
                const y = evaluateFunction(func, x);
                if (!isNaN(y) && isFinite(y)) {
                    points.push({ x, y });
                }
            }
            return points;
        } catch {
            return [];
        }
    }, [func, a, b]);

    // Determine scaling
    const scales = useMemo(() => {
        if (dataPoints.length === 0) return null;
        const xValues = dataPoints.map(p => p.x);
        const yValues = dataPoints.map(p => p.y);
        // Include 0 in y-range for area visual
        const minX = Math.min(...xValues);
        const maxX = Math.max(...xValues);
        const minY = Math.min(0, ...yValues);
        const maxY = Math.max(0, ...yValues);

        const rangeX = maxX - minX || 1;
        const rangeY = maxY - minY || 1;

        const scaleX = (val: number) => padding + ((val - minX) / rangeX) * (width - 2 * padding);
        const scaleY = (val: number) => height - padding - ((val - minY) / rangeY) * (height - 2 * padding);

        return { scaleX, scaleY, minX, maxX, minY, maxY };
    }, [dataPoints]);

    if (!scales) return <div className="text-slate-400 text-center py-10">Invalid function or range</div>;

    const { scaleX, scaleY } = scales;

    // Generate SVG path for the curve
    const curvePath = `M ${dataPoints.map(p => `${scaleX(p.x)},${scaleY(p.y)}`).join(' L ')}`;

    // Generate trapezoids
    const trapezoids = [];
    const h = (b - a) / n;
    for (let i = 0; i < n; i++) {
        const x1 = a + i * h;
        const x2 = a + (i + 1) * h;
        const y1 = evaluateFunction(func, x1);
        const y2 = evaluateFunction(func, x2);

        trapezoids.push(
            <motion.polygon
                key={i}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 0.5, scaleY: 1 }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                points={`
          ${scaleX(x1)},${scaleY(0)} 
          ${scaleX(x1)},${scaleY(y1)} 
          ${scaleX(x2)},${scaleY(y2)} 
          ${scaleX(x2)},${scaleY(0)}
        `}
                className="fill-cyan-500/30 stroke-cyan-400/50 stroke-[1]"
            />
        );
    }

    return (
        <div className="w-full bg-slate-900/50 rounded-xl overflow-hidden border border-slate-800 backdrop-blur-sm">
            <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
                {/* Grids / Axes */}
                <line x1={padding} y1={scaleY(0)} x2={width - padding} y2={scaleY(0)} stroke="#475569" strokeWidth="2" />
                <line x1={scaleX(0) > padding && scaleX(0) < width - padding ? scaleX(0) : padding} y1={padding} x2={scaleX(0) > padding && scaleX(0) < width - padding ? scaleX(0) : padding} y2={height - padding} stroke="#475569" strokeWidth="2" />

                {/* Trapezoids */}
                {trapezoids}

                {/* Function Curve */}
                <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    d={curvePath}
                    fill="none"
                    className="stroke-cyan-400 stroke-[3]"
                />

                {/* Labels for limits */}
                <text x={scaleX(a)} y={height - 10} fill="#94a3b8" textAnchor="middle" fontSize="12">a={a}</text>
                <text x={scaleX(b)} y={height - 10} fill="#94a3b8" textAnchor="middle" fontSize="12">b={b}</text>
            </svg>
        </div>
    );
};

export default TrapezoidVisualizer;
