import { motion } from 'framer-motion';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  script?: string;
  centered?: boolean;
}

export function SectionHeader({ title, subtitle, script, centered = true }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className={centered ? 'text-center mb-12' : 'mb-12'}
    >
      {script && (
        <span className="block font-script text-2xl text-secondary mb-2">{script}</span>
      )}
      <h2 className="font-display text-3xl sm:text-4xl font-semibold text-dark mb-3">{title}</h2>
      {subtitle && <p className="text-dark/60 max-w-xl mx-auto">{subtitle}</p>}
    </motion.div>
  );
}
