import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground: React.FC = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-950">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0)_0%,rgba(2,6,23,1)_100%)]" />

            {/* Animated Orbs */}
            <motion.div
                animate={{
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
            />
            <motion.div
                animate={{
                    x: [0, -150, 0],
                    y: [0, 100, 0],
                    scale: [1, 1.5, 1],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
            />
            <motion.div
                animate={{
                    x: [0, 50, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
                className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl"
            />

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>
    );
};

export default AnimatedBackground;
