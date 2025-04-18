
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ArrowRight, Mail, Phone, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Checkbox } from './ui/checkbox';
import { insertLead, Lead } from '../lib/supabase';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email' }),
  phone: z.string().optional(),
  consent: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface LeadCaptureFormProps {
  onSuccess: (lead: Lead) => void;
  leadSource?: string;
}

export function LeadCaptureForm({ onSuccess, leadSource = 'website' }: LeadCaptureFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      consent: true,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Create the lead object
      const lead: Lead = {
        name: values.name,
        email: values.email,
        phone: values.phone || '',
        lead_source: leadSource,
        consent: values.consent,
      };

      // Log for debugging
      console.log('Form values:', values);
      console.log('Submitting lead:', lead);

      // Insert the lead using our helper function
      const { data, error } = await insertLead(lead);

      // Handle errors
      if (error) {
        console.error('Error submitting form:', error);
        toast.error('Something went wrong. Please try again.');
        return;
      }

      // Success! Show toast and call the success handler
      console.log('Form submitted successfully:', data);
      toast.success('Thank you for signing up!');
      onSuccess(data!);
    } catch (error) {
      // Handle any unexpected errors
      console.error('Unexpected error submitting form:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      // Always reset the submitting state
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Your Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 h-4 w-4" />
                  <Input 
                    placeholder="John Doe" 
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40" 
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage className="text-pink-300" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Email Address</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 h-4 w-4" />
                  <Input 
                    placeholder="you@example.com" 
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40" 
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage className="text-pink-300" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Phone Number (Optional)</FormLabel>
              <FormControl>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 h-4 w-4" />
                  <Input 
                    placeholder="+1 (555) 123-4567" 
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40" 
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormMessage className="text-pink-300" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="consent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="border-white/40 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-normal text-white">
                  I agree to receive the free guide and occasional updates
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full group transition-all duration-300 ease-in-out bg-indigo-600 hover:bg-indigo-700 text-white" 
          disabled={isSubmitting}
          size="lg"
        >
          {isSubmitting ? 'Submitting...' : 'Get Your Free Guide'}
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>
    </Form>
  );
}