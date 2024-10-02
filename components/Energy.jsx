import React from 'react';
import { Zap } from 'lucide-react';

export const EnergyBadge = ({ energy }) => {
  return (
    <div 
      className="select-none relative mt-4 w-20 h-20 transform rotate-45 group shadow-md"
      style={{
        position: 'relative',
        width: '5rem',
        height: '5rem',
        transform: 'rotate(45deg)',
        borderRadius: '1.5rem',

      }}
    >
      <div 
        style={{
          position: 'absolute',
          inset: '0',
          background: 'linear-gradient(to bottom right, #6E89E9, #6E89E9, #6E89E9)',
          borderRadius: '1.5rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          transition: 'all 300ms'
        }}
      ></div>
      <div 
        style={{
          position: 'absolute',
          inset: '3px',
          background: 'linear-gradient(to top left, #6E89E9, #0134EC)',
          borderRadius: '1rem'
        }}
      ></div>
      <div 
        style={{
          position: 'absolute',
          inset: '0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transform: 'rotate(-45deg)'
        }}
      >
        <Zap color='#fff'/>
        <span 
          style={{
            color: '#fff',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            marginTop: '0.25rem',
            filter: 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.1))'
          }}
        >{energy}</span>
      </div>
      <div 
        style={{
          position: 'absolute',
          inset: '0',
          backgroundColor: '#6E89E9',
          borderRadius: '1.5rem',
          transform: 'rotate(-45deg) scale(0)',
          transition: 'transform 300ms',
          zIndex: '-10'
        }}
      ></div>
    </div>
  );
};

export const EnergyIcon = ({ energy = 100, animate }) => {
  return (
    <div className="flex items-center" style={{ display: 'flex', alignItems: 'center' }}>
      <style jsx>{`
        @keyframes slideUp {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
      <div 
        style={{
          position: 'relative',
          width: '2.5rem',
          height: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom, #fde047, #facc15, #eab308)',
          borderRadius: '9999px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: '2px solid #facc15',
          overflow: 'hidden',
          transition: 'transform 0.2s',
        }}
      >
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#fef08a',
            opacity: 0,
            transition: 'opacity 0.2s',
          }}
        ></div>
        <div style={{ position: 'relative', zIndex: 10 }}>
          <Zap size={20} className="text-white drop-shadow-md" style={{ color: 'white', filter: 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.1))' }} />
        </div>
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'black',
            opacity: 0.1,
            borderRadius: '9999px',
          }}
        ></div>
      </div>
      <span 
        style={{
          marginLeft: '0.5rem',
          fontSize: '1.25rem',
          fontWeight: 'bold',
          color: '#eab308',
          filter: 'drop-shadow(0 1px 1px rgb(0 0 0 / 0.05))',
          animation: animate ? 'slideUp 0.5s ease-out' : 'none',

        }}
      >
        {energy}
      </span>
    </div>
  );
};