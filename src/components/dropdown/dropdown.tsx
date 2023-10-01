// Custom dropdown component react typescript

import { useEffect, useState } from "react";
import "./dropdown.css";

interface Props {
  className?: string;
  title: string;
  options: IItem[];
  hSelection?: (item: IItem) => void;
}

interface IItem {
  label: string;
  value: string;
}

export default function Dropdown({
  title,
  options,
  className,
  hSelection,
}: Props) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<IItem>();
  const [selectedLabel, setSelectedLabel] = useState<string>();

  useEffect(() => {
    setSelectedLabel(selected?.label);
    title = selectedLabel || title;
  }, [selected]);

  const hSelected = (item: IItem) => {
    hSelection && hSelection(item);
    setSelected(item);
    setOpen(false);
  };

  return (
    <div className={`dropdown ${className}`}>
      <div className="dropdown dropdown-title" onClick={() => setOpen(!open)}>
        {selectedLabel || title}
      </div>
      <div className={`dropdown-content ${open ? "open" : ""}`}>
        {options.map((item, index) => (
          <span
            key={index}
            onClick={() => {
              hSelected(item);
            }}
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
