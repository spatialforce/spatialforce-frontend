// src/components/PageTransition.jsx
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import React from 'react';

const pageVariants = {
  initial: {
    opacity: 0,
    x: -100,
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: 100,
  }
};

const pageTransition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  duration: 0.5
};

const PageTransition = ({ children }) => {
  const location = useLocation();
  
  return (
    <motion.div
      key={location.pathname}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;