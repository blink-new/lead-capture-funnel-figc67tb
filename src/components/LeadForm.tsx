
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Download, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase, type Lead } from '@/lib/supabase';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().optional(),
  consent: z.boolean().refine(val => val === true, {
    message: 'You must agree to receive communications',
  }),
});

type FormData = z.infer<typeof formSchema>;

const LEAD_SOURCE = 'website_funnel';

export function LeadForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });

  const watchedFields = watch();
  
  const nextStep = async () => {
    const result = await trigger(['name', 'email']);
    if (result) setStep(2);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const lead: Lead = {
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        consent: data.consent,
        lead_source: LEAD_SOURCE,
      };
      
      const { data: insertedLead, error } = await supabase
        .from('leads')
        .insert(lead)
        .select('id')
        .single();
      
      if (error) throw error;
      
      setLeadId(insertedLead?.id || null);
      setIsSuccess(true);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async () => {
    if (!leadId) return;
    
    try {
      // Mark lead as having downloaded the resource
      await supabase
        .from('leads')
        .update({ downloaded: true })
        .eq('id', leadId);
      
      // In a real app, you would trigger the download here
      // For demo purposes, we'll just open a new tab with a sample PDF
      window.open('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '_blank');
    } catch (error) {
      console.error('Error updating download status:', error);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  if (isSuccess) {
    return (
      <motion.div
        className="w-full max-w-md mx-auto p-8 rounded-xl bg-white/95 shadow-xl"
        initial="hidden"
        animate="visible"
        variants={formVariants}
      >
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            Your free resource is ready to download.
          </p>
          <Button 
            onClick={handleDownload}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Download className="mr-2 h-5 w-5" />
            Download Your Free Guide
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="w-full max-w-md mx-auto p-8 rounded-xl bg-white/95 shadow-xl"
      initial="hidden"
      animate="visible"
      variants={formVariants}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {step === 1 ? "Get Your Free Guide" : "Almost There!"}
        </h2>
        <p className="text-gray-600">
          {step === 1 
            ? "Enter your details to receive our exclusive resource." 
            : "Just a few more details to complete your request."}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                {...register('name')}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <Button
              type="button"
              onClick={nextStep}
              disabled={!watchedFields.name || !watchedFields.email || !!errors.name || !!errors.email}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Continue
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input
                id="phone"
                placeholder="+1 (555) 123-4567"
                {...register('phone')}
              />
            </div>

            <div className="flex items-start space-x-2 py-2">
              <Checkbox
                id="consent"
                {...register('consent')}
                className="mt-1"
              />
              <Label
                htmlFor="consent"
                className="text-sm font-normal leading-tight text-gray-600"
              >
                I agree to receive communications about products, services, and events.
              </Label>
            </div>
            {errors.consent && (
              <p className="text-red-500 text-sm mt-1">{errors.consent.message}</p>
            )}

            <div className="pt-2 space-y-3">
              <Button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    <Mail className="mr-2 h-5 w-5" />
                    Get Your Free Guide
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep(1)}
                className="w-full text-gray-600 hover:text-gray-800"
              >
                Back
              </Button>
            </div>
          </motion.div>
        )}
      </form>
    </motion.div>
  );
}