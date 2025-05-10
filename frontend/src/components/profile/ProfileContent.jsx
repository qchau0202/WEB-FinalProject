import { useState } from "react";
import { Form, Input, Select, Switch, Button, notification } from "antd";
import {
  CheckCircleFilled,
  ExclamationCircleFilled,
  EditOutlined,
  KeyOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import CustomColorPicker from "../ui/CustomColorPicker";

const ProfileContent = ({ user, activeTab }) => {
  const [resetMethod, setResetMethod] = useState("link");
  const [otp, setOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [colorList, setColorList] = useState(
    user.preferences?.customColors || ["#3b82f6", "#10b981", "#f59e0b"]
  );
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newColor, setNewColor] = useState("#3b82f6");

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

  const handleResetPassword = () => {
    if (resetMethod === "otp" && !isOtpVerified) {
      if (otp === "123456") {
        setIsOtpVerified(true);
        notification.success({
          message: "OTP Verified",
          description: "Please enter your new password.",
        });
      } else {
        notification.error({
          message: "Invalid OTP",
          description: "Please enter the correct OTP sent to your email.",
        });
      }
    } else {
      notification.success({
        message: "Password Reset",
        description:
          resetMethod === "link"
            ? "A password reset link has been sent to your email."
            : "Password has been successfully reset.",
      });
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className="bg-white p-6 rounded-md border border-gray-100">
            {!user.isVerified && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md flex items-center gap-3">
                <ExclamationCircleFilled className="text-yellow-500" />
                <div>
                  <p className="text-sm text-yellow-700">
                    Your account is not verified. Please check your email to
                    activate your account.
                  </p>
                  <button className="text-blue-600 hover:underline text-sm mt-1">
                    Resend verification email
                  </button>
                </div>
              </div>
            )}
            <div className="flex flex-col sm:flex-row items-start gap-6 mb-6">
              <img
                src={user.avatar || "https://via.placeholder.com/150"}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border border-gray-200"
              />
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      {user.display_name}
                      {user.isVerified ? (
                        <CheckCircleFilled className="text-green-500" />
                      ) : (
                        <ExclamationCircleFilled className="text-yellow-500" />
                      )}
                    </h2>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-gray-500 text-sm">
                      Member since:{" "}
                      {new Date(
                        user.createdAt || "2025-01-01"
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2">
                    <EditOutlined />
                    Edit
                  </button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                <Form layout="vertical" className="space-y-4 max-w-md">
                  <Form.Item
                    name="display_name"
                    label="Display Name"
                    initialValue={user.display_name}
                    rules={[
                      {
                        required: true,
                        message: "Please enter your display name",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter display name"
                      className="rounded-md"
                    />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    label="Email"
                    initialValue={user.email}
                    rules={[
                      {
                        required: true,
                        type: "email",
                        message: "Please enter a valid email",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter email"
                      disabled
                      className="rounded-md"
                    />
                  </Form.Item>
                  <Form.Item>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Save
                    </button>
                  </Form.Item>
                </Form>
              </div>
              <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                <h3 className="text-lg font-medium text-gray-700 mb-3">
                  Account Status
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Account Active:</span>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          user.isActive ? "bg-green-500" : "bg-gray-400"
                        }`}
                      ></div>
                      <span>{user.isActive ? "Active" : "Inactive"}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>Email Verified:</span>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          user.isVerified ? "bg-green-500" : "bg-yellow-500"
                        }`}
                      ></div>
                      <span>
                        {user.isVerified ? "Verified" : "Not Verified"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "preferences":
        return (
          <div className="bg-white p-6 rounded-md border border-gray-100">
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
      case "change-password":
        return (
          <div className="bg-white p-6 rounded-md border border-gray-100">
            <Form layout="vertical" className="space-y-4 max-w-md">
              <Form.Item name="resetMethod" label="Reset Method">
                <Select
                  value={resetMethod}
                  onChange={setResetMethod}
                  className="rounded-md"
                >
                  <Select.Option value="link">Email Link</Select.Option>
                  <Select.Option value="otp">OTP</Select.Option>
                </Select>
              </Form.Item>
              {resetMethod === "otp" && !isOtpVerified && (
                <Form.Item
                  name="otp"
                  label="Enter OTP"
                  rules={[{ required: true, message: "Please enter the OTP" }]}
                >
                  <Input
                    placeholder="Enter OTP from email"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="rounded-md"
                  />
                </Form.Item>
              )}
              {(resetMethod === "link" || isOtpVerified) && (
                <>
                  <Form.Item
                    name="new_password"
                    label="New Password"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your new password",
                      },
                      {
                        min: 8,
                        message: "Password must be at least 8 characters",
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder="Enter new password"
                      className="rounded-md"
                    />
                  </Form.Item>
                  <Form.Item
                    name="confirm_password"
                    label="Confirm New Password"
                    rules={[
                      {
                        required: true,
                        message: "Please confirm your new password",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (
                            !value ||
                            getFieldValue("new_password") === value
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("Passwords do not match")
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      placeholder="Confirm new password"
                      className="rounded-md"
                    />
                  </Form.Item>
                </>
              )}
              <Form.Item>
                <button
                  onClick={handleResetPassword}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                >
                  <KeyOutlined />
                  {resetMethod === "otp" && !isOtpVerified
                    ? "Verify OTP"
                    : "Reset Password"}
                </button>
              </Form.Item>
            </Form>
          </div>
        );
      case "danger-zone":
        return (
          <div className="bg-white p-6 rounded-md border border-gray-100">
            <div className="bg-red-50 p-4 rounded-md border border-red-200 max-w-md">
              <h3 className="text-lg font-medium text-red-700 mb-3">
                Delete Account
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </p>
              <Form layout="vertical" className="space-y-4">
                <Form.Item
                  name="confirm_email"
                  label="Confirm Email"
                  rules={[
                    {
                      required: true,
                      type: "email",
                      message: "Please enter your email",
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter your email"
                    className="rounded-md"
                  />
                </Form.Item>
                <Form.Item>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2">
                    <WarningOutlined />
                    Delete Account
                  </button>
                </Form.Item>
              </Form>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden ">
      <div className="py-4 px-6 pb-0">
        <h1 className="text-2xl font-bold text-blue-600">
          {activeTab === "general"
            ? "Account Overview"
            : activeTab === "preferences"
            ? "User Preferences"
            : activeTab === "change-password"
            ? "Reset Password"
            : "Danger Zone"}
        </h1>
        <p className="text-xs text-gray-500 uppercase tracking-wider mt-1 mb-6">
          {activeTab === "general"
            ? "View and update your profile information"
            : activeTab === "preferences"
            ? "Customize your note-taking experience"
            : activeTab === "change-password"
            ? "Reset your account password"
            : "Manage critical account actions"}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-6 pt-0">{renderContent()}</div>
    </div>
  );
};

export default ProfileContent;