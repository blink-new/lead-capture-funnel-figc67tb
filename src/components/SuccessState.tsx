
import { useState } from 'react';
import { Download, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { supabase, Lead } from '../lib/supabase';
import { toast } from 'sonner';

interface SuccessStateProps {
  lead: Lead;
  downloadUrl: string;
  downloadFileName: string;
}

export function SuccessState({ lead, downloadUrl, downloadFileName }: SuccessStateProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      console.log('Starting download for lead:', lead);
      
      // Mark as downloaded in Supabase
      if (lead.id) {
        const { error } = await supabase
          .from('leads')
          .update({ downloaded: true })
          .eq('id', lead.id);
          
        if (error) {
          console.error('Error updating download status:', error);
          // Continue with download even if update fails
        } else {
          console.log('Updated download status for lead:', lead.id);
        }
      }
      
      // Trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = downloadFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Your download has started!');
    } catch (error) {
      console.error('Error during download:', error);
      toast.error('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="text-center space-y-6 w-full max-w-md">
      <div className="flex justify-center">
        <CheckCircle className="h-16 w-16 text-green-400" />
      </div>
      
      <h2 className="text-2xl font-bold text-white">Thank You!</h2>
      
      <p className="text-white/80">
        Your free guide is ready to download. We've also sent a copy to your email for future reference.
      </p>
      
      <Button 
        onClick={handleDownload} 
        className="w-full group bg-green-500 hover:bg-green-600 text-white" 
        disabled={isDownloading}
        size="lg"
      >
        {isDownloading ? 'Downloading...' : 'Download Your Guide'}
        <Download className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
      </Button>
      
      <p className="text-sm text-white/60">
        Having trouble? Check your spam folder or contact our support team.
      </p>
    </div>
  );
}