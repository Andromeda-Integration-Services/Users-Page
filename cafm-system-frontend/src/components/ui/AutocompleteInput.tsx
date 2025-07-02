import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';

interface AutocompleteOption {
  id: string;
  text: string;
  category: string;
}

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  suggestions: AutocompleteOption[];
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  value,
  onChange,
  placeholder = "Type to search...",
  className = "",
  suggestions
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<AutocompleteOption[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.length > 0) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.text.toLowerCase().includes(value.toLowerCase()) ||
        suggestion.category.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setFilteredSuggestions([]);
      setIsOpen(false);
    }
    setHighlightedIndex(-1);
  }, [value, suggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          selectSuggestion(filteredSuggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const selectSuggestion = (suggestion: AutocompleteOption) => {
    onChange(suggestion.text);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const clearInput = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'electrical':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'plumbing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'hvac':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cleaning':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'security':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'maintenance':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'it':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="relative">
      <div className="input-icon-group">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => value.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className={`form-control ${className}`}
          style={{
            paddingLeft: '50px',
            paddingRight: value ? '50px' : '20px'
          }}
        />
        <FontAwesomeIcon icon={faSearch} className="input-icon" />
        {value && (
          <button
            onClick={clearInput}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            style={{ zIndex: 3 }}
          >
            <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && filteredSuggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2"
          style={{
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.05)',
            maxHeight: '300px',
            overflowY: 'auto'
          }}
        >
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              onClick={() => selectSuggestion(suggestion)}
              className={`px-4 py-3 cursor-pointer transition-all duration-200 ${
                index === highlightedIndex
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500'
                  : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50'
              } ${index === 0 ? 'rounded-t-2xl' : ''} ${index === filteredSuggestions.length - 1 ? 'rounded-b-2xl' : 'border-b border-gray-100'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-900 mb-1">
                    {suggestion.text}
                  </div>
                </div>
                <div
                  className={`ml-3 px-3 py-1 text-xs font-semibold rounded-full border ${getCategoryColor(suggestion.category)}`}
                  style={{
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {suggestion.category}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutocompleteInput;
