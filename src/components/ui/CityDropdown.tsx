'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { KENYAN_CITIES, getShippingDetails } from '@/data/shipping';

interface CityDropdownProps {
  value: string;
  onChange: (city: string) => void;
  required?: boolean;
}

export default function CityDropdown({ value, onChange, required }: CityDropdownProps) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const cityNames = KENYAN_CITIES.map((c) => c.name);

  const filtered = query.trim()
    ? KENYAN_CITIES.filter((c) =>
        c.name.toLowerCase().includes(query.trim().toLowerCase())
      )
    : KENYAN_CITIES;

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        if (!cityNames.includes(query)) setQuery(value);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [query, value, cityNames]);

  const handleSelect = (cityName: string) => {
    setQuery(cityName);
    onChange(cityName);
    setOpen(false);
  };

  const selectedDetails = value ? getShippingDetails(value) : null;

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <MapPin
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          required={required}
          placeholder="Search city or town..."
          autoComplete="off"
          className="w-full pl-9 pr-10 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <ChevronDown
          size={16}
          className={`absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </div>

      {/* Shipping fee badge shown after a city is selected */}
      {selectedDetails && (
        <p className="mt-1.5 text-xs text-muted-foreground">
          ~{selectedDetails.distance_km} km from Nairobi
          {' · '}
          <span className="font-semibold text-primary">KES {selectedDetails.fee}</span> delivery
        </p>
      )}

      {open && filtered.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full max-h-56 overflow-y-auto bg-card border border-border rounded-xl shadow-lg">
          {filtered.map((city) => {
            const { fee } = getShippingDetails(city.name);
            return (
              <li key={city.name}>
                <button
                  type="button"
                  onMouseDown={() => handleSelect(city.name)}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors flex items-center justify-between"
                >
                  <span className="text-foreground">{city.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">KES {fee}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {open && query.trim() && filtered.length === 0 && (
        <div className="absolute z-50 mt-1 w-full bg-card border border-border rounded-xl shadow-lg px-4 py-3 text-sm text-muted-foreground">
          No city found — type your nearest town.
        </div>
      )}
    </div>
  );
}
