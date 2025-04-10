// src/components/ui/color-picker.tsx
import { HexColorPicker, HexColorInput } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "~/src/components/imported/popover";
import { Button } from "~/src/components/imported/button";
import { useState } from "react";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

export const ColorPicker = ({ value, onChange, className }: ColorPickerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={`h-10 w-full p-2 ${className}`}
          style={{ backgroundColor: value }}
        >
          <span className="sr-only">Selecionar cor</span>
          <div className="w-full h-4 rounded" style={{ backgroundColor: value }} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <HexColorPicker color={value} onChange={onChange} />
        <div className="mt-2 flex items-center gap-2">
          <span>#</span>
          <HexColorInput
            color={value}
            onChange={onChange}
            className="w-24 border rounded px-2 py-1"
            prefixed
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};