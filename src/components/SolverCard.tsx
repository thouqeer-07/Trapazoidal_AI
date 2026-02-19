import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, ChevronRight, Sparkles, AlertCircle, Layers, Grid } from 'lucide-react';
import MathInput from './MathInput';
import TrapezoidVisualizer from './TrapezoidVisualizer';
import { adaptiveTrapezoidalSolver, adaptiveDoubleTrapezoidalSolver, type SolverResult } from '../utils/solver';
import { generateExplanation } from '../services/gemini';
import TypewriterMarkdown from './TypewriterMarkdown';

const SolverCard: React.FC = () => {
    const [mode, setMode] = useState<'single' | 'double'>('single');
    const [func, setFunc] = useState('x^2 + y^2');
    const [a, setA] = useState('0');
    const [b, setB] = useState('1');
    const [c, setC] = useState('0');
    const [d, setD] = useState('1');
    const [tolerance, setTolerance] = useState('1e-5');


    const [result, setResult] = useState<SolverResult | null>(null);
    const [explanation, setExplanation] = useState<string | null>(null);
    const [loadingAI, setLoadingAI] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showFinalResults, setShowFinalResults] = useState(false);
    const resultsRef = useRef<HTMLDivElement>(null);

    const handleSolve = async () => {
        setError(null);
        setExplanation(null);
        setResult(null);
        setShowFinalResults(false);
        setLoadingAI(true);

        try {
            const aVal = parseFloat(a);
            const bVal = parseFloat(b);
            const cVal = parseFloat(c);
            const dVal = parseFloat(d);
            const tolVal = parseFloat(tolerance);

            if (isNaN(aVal) || isNaN(bVal) || isNaN(tolVal) || (mode === 'double' && (isNaN(cVal) || isNaN(dVal)))) {
                setError("Please enter valid numbers for all limits and tolerance.");
                setLoadingAI(false);
                return;
            }

            // Small delay to allow UI to reset before scrolling
            await new Promise(r => setTimeout(r, 100));

            // Scroll to results area immediately to show loading state
            if (resultsRef.current) {
                resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            let res: SolverResult;
            if (mode === 'double') {
                res = adaptiveDoubleTrapezoidalSolver(func, aVal, bVal, cVal, dVal, tolVal);
            } else {
                res = adaptiveTrapezoidalSolver(func, aVal, bVal, tolVal);
            }

            setResult(res);

            const explanationText = await generateExplanation(
                func, aVal, bVal, res.value, res.intervals, res.errorEstimate,
                mode === 'double', cVal, dVal
            );
            setExplanation(explanationText);
        } catch (err) {
            setError("Error solving integral. Please check your function syntax (use x and y for double integrals).");
            console.error(err);
        } finally {
            setLoadingAI(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-12">
            {/* Input Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-6 rounded-2xl shadow-2xl space-y-6"
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-3">
                        <div className="bg-cyan-500/20 p-2.5 rounded-lg border border-cyan-500/30">
                            <Calculator className="text-cyan-400" size={24} />
                        </div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            Configuration
                        </h2>
                    </div>

                    {/* Mode Toggle */}
                    <div className="bg-slate-800/50 p-1 rounded-xl flex items-center border border-slate-700/50">
                        <button
                            onClick={() => { setMode('single'); setFunc('x^2'); }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${mode === 'single'
                                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/20'
                                : 'text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            <Layers size={16} /> Single Integral
                        </button>
                        <button
                            onClick={() => { setMode('double'); setFunc('x^2 + y^2'); }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${mode === 'double'
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                                : 'text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            <Grid size={16} /> Double Integral
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <MathInput
                        label={`Function f(${mode === 'double' ? 'x, y' : 'x'})`}
                        value={func}
                        onChange={(e) => setFunc(e.target.value)}
                        placeholder={mode === 'double' ? "e.g., x^2 + y^2, sin(x)*cos(y)" : "e.g., x^2, sin(x), e^x"}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <MathInput
                            label="Limits for x (a to b)"
                            value={a}
                            onChange={(e) => setA(e.target.value)}
                            type="number"
                            placeholder="Lower Limit a"
                        />
                        <MathInput
                            label="&nbsp;" // Spacer label
                            value={b}
                            onChange={(e) => setB(e.target.value)}
                            type="number"
                            placeholder="Upper Limit b"
                        />
                    </div>

                    {mode === 'double' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="grid grid-cols-2 gap-4"
                        >
                            <MathInput
                                label="Limits for y (c to d)"
                                value={c}
                                onChange={(e) => setC(e.target.value)}
                                type="number"
                                placeholder="Lower Limit c"
                            />
                            <MathInput
                                label="&nbsp;" // Spacer
                                value={d}
                                onChange={(e) => setD(e.target.value)}
                                type="number"
                                placeholder="Upper Limit d"
                            />
                        </motion.div>
                    )}

                    <MathInput
                        label="Tolerance"
                        value={tolerance}
                        onChange={(e) => setTolerance(e.target.value)}
                        placeholder="e.g., 1e-6"
                    />
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg flex items-center gap-2 text-sm">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <button
                    onClick={handleSolve}
                    disabled={loadingAI}
                    className={`w-full group text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${mode === 'double'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 hover:shadow-purple-500/25'
                        : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 hover:shadow-cyan-500/25'
                        }`}
                >
                    {loadingAI ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                    )}
                    {loadingAI ? 'Solving...' : 'Solve Integral'}
                    {!loadingAI && <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </button>
            </motion.div>

            {/* Results Container */}
            <div ref={resultsRef} className="scroll-mt-24 min-h-[50vh]">
                <AnimatePresence mode="wait">
                    {(loadingAI || explanation) && (
                        <motion.div
                            key="solution"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            {/* AI Explanation Section */}
                            <div className={`bg-slate-900/80 border p-6 rounded-2xl relative overflow-hidden shadow-2xl ${mode === 'double' ? 'border-purple-500/30' : 'border-cyan-500/30'
                                }`}>
                                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${mode === 'double' ? 'from-purple-500 to-pink-500' : 'from-cyan-500 to-blue-500'
                                    }`} />
                                <h3 className={`text-xl font-semibold mb-6 flex items-center gap-2 border-b pb-4 ${mode === 'double' ? 'text-purple-300 border-purple-500/20' : 'text-cyan-300 border-cyan-500/20'
                                    }`}>
                                    <Sparkles size={20} />
                                    Step-by-Step Solution
                                </h3>

                                {loadingAI ? (
                                    <div className="space-y-4 animate-pulse">
                                        <div className="h-4 bg-slate-800 rounded w-3/4" />
                                        <div className="h-4 bg-slate-800 rounded w-1/2" />
                                        <div className="h-4 bg-slate-800 rounded w-5/6" />
                                        <div className="h-4 bg-slate-800 rounded w-2/3" />
                                    </div>
                                ) : (
                                    <div className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed font-light">
                                        <TypewriterMarkdown
                                            content={explanation || ''}
                                            speed={1}
                                            onComplete={() => setShowFinalResults(true)}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Final Results Section */}
                            {showFinalResults && result && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="space-y-6"
                                >
                                    <h3 className="text-2xl font-bold text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                        Final Results & Visualization
                                    </h3>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-cyan-500/50 transition-colors">
                                            <p className="text-slate-400 text-sm">{mode === 'double' ? 'Volume Result' : 'Area Result'}</p>
                                            <p className="text-2xl font-mono text-cyan-400 font-bold truncate" title={result.value.toString()}>
                                                {result.value.toPrecision(8)}
                                            </p>
                                        </div>
                                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-cyan-500/50 transition-colors">
                                            <p className="text-slate-400 text-sm">Grid/Intervals</p>
                                            <p className="text-2xl font-mono text-white font-bold">
                                                {mode === 'double' ? `${result.intervals}x${result.intervals}` : result.intervals}
                                            </p>
                                        </div>
                                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-cyan-500/50 transition-colors">
                                            <p className="text-slate-400 text-sm">Est. Error</p>
                                            <p className="text-lg font-mono text-yellow-400 truncate" title={result.errorEstimate.toString()}>
                                                {result.errorEstimate.toExponential(2)}
                                            </p>
                                        </div>
                                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-cyan-500/50 transition-colors">
                                            <p className="text-slate-400 text-sm">Convergence</p>
                                            <p className={`text-lg font-bold ${result.isConverged ? 'text-green-400' : 'text-orange-400'}`}>
                                                {result.isConverged ? 'Converged' : 'Max Iter'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Visualization - Single Only for now */}
                                    {mode === 'single' ? (
                                        <TrapezoidVisualizer func={func} a={parseFloat(a)} b={parseFloat(b)} n={result.intervals} />
                                    ) : (
                                        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-8 text-center text-slate-400">
                                            <Grid className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                            <p>3D Volume Visualization is not yet supported in this version.</p>
                                            <p className="text-sm mt-2">The calculated volume is <b>{result.value.toPrecision(6)}</b>.</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SolverCard;
