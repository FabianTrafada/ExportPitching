'use server';

// import { Resend } from 'resend';
import { FeedbackReadyEmailTemplate } from './email-templates/feedback-ready';
import { PracticeReminderEmailTemplate } from './email-templates/practice-reminder';
import { CreditUpdateEmailTemplate } from './email-templates/credit-update';
import { 
  FeedbackReadyEmailProps, 
  PracticeReminderEmailProps, 
  CreditUpdateEmailProps 
} from '@/types/type';

// Initialize Resend with API key
// const resend = new Resend(process.env.RESEND_API_KEY);

// Generic send email function
async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string;
  subject: string;
  react: React.ReactElement;
}) {
  try {
    // Email functionality temporarily disabled
    console.log('Email sending is currently disabled');
    console.log('Would send email to:', to);
    console.log('Subject:', subject);
    console.log('Content (React):', react);
    
    // Always return success without sending actual email
    return { success: true, messageId: 'email-disabled' };
    
    /* Original implementation (currently disabled)
    if (process.env.NODE_ENV !== 'production') {
      // In development, log the email content but don't actually send
      console.log('Would send email to:', to);
      console.log('Subject:', subject);
      console.log('Content (React):', react);
      return { success: true, messageId: 'dev-mode' };
    }
    
    // Send the email using Resend
    const { data, error } = await resend.emails.send({
      from: 'ExportPitch AI <notifications@exportpitch.ai>',
      to: [to],
      subject: subject,
      react: react,
    });
    
    if (error) {
      console.error('Error sending email with Resend:', error);
      return { success: false, error };
    }
    
    return { success: true, messageId: data?.id };
    */
  } catch (error) {
    console.error('Error in email function:', error);
    return { success: false, error };
  }
}

// Send feedback ready notification
export async function sendFeedbackReadyEmail(to: string, props: FeedbackReadyEmailProps) {
  return await sendEmail({
    to,
    subject: 'Your Pitch Feedback is Ready - ExportPitch AI',
    react: FeedbackReadyEmailTemplate(props),
  });
}

// Send practice reminder notification
export async function sendPracticeReminderEmail(to: string, props: PracticeReminderEmailProps) {
  return await sendEmail({
    to,
    subject: `It's Time to Practice Your Pitch - ExportPitch AI`,
    react: PracticeReminderEmailTemplate(props),
  });
}

// Send credit update notification
export async function sendCreditUpdateEmail(to: string, props: CreditUpdateEmailProps) {
  let subject = 'Account Credits Update - ExportPitch AI';
  
  if (props.creditsPurchased) {
    subject = 'Credits Added to Your Account - ExportPitch AI';
  } else if (props.creditsUsed) {
    subject = 'Credits Used for Feedback - ExportPitch AI';
  } else if (props.creditsRemaining < 3) {
    subject = 'Your Credits are Running Low - ExportPitch AI';
  }
  
  return await sendEmail({
    to,
    subject,
    react: CreditUpdateEmailTemplate(props),
  });
} 