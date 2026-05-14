import { motion } from 'framer-motion';

interface SectionDividerProps {
  variant?: 'wave' | 'curve' | 'angle';
  flip?: boolean;
  className?: string;
}

export function SectionDivider({ variant = 'wave', flip = false, className = '' }: SectionDividerProps) {
  const paths = {
    wave: 'M0,64 C200,120 400,0 600,64 C800,128 1000,0 1200,64 L1200,0 L0,0 Z',
    curve: 'M0,96 C400,0 800,192 1200,96 L1200,0 L0,0 Z',
    angle: 'M0,0 L1200,0 L1200,0 L0,64 Z',
  };

  return (
    <div className={`relative w-full overflow-hidden leading-[0] ${flip ? 'rotate-180' : ''} ${className}`}>
      <motion.svg
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="relative block w-full h-[60px] sm:h-[80px]"
      >
        <path
          d={paths[variant]}
          fill="currentColor"
          className="text-sand/30"
        />
      </motion.svg>
    </div>
  );
}
