import { FeedbackReadyEmailProps } from '@/types/type';
import React from 'react';

export const FeedbackReadyEmailTemplate = ({
  userName,
  templateName,
  feedbackId,
  score,
  strengths,
  improvements,
  date
}: FeedbackReadyEmailProps) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px', color: '#333' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#F59E0B', margin: '0' }}>ExportPitch</h1>
        <p style={{ fontSize: '16px', color: '#666' }}>AI-Powered Pitch Training</p>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>Your Feedback is Ready!</h2>
        <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '20px' }}>
          Hello {userName},
        </p>
        <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '20px' }}>
          Great job on completing your pitch practice session for <strong>{templateName}</strong>. 
          Your feedback is now available to review.
        </p>
      </div>
      
      <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#F59E0B' }}>Feedback Summary</h3>
        <p style={{ fontSize: '16px', marginBottom: '10px' }}>
          <strong>Overall Score:</strong> {score}/100
        </p>
        <p style={{ fontSize: '16px', marginBottom: '10px' }}>
          <strong>Date Submitted:</strong> {date}
        </p>
        
        <div style={{ marginTop: '20px' }}>
          <h4 style={{ fontSize: '16px', marginBottom: '10px' }}>Key Strengths:</h4>
          <ul style={{ paddingLeft: '20px' }}>
            {strengths.map((strength, index) => (
              <li key={index} style={{ fontSize: '14px', marginBottom: '5px' }}>{strength}</li>
            ))}
          </ul>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <h4 style={{ fontSize: '16px', marginBottom: '10px' }}>Areas for Improvement:</h4>
          <ul style={{ paddingLeft: '20px' }}>
            {improvements.map((improvement, index) => (
              <li key={index} style={{ fontSize: '14px', marginBottom: '5px' }}>{improvement}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <a 
          href={`https://exportpitch.ai/dashboard/my-feedback/${feedbackId}`}
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
          View Full Feedback
        </a>
      </div>
      
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