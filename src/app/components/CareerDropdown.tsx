import { CAREERS } from "@/types/careers";
import { useState, useRef, useEffect } from "react";

const careerOptions = Object.values(CAREERS);

export default function CareerDropdown({ onSelect }: { onSelect: (value: string) => void }) {
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = careerOptions.filter((career) =>
    career.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <input
        type="text"
        value={search}
        placeholder="Selecciona tu carrera"
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setShowDropdown(true)}
        className="w-full px-4 py-2 border rounded-lg bg-background text-textDefault
        
       border-black/[.08] dark:border-white/[.145] focus:outline-none focus:ring-2 focus:ring-primary/50"
      
      />

      {showDropdown && (
        <ul className="absolute w-full bg-background border border-gray rounded max-h-48 overflow-y-auto z-10">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((career, index) => (
              <li
                key={index}
                onClick={() => {
                  onSelect(career);
                  setSearch(career);
                  setShowDropdown(false);
                }}
                className="py-2 px-4 cursor-pointer hover:bg-secondary-background text-textDefault transition-all"
              >
                {career}
              </li>
            ))
          ) : (
            <li className="p-2 text-gray text-center">No encontrado</li>
          )}
        </ul>
      )}
    </div>
  );
}
