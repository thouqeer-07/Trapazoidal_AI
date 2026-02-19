
import AnimatedBackground from './components/AnimatedBackground';
import SolverCard from './components/SolverCard';
import { motion } from 'framer-motion';

function App() {
  return (
    <div className="relative min-h-screen text-slate-200 selection:bg-cyan-500/30">
      <AnimatedBackground />

      <main className="container mx-auto px-4 py-12 relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12 space-y-4"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-2xl">
            Trapezoidal AI
          </h1>
          <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto">
            Solve definite integrals with Adaptive Interval Optimization and get instant
            AI-powered mathematical insights.
          </p>
        </motion.div>

        <SolverCard />

        <footer className="mt-20 text-slate-600 text-sm">
        </footer>
      </main>
    </div>
  );
}

export default App;
