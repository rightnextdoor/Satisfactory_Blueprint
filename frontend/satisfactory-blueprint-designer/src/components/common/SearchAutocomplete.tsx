// src/components/common/SearchAutocomplete.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from 'react';
import '../../styles/common/SearchAutocomplete.css';
import { formatDate } from '../../utils/dateUtils';

interface Suggestion<T> {
  item: T;
  text: string;
}

interface SearchAutocompleteProps<T> {
  items: T[];
  fields: (keyof T)[];
  onFilter: (filtered: T[]) => void;
  onSelect: (item: T) => void;
  onInputChange?: (value: string) => void;
  placeholder?: string;
  renderItem?: (item: T) => React.ReactNode;
  className?: string;
}

export function SearchAutocomplete<T extends Record<string, any>>({
  items,
  fields,
  onFilter,
  onSelect,
  onInputChange,
  placeholder = '',
  renderItem,
  className = '',
}: SearchAutocompleteProps<T>) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion<T>[]>([]);
  const [highlight, setHighlight] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Recompute suggestions when query changes
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setSuggestions([]);
      onFilter(items);
      onInputChange?.(query);
      return;
    }
    const matches: Suggestion<T>[] = [];
    const fullFiltered: T[] = [];

    items.forEach((item) => {
      for (const f of fields) {
        const v = item[f];
        if (typeof v !== 'string') continue;
        const parsed = Date.parse(v);
        const text =
          !isNaN(parsed) && v.includes('-')
            ? formatDate(v).toLowerCase()
            : v.toLowerCase();
        if (text.includes(q)) {
          fullFiltered.push(item);
          matches.push({ item, text });
          break;
        }
      }
    });

    onFilter(fullFiltered);
    setSuggestions(matches.slice(0, 10));
    setHighlight(0);
    onInputChange?.(query);
  }, [query, items, onFilter, onInputChange]);

  // Close on Escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isFocused || !suggestions.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const { item, text } = suggestions[highlight];
      onSelect(item);
      setQuery(text);
      setSuggestions([]);
    } else if (e.key === 'Escape') {
      setSuggestions([]);
    }
  };

  // Clicking outside will also hide, in case you need it
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false);
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div className={`autocomplete-wrapper ${className}`} ref={wrapperRef}>
      <input
        ref={inputRef}
        type="text"
        className="autocomplete-input"
        value={query}
        placeholder={placeholder}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          setSuggestions([]);
        }}
      />
      {isFocused && suggestions.length > 0 && (
        <ul className="autocomplete-list">
          {suggestions.map((sug, idx) => (
            <li
              key={idx}
              className={
                idx === highlight
                  ? 'autocomplete-item autocomplete-item-active'
                  : 'autocomplete-item'
              }
              onMouseEnter={() => setHighlight(idx)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onSelect(sug.item);
                setQuery(sug.text);
                setSuggestions([]);
              }}
            >
              {renderItem ? renderItem(sug.item) : sug.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
