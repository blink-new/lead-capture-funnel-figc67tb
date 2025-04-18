
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LeadCaptureForm } from './components/LeadCaptureForm';
import { SuccessState } from './components/SuccessState';
import { LeadMagnetHeader } from './components/LeadMagnetHeader';
import { ProgressIndicator } from './components/ProgressIndicator';
import { Lead } from './lib/supabase';
import { Toaster } from './components/ui/sonner';

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [lead, setLead] = useState<Lead | null>(null);
  
  const handleFormSuccess = (submittedLead: Lead) => {
    setLead(submittedLead);
    setCurrentStep(1);
  };
  
  const leadMagnetConfig = {
    title: "Unlock the Secrets to Digital Marketing Success",
    subtitle: "Get our free guide with proven strategies that have helped businesses increase their conversion rates by up to 300%",
    highlights: ["Data-Driven Insights", "Actionable Strategies", "Expert Tips", "Real Case Studies"],
    downloadUrl: "/lead-magnet.pdf",
    downloadFileName: "digital-marketing-success-guide.pdf"
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white">
      <div className="w-full max-w-4xl">
        <motion.div 
          className="bg-black/20 backdrop-blur-lg rounded-2xl p-8 md:p-12 shadow-2xl border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LeadMagnetHeader 
            title={leadMagnetConfig.title}
            subtitle={leadMagnetConfig.subtitle}
            highlights={leadMagnetConfig.highlights}
          />
          
          <div className="mt-12">
            <ProgressIndicator currentStep={currentStep} totalSteps={2} />
            
            <AnimatePresence mode="wait">
              {currentStep === 0 ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-center"
                >
                  <LeadCaptureForm onSuccess={handleFormSuccess} />
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-center"
                >
                  <SuccessState 
                    lead={lead!} 
                    downloadUrl={leadMagnetConfig.downloadUrl}
                    downloadFileName={leadMagnetConfig.downloadFileName}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        
        <div className="text-center mt-8 text-white/60 text-sm">
          <p>© {new Date().getFullYear()} Your Company. All rights reserved.</p>
          <p className="mt-1">We respect your privacy and will never share your information.</p>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default App;