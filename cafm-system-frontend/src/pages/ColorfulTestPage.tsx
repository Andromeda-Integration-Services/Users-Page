import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faTicketAlt,
  faUsers,
  faChartLine,
  faCog,
  faArrowRight,
  faHeart,
  faStar,
  faRocket
} from '@fortawesome/free-solid-svg-icons';

const ColorfulTestPage: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 25%, #ec4899 75%, #ef4444 100%)',
      backgroundAttachment: 'fixed',
      padding: '2rem'
    }}>
      {/* Colorful Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #ec4899, #ef4444)',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          boxShadow: '0 10px 30px rgba(236, 72, 153, 0.3)'
        }}>
          <FontAwesomeIcon icon={faBuilding} style={{ fontSize: '2rem', color: 'white' }} />
        </div>
        
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #10b981, #3b82f6, #ec4899, #ef4444)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem'
        }}>
          COLORFUL CAFM SYSTEM
        </h1>
        
        <p style={{
          fontSize: '1.2rem',
          color: '#6b7280',
          marginBottom: '2rem'
        }}>
          🎨 Green, Blue, Pink & Red Professional Interface
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/login" style={{
            padding: '1rem 2rem',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '12px',
            fontWeight: 'bold',
            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
            transition: 'transform 0.2s',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <FontAwesomeIcon icon={faArrowRight} />
            Green Login
          </Link>
          
          <Link to="/dashboard" style={{
            padding: '1rem 2rem',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '12px',
            fontWeight: 'bold',
            boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
            transition: 'transform 0.2s',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <FontAwesomeIcon icon={faRocket} />
            Blue Dashboard
          </Link>
          
          <Link to="/tickets" style={{
            padding: '1rem 2rem',
            background: 'linear-gradient(135deg, #ec4899, #be185d)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '12px',
            fontWeight: 'bold',
            boxShadow: '0 8px 20px rgba(236, 72, 153, 0.3)',
            transition: 'transform 0.2s',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <FontAwesomeIcon icon={faHeart} />
            Pink Tickets
          </Link>
          
          <button style={{
            padding: '1rem 2rem',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 'bold',
            boxShadow: '0 8px 20px rgba(239, 68, 68, 0.3)',
            transition: 'transform 0.2s',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer'
          }}>
            <FontAwesomeIcon icon={faStar} />
            Red Action
          </button>
        </div>
      </div>

      {/* Colorful Feature Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* Green Card */}
        <div style={{
          background: 'linear-gradient(135deg, #10b981, #059669)',
          borderRadius: '20px',
          padding: '2rem',
          color: 'white',
          boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)'
        }}>
          <FontAwesomeIcon icon={faTicketAlt} style={{ fontSize: '2rem', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Green Service Requests
          </h3>
          <p>Manage all your facility maintenance requests with our green-themed interface.</p>
        </div>

        {/* Blue Card */}
        <div style={{
          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          borderRadius: '20px',
          padding: '2rem',
          color: 'white',
          boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)'
        }}>
          <FontAwesomeIcon icon={faUsers} style={{ fontSize: '2rem', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Blue User Management
          </h3>
          <p>Comprehensive user roles and permissions with our blue-themed design.</p>
        </div>

        {/* Pink Card */}
        <div style={{
          background: 'linear-gradient(135deg, #ec4899, #be185d)',
          borderRadius: '20px',
          padding: '2rem',
          color: 'white',
          boxShadow: '0 20px 40px rgba(236, 72, 153, 0.3)'
        }}>
          <FontAwesomeIcon icon={faChartLine} style={{ fontSize: '2rem', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Pink Analytics
          </h3>
          <p>Real-time dashboards and detailed reports with our pink-themed interface.</p>
        </div>

        {/* Red Card */}
        <div style={{
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          borderRadius: '20px',
          padding: '2rem',
          color: 'white',
          boxShadow: '0 20px 40px rgba(239, 68, 68, 0.3)'
        }}>
          <FontAwesomeIcon icon={faCog} style={{ fontSize: '2rem', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Red System Settings
          </h3>
          <p>Flexible system configuration with our red-themed design.</p>
        </div>
      </div>

      {/* Color Palette Display */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '2rem',
          color: '#1f2937'
        }}>
          🎨 Color Palette
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '100px',
              height: '100px',
              background: '#10b981',
              borderRadius: '50%',
              margin: '0 auto 1rem',
              boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)'
            }}></div>
            <h4 style={{ color: '#10b981', fontWeight: 'bold' }}>Emerald Green</h4>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>#10b981</p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '100px',
              height: '100px',
              background: '#3b82f6',
              borderRadius: '50%',
              margin: '0 auto 1rem',
              boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)'
            }}></div>
            <h4 style={{ color: '#3b82f6', fontWeight: 'bold' }}>Bright Blue</h4>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>#3b82f6</p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '100px',
              height: '100px',
              background: '#ec4899',
              borderRadius: '50%',
              margin: '0 auto 1rem',
              boxShadow: '0 10px 30px rgba(236, 72, 153, 0.3)'
            }}></div>
            <h4 style={{ color: '#ec4899', fontWeight: 'bold' }}>Hot Pink</h4>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>#ec4899</p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '100px',
              height: '100px',
              background: '#ef4444',
              borderRadius: '50%',
              margin: '0 auto 1rem',
              boxShadow: '0 10px 30px rgba(239, 68, 68, 0.3)'
            }}></div>
            <h4 style={{ color: '#ef4444', fontWeight: 'bold' }}>Bright Red</h4>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>#ef4444</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorfulTestPage;
