import { CreditUpdateEmailProps } from '@/types/type';
import React from 'react';

export const CreditUpdateEmailTemplate = ({
  userName,
  creditsRemaining,
  creditsUsed,
  creditsPurchased,
  promoCode,
  promoDiscount,
}: CreditUpdateEmailProps) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px', color: '#333' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#F59E0B', margin: '0' }}>ExportPitch</h1>
        <p style={{ fontSize: '16px', color: '#666' }}>AI-Powered Pitch Training</p>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        {creditsPurchased ? (
          <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>Credits Added to Your Account</h2>
        ) : creditsUsed ? (
          <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>Credits Used for Feedback</h2>
        ) : (
          <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>Your Credits are Running Low</h2>
        )}
        
        <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '20px' }}>
          Hello {userName},
        </p>
        
        {creditsPurchased ? (
          <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '20px' }}>
            Great news! {creditsPurchased} {creditsPurchased === 1 ? 'credit has' : 'credits have'} been added to your account.
          </p>
        ) : creditsUsed ? (
          <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '20px' }}>
            You recently used {creditsUsed} {creditsUsed === 1 ? 'credit' : 'credits'} to generate AI feedback.
          </p>
        ) : (
          <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '20px' }}>
            Your account currently has {creditsRemaining} {creditsRemaining === 1 ? 'credit' : 'credits'} remaining. 
            Consider purchasing more credits to continue receiving AI feedback on your practice sessions.
          </p>
        )}
      </div>
      
      <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#F59E0B' }}>Account Summary</h3>
        <p style={{ fontSize: '16px', marginBottom: '10px' }}>
          <strong>Available Credits:</strong> {creditsRemaining}
        </p>
        {creditsUsed && (
          <p style={{ fontSize: '16px', marginBottom: '10px' }}>
            <strong>Credits Used:</strong> {creditsUsed}
          </p>
        )}
        {creditsPurchased && (
          <p style={{ fontSize: '16px', marginBottom: '10px' }}>
            <strong>Credits Purchased:</strong> {creditsPurchased}
          </p>
        )}
      </div>
      
      {(creditsRemaining < 3 || promoCode) && (
        <div style={{ marginBottom: '30px' }}>
          {promoCode && (
            <div style={{ background: '#FEF3C7', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px dashed #F59E0B' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#B45309' }}>Special Offer!</h3>
              <p style={{ fontSize: '16px', lineHeight: '1.5' }}>
                Use code <strong style={{ color: '#B45309' }}>{promoCode}</strong> to get {promoDiscount}% off your next credit purchase.
              </p>
            </div>
          )}
          
          <div style={{ textAlign: 'center' }}>
            <a 
              href="https://exportpitch.ai/dashboard/credits"
              style={{
                display: 'inline-block',
                backgroundColor: '#F59E0B',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '4px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              Buy More Credits
            </a>
          </div>
        </div>
      )}
      
      <div style={{ marginTop: '40px', borderTop: '1px solid #eaeaea', paddingTop: '20px', fontSize: '14px', color: '#666', textAlign: 'center' }}>
        <p>
          You received this email because you have email notifications enabled in your 
          <a href="https://exportpitch.ai/dashboard/settings" style={{ color: '#F59E0B' }}> account settings</a>.
        </p>
        <p>© 2023 ExportPitch AI. All rights reserved.</p>
      </div>
    </div>
  );
}; 