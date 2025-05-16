import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input } from "antd";
import toast from "react-hot-toast";
import background from "/bg.jpg";
import { LockOutlined } from "@ant-design/icons";
import { authService } from "../services/authService";

const PasswordReset = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isValidToken, setIsValidToken] = useState(true);

  useEffect(() => {
    if (!token) {
      setIsValidToken(false);
      setError(
        "Invalid reset token. Please request a new password reset link."
      );
      toast.error(
        "Invalid reset token. Please request a new password reset link."
      );
    }
  }, [token]);

  const handleSubmit = async (values) => {
    if (!token) {
      toast.error(
        "Invalid reset token. Please request a new password reset link."
      );
      return;
    }

    setIsSubmitting(true);
    setError("");
    setFieldErrors({});
    try {
      await authService.resetPassword({
        token,
        password: values.password,
        password_confirmation: values.password_confirmation,
      });
      toast.success(
        "Password reset successful! Please log in with your new password."
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
        setError("Please check the fields below.");
        toast.error("Validation failed. Please check your input.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
        toast.error(err.response.data.message);
      } else {
        setError("Password reset failed. Please try again.");
        toast.error("Password reset failed. An unknown error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isValidToken) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Invalid Reset Link
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-800">
            Reset Your Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password below.
          </p>
        </div>
        <Form
          form={form}
          className="mt-8 space-y-6"
          layout="vertical"
          onFinish={handleSubmit}
        >
          {error && !Object.keys(fieldErrors).length && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}
          <Form.Item
            name="password"
            label="New Password"
            rules={[
              { required: true, message: "Please enter your new password" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
            hasFeedback
            validateStatus={fieldErrors.password ? "error" : ""}
            help={fieldErrors.password?.[0]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Enter new password"
              disabled={isSubmitting}
            />
          </Form.Item>
          <Form.Item
            name="password_confirmation"
            label="Confirm New Password"
            dependencies={["password"]}
            hasFeedback
            validateStatus={fieldErrors.password_confirmation ? "error" : ""}
            help={fieldErrors.password_confirmation?.[0]}
            rules={[
              { required: true, message: "Please confirm your new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Confirm new password"
              disabled={isSubmitting}
            />
          </Form.Item>
          <Form.Item>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50"
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default PasswordReset;
