
import { motion } from 'framer-motion';

interface LeadMagnetHeaderProps {
  title: string;
  subtitle: string;
  highlights?: string[];
}

export function LeadMagnetHeader({ title, subtitle, highlights = [] }: LeadMagnetHeaderProps) {
  return (
    <div className="text-center space-y-6 max-w-2xl mx-auto">
      <motion.h1 
        className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.h1>
      
      <motion.p 
        className="text-xl text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {subtitle}
      </motion.p>
      
      {highlights.length > 0 && (
        <motion.div 
          className="flex flex-wrap justify-center gap-4 pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {highlights.map((highlight, index) => (
            <motion.div 
              key={index}
              className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
            >
              {highlight}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}