import { PracticeReminderEmailProps } from '@/types/type';
import React from 'react';



export const PracticeReminderEmailTemplate = ({
  userName,
  daysSinceLastPractice,
  suggestedTemplates,
  tipOfTheDay,
}: PracticeReminderEmailProps) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px', color: '#333' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#F59E0B', margin: '0' }}>ExportPitch</h1>
        <p style={{ fontSize: '16px', color: '#666' }}>AI-Powered Pitch Training</p>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>Time to Practice Your Pitch!</h2>
        <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '20px' }}>
          Hello {userName},
        </p>
        <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '20px' }}>
          It&apos;s been {daysSinceLastPractice} {daysSinceLastPractice === 1 ? 'day' : 'days'} since your last practice session. 
          Regular practice is key to improving your export pitching skills!
        </p>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#F59E0B' }}>Tip of the Day</h3>
        <div style={{ background: '#F8FAFC', padding: '15px', borderRadius: '8px', fontStyle: 'italic' }}>
             &quot;{tipOfTheDay}&quot;
        </div>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#F59E0B' }}>Recommended Templates</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {suggestedTemplates.map((template) => (
            <a 
              key={template.id}
              href={`https://exportpitch.ai/dashboard/practice/${template.id}`}
              style={{
                display: 'block',
                padding: '15px',
                backgroundColor: '#FEF3C7',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#333',
                border: '1px solid #FBBF24'
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{template.name}</div>
              <div style={{ display: 'flex', fontSize: '14px', color: '#666' }}>
                <span style={{ marginRight: '10px' }}>Industry: {template.industry}</span>
                <span>Difficulty: {template.difficulty}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <a 
          href="https://exportpitch.ai/dashboard"
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
          Start Practicing Now
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