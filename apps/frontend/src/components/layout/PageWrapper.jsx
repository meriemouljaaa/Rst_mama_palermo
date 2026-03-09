import { motion } from 'framer-motion';
import logoImg from "../../assets/logo-loading.png";

const PageWrapper = ({ children }) => {
    return (
        <>
            {/* 1. Static Brand Backdrop to prevent layout flashes */}
            <div style={{ position: 'fixed', inset: 0, backgroundColor: '#00513e', zIndex: -1 }} />

            {/* 2. The Signature Shutter Transition - Optimized */}
            <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                style={{
                    position: 'fixed',
                    inset: 0,
                    display: 'flex',
                    zIndex: 10000,
                    pointerEvents: 'none'
                }}
            >
                {/* Left Panel (Green) */}
                <motion.div
                    variants={{
                        initial: { x: '-100%' },
                        animate: { x: '-100%' },
                        exit: { x: 0 }
                    }}
                    transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                    style={{
                        flex: 1,
                        backgroundColor: '#00513e',
                        willChange: 'transform' // Hardware acceleration hint
                    }}
                />

                {/* Right Panel (Red) */}
                <motion.div
                    variants={{
                        initial: { x: '100%' },
                        animate: { x: '100%' },
                        exit: { x: 0 }
                    }}
                    transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                    style={{
                        flex: 1,
                        backgroundColor: '#C03434',
                        willChange: 'transform'
                    }}
                />

                {/* Center Logo Pulse */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <motion.div
                        variants={{
                            initial: { scale: 0, opacity: 0 },
                            animate: { scale: 0, opacity: 0 },
                            exit: { scale: 1, opacity: 1 }
                        }}
                        transition={{ duration: 0.3, delay: 0.2, ease: 'easeOut' }}
                        className="bg-white p-4 rounded-full shadow-2xl"
                    >
                        <img src={logoImg} alt="Mamma Palermo" className="w-16 h-16 object-contain" />
                    </motion.div>
                </div>
            </motion.div>

            {/* 3. The Re-Opening Shutter (For Entrance) - Smoother & Faster */}
            <motion.div
                initial="initial"
                animate="animate"
                style={{
                    position: 'fixed',
                    inset: 0,
                    display: 'flex',
                    zIndex: 9999,
                    pointerEvents: 'none'
                }}
            >
                <motion.div
                    initial={{ x: 0 }}
                    animate={{ x: '-100%' }}
                    transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                    style={{ flex: 1, backgroundColor: '#00513e', willChange: 'transform' }}
                />
                <motion.div
                    initial={{ x: 0 }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                    style={{ flex: 1, backgroundColor: '#C03434', willChange: 'transform' }}
                />
            </motion.div>

            {/* 4. Optimized Content Entrance (No heavy filters like Blur) */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{
                    duration: 0.4,
                    ease: 'easeOut',
                    delay: 0.1 // Slight delay so it appears while shutters opening
                }}
                style={{
                    width: '100%',
                    position: 'relative',
                    zIndex: 1
                }}
            >
                {children}
            </motion.div>

            <style dangerouslySetInnerHTML={{
                __html: `
        body { background-color: #00513e; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #00513e; }
        ::-webkit-scrollbar-thumb { background: #C03434; border-radius: 10px; }
      `}} />
        </>
    );
};

export default PageWrapper;
