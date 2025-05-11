import { ColorPicker, Popover } from "antd";
import { useState, useEffect } from "react";

const CustomColorPicker = ({
  value,
  onChange,
  onAdd,
  onCancel,
  className,
  openByDefault,
}) => {
  const [color, setColor] = useState(value || "#ffffff");
  const [open, setOpen] = useState(!!openByDefault); // Open Popover if openByDefault is true

  useEffect(() => {
    if (value) {
      setColor(value);
    }
  }, [value]);

  const handleColorChange = (colorValue) => {
    const hexColor = colorValue.toHexString();
    setColor(hexColor);
    onChange?.(hexColor);
  };

  const handleAdd = () => {
    onAdd?.(color);
    setOpen(false);
  };

  const handleCancel = () => {
    onCancel?.();
    setOpen(false);
  };

  return (
    <Popover
      content={
        <div className="p-2">
          <ColorPicker
            value={color}
            onChange={handleColorChange}
            showText
            presets={[
              {
                label: "Recommended",
                colors: ["#3b82f6", "#10b981", "#ef4444"],
              },
            ]}
            placement="topLeft"
          />
          <div className="mt-3 flex gap-2 justify-end">
            <button
              type="button"
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              onClick={handleAdd}
            >
              Add
            </button>
            <button
              type="button"
              className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      }
      trigger="click"
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          onCancel?.();
        }
      }}
      placement="bottomLeft"
    >
      <div
        role="button"
        aria-label="Select color"
        tabIndex={0}
        className={`color-picker-trigger ${className || ""}`}
        style={{
          backgroundColor: color,
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          cursor: "pointer",
          border: "2px solid #ffffff",
          boxShadow: "0 0 0 1px #d1d5db",
        }}
        onClick={() => setOpen(true)} // Allow manual click to reopen if closed
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setOpen(true);
          }
        }}
      />
    </Popover>
  );
};

export default CustomColorPicker;