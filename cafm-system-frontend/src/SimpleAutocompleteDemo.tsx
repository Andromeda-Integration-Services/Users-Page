import React, { useState } from 'react';

const SimpleAutocompleteDemo: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = [
    'Water leak from ceiling',
    'Water leakage under sink', 
    'Water leak detector alarm',
    'Electrical socket not working',
    'Power outage in office area',
    'Flickering lights in hallway',
    'Air conditioning not cooling',
    'Heating system not working',
    'Restroom cleaning required',
    'Carpet cleaning needed',
    'Security camera not working',
    'Door lock mechanism broken'
  ];

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(value.length > 0);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 25%, #ec4899 75%, #ef4444 100%)',
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #10b981, #3b82f6, #ec4899, #ef4444)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🚀 Smart Autocomplete Demo
        </h1>
        
        <p style={{
          textAlign: 'center',
          fontSize: '1.2rem',
          color: '#6b7280',
          marginBottom: '2rem'
        }}>
          Type facility issues like "water leak", "electrical", "cleaning"
        </p>

        <div style={{ position: 'relative', marginBottom: '2rem' }}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type your facility issue here..."
            style={{
              width: '100%',
              padding: '1rem',
              fontSize: '1.1rem',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              outline: 'none',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
            onFocus={() => inputValue.length > 0 && setShowSuggestions(true)}
          />

          {showSuggestions && filteredSuggestions.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              zIndex: 1000,
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              {filteredSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  style={{
                    padding: '1rem',
                    cursor: 'pointer',
                    borderBottom: index < filteredSuggestions.length - 1 ? '1px solid #f3f4f6' : 'none',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  <div style={{ fontWeight: '500', color: '#1f2937' }}>
                    {suggestion}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>
                    {suggestion.includes('water') ? '💧 Plumbing' :
                     suggestion.includes('electrical') || suggestion.includes('power') || suggestion.includes('light') ? '⚡ Electrical' :
                     suggestion.includes('air') || suggestion.includes('heating') ? '❄️ HVAC' :
                     suggestion.includes('cleaning') || suggestion.includes('restroom') ? '🧹 Cleaning' :
                     suggestion.includes('security') || suggestion.includes('door') ? '🔒 Security' : '🔧 Maintenance'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#1f2937', marginBottom: '1rem' }}>
            Try these keywords:
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
            {['water leak', 'electrical', 'power', 'cleaning', 'hvac', 'security'].map((keyword, index) => (
              <button
                key={index}
                onClick={() => {
                  setInputValue(keyword);
                  setShowSuggestions(true);
                }}
                style={{
                  padding: '0.5rem 1rem',
                  background: index % 4 === 0 ? '#10b981' : 
                            index % 4 === 1 ? '#3b82f6' :
                            index % 4 === 2 ? '#ec4899' : '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>

        {inputValue && (
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: '#f0f9ff',
            border: '1px solid #0ea5e9',
            borderRadius: '12px'
          }}>
            <h4 style={{ color: '#0c4a6e', marginBottom: '0.5rem' }}>
              Current Input:
            </h4>
            <p style={{ color: '#075985', fontFamily: 'monospace', fontSize: '1.1rem' }}>
              "{inputValue}"
            </p>
            <p style={{ color: '#0369a1', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Found {filteredSuggestions.length} matching suggestions
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleAutocompleteDemo;
