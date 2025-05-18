import { Button, Form, Select, Switch } from "antd";
import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import toast from "react-hot-toast";

const ProfilePreferences = () => {
  const { theme, fontSize, toggleTheme, setFontSize, themeClasses } =
    useTheme();

  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tempFontSize, setTempFontSize] = useState(fontSize);

  const handleSavePreferences = async () => {
    setIsSaving(true);
    try {
      // Simulate API call or any async operation
      await new Promise((resolve) => setTimeout(resolve, 500));
      setFontSize(tempFontSize);
      setIsEditing(false);
      toast.success("Preferences saved");
    } catch {
      toast.error("Failed to save preferences. Please try again");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = async () => {
    setIsSaving(true);
    try {
      // Simulate API call or any async operation
      await new Promise((resolve) => setTimeout(resolve, 500));
      setFontSize("medium");
      setTempFontSize("medium");
      setIsEditing(false);
      toast.success("Preferences have been reset to default");
    } catch {
      toast.error("Failed to reset preferences. Please try again");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <Form layout="vertical" className="space-y-6 max-w-md">
        <div>
          <h3
            className={`text-lg font-medium mb-4 ${themeClasses.text.primary}`}
          >
            Note Preferences
          </h3>
          <Form.Item
            label={
              <span className={themeClasses.text.secondary}>Font Size</span>
            }
          >
            <Select
              className="rounded-lg"
              value={tempFontSize}
              onChange={setTempFontSize}
              disabled={!isEditing}
            >
              <Select.Option value="small">Small</Select.Option>
              <Select.Option value="medium">Medium</Select.Option>
              <Select.Option value="large">Large</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={<span className={themeClasses.text.secondary}>Theme</span>}
          >
            <div className="flex items-center gap-3">
              <span className={`text-sm ${themeClasses.text.light}`}>
                Light
              </span>
              <Switch
                checked={theme === "dark"}
                onChange={toggleTheme}
                checkedChildren="Dark"
                unCheckedChildren="Light"
              />
              <span className={`text-sm ${themeClasses.text.light}`}>Dark</span>
            </div>
          </Form.Item>
        </div>

        <div
          className={`flex flex-col gap-2 pt-6 border-t ${themeClasses.border.primary} sm:flex-row`}
        >
          {isEditing ? (
            <>
              <Button
                type="primary"
                onClick={handleSavePreferences}
                loading={isSaving}
                className="w-full sm:w-auto"
              >
                Save Preferences
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="w-full sm:w-auto"
            >
              Edit Preferences
            </Button>
          )}
          <Button
            onClick={handleResetToDefault}
            className="w-full sm:w-auto"
            loading={isSaving}
          >
            Reset to Default
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ProfilePreferences;
