import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Select } from "antd";
import toast from "react-hot-toast";
import background from "/bg.jpg";
import { MailOutlined } from "@ant-design/icons";
import { authService } from "../services/authService";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [resetMethod, setResetMethod] = useState("email");

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setError("");
    setFieldErrors({});

    try {
      await authService.requestPasswordReset({
        email: values.email,
        method: resetMethod,
      });

      if (resetMethod === "email") {
        toast.success(
          "Password reset link has been sent to your email. Please check your inbox and follow the instructions."
        );
        navigate("/login");
      } else {
        toast.success(
          "An OTP has been sent to your email. Please check your inbox."
        );
        navigate("/reset-password-otp", { state: { email: values.email } });
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
        setError("Please check the fields below.");
        toast.error("Validation failed. Please check your input.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
        toast.error(err.response.data.message);
      } else {
        setError("Password reset request failed. Please try again.");
        toast.error(
          "Password reset request failed. An unknown error occurred."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Forgot Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you instructions to reset
            your password.
          </p>
        </div>
        <Form
          form={form}
          className="mt-8 space-y-6"
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ resetMethod: "email" }}
        >
          {error && !Object.keys(fieldErrors).length && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: "Please enter your email address" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
            validateStatus={fieldErrors.email ? "error" : ""}
            help={fieldErrors.email?.[0]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="Enter your email"
              disabled={isSubmitting}
            />
          </Form.Item>
          <Form.Item
            name="resetMethod"
            label="Reset Method"
            validateStatus={fieldErrors.method ? "error" : ""}
            help={fieldErrors.method?.[0]}
          >
            <Select
              value={resetMethod}
              onChange={setResetMethod}
              className="rounded-lg w-full"
              disabled={isSubmitting}
            >
              <Select.Option value="email">Email Link</Select.Option>
              <Select.Option value="otp">OTP</Select.Option>
            </Select>
          </Form.Item>
          <div className="flex flex-col gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send Reset Instructions"}
            </button>
            <Link
              to="/login"
              className="text-center text-sm text-blue-600 hover:text-blue-800"
            >
              Back to Login
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;
