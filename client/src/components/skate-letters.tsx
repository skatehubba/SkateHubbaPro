import { motion } from "framer-motion";

interface SkateLettersProps {
  letters: string;
  className?: string;
  animated?: boolean;
}

const SKATE_LETTERS = ['S', 'K', 'A', 'T', 'E'];

export default function SkateLetters({ letters, className = "", animated = false }: SkateLettersProps) {
  return (
    <div className={`flex space-x-1 ${className}`} data-testid="skate-letters">
      {SKATE_LETTERS.map((letter, index) => {
        const hasLetter = letters.includes(letter);
        
        const LetterComponent = animated ? motion.div : 'div';
        const motionProps = animated ? {
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          transition: { delay: index * 0.1 }
        } : {};
        
        return (
          <LetterComponent
            key={letter}
            className={`skate-letter ${hasLetter ? 'earned' : 'remaining'}`}
            data-testid={`skate-letter-${letter.toLowerCase()}`}
            {...motionProps}
          >
            {letter}
          </LetterComponent>
        );
      })}
    </div>
  );
}
