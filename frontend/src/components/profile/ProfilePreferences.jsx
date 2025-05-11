import { Form, Select, Switch, notification } from "antd";
import CustomColorPicker from "../ui/CustomColorPicker";
import { useState } from "react";

const ProfilePreferences = ({ user }) => {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [newColor, setNewColor] = useState("#3b82f6");
    const [colorList, setColorList] = useState(
    user.preferences?.customColors || ["#3b82f6", "#10b981", "#f59e0b"]
    );
    const addNewColor = (color) => {
      if (colorList.length >= 12) {
        notification.info({
          message: "Color Limit Reached",
          description:
            "You can have a maximum of 12 colors. Please remove some colors before adding new ones.",
        });
        return;
      }
      if (!colorList.includes(color)) {
        setColorList([...colorList, color]);
      }
      setShowColorPicker(false);
    };

    const removeColor = (colorToRemove) => {
      setColorList(colorList.filter((color) => color !== colorToRemove));
    };
    return (
      <div>
        <Form layout="vertical" className="space-y-6 max-w-md">
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Note Preferences
            </h3>
            <Form.Item
              name="fontSize"
              label="Font Size"
              initialValue={user.preferences?.fontSize || "medium"}
            >
              <Select className="rounded-md">
                <Select.Option value="small">Small</Select.Option>
                <Select.Option value="medium">Medium</Select.Option>
                <Select.Option value="large">Large</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="noteColors" label="Note Colors">
              <div className="flex flex-wrap items-center gap-3 mb-2 py-2">
                {colorList.map((color, index) => (
                  <div key={index} className="relative group">
                    <div
                      role="button"
                      aria-label={`Select color ${color}`}
                      tabIndex={0}
                      className={`w-10 h-10 rounded-full border shadow-sm hover:scale-110 transition-transform cursor-pointer ${
                        color === newColor
                          ? "ring-2 ring-offset-2 ring-blue-500"
                          : "border-gray-200"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewColor(color)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setNewColor(color);
                        }
                      }}
                    />
                    <button
                      aria-label={`Remove color ${color}`}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                      onClick={() => removeColor(color)}
                    >
                      ×
                    </button>
                  </div>
                ))}
                {/* Add new color button or color picker */}
                {showColorPicker ? (
                  <CustomColorPicker
                    value={newColor}
                    onChange={setNewColor}
                    onAdd={addNewColor}
                    onCancel={() => setShowColorPicker(false)}
                    openByDefault
                  />
                ) : (
                  <button
                    type="button"
                    aria-label="Add new color"
                    className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    onClick={() => setShowColorPicker(true)}
                  >
                    <span className="text-gray-500 text-xl">+</span>
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {colorList.length}/12 colors used
                {colorList.length >= 10 && (
                  <span className="text-yellow-600">
                    {" "}
                    (Only {12 - colorList.length} more can be added)
                  </span>
                )}
              </p>
            </Form.Item>

            <Form.Item
              name="theme"
              label="Theme"
              valuePropName="checked"
              initialValue={user.preferences?.theme === "dark"}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Light</span>
                <Switch
                  defaultChecked={user.preferences?.theme === "dark"}
                  onChange={(checked) => {
                    // Form will handle the value
                  }}
                />
                <span className="text-sm text-gray-600">Dark</span>
              </div>
            </Form.Item>
          </div>
          <div className="pt-6 border-t border-gray-200">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-2">
              Save Preferences
            </button>
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              onClick={() => {
                setColorList(["#3b82f6", "#10b981", "#f59e0b"]);
                // Reset other form fields
              }}
            >
              Reset to Default
            </button>
          </div>
        </Form>
      </div>
    );
}

export default ProfilePreferences;
