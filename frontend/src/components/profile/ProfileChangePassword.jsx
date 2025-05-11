import { useState } from "react";
import { Form, Input, Select, notification } from "antd";
import { KeyOutlined } from "@ant-design/icons";

const ProfileChangePassword = () => {
    const [resetMethod, setResetMethod] = useState("link");
    const [otp, setOtp] = useState("");
    const [isOtpVerified, setIsOtpVerified] = useState(false);

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
    return (
      <div>
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
                      if (!value || getFieldValue("new_password") === value) {
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
}

export default ProfileChangePassword;