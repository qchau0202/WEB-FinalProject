import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Input } from "antd";
import toast from "react-hot-toast";
import background from "/bg.jpg";
import { MailOutlined } from "@ant-design/icons";
import { authService } from "../services/authService";

const PasswordResetOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Get email from location state if available
    if (location.state?.email) {
      setEmail(location.state.email);
      form.setFieldsValue({ email: location.state.email });
    }
  }, [location.state, form]);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setError("");
    setFieldErrors({});
    try {
      const response = await authService.verifyOtp({
        email: values.email,
        otp: values.otp,
      });

      if (response.token) {
        toast.success("OTP verified successfully!");
        // Navigate to password reset page with the token
        navigate(`/reset-password/${response.token}`);
      } else {
        setError("Invalid OTP or expired.");
        toast.error("Invalid OTP or expired.");
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
        setError("OTP verification failed. Please try again.");
        toast.error("OTP verification failed. An unknown error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email address first.");
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.requestPasswordReset({
        email: email,
        method: "otp",
      });
      toast.success("A new OTP has been sent to your email.");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to resend OTP.");
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
            Enter OTP
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the OTP sent to your email and your email address.
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
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: "Please enter your email address" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="Enter your email"
              disabled={isSubmitting}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="otp"
            label="OTP"
            rules={[
              { required: true, message: "Please enter the OTP" },
              { len: 6, message: "OTP must be 6 digits" },
            ]}
          >
            <Input
              placeholder="Enter OTP"
              maxLength={6}
              disabled={isSubmitting}
            />
          </Form.Item>
          <div className="flex flex-col gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50"
            >
              {isSubmitting ? "Verifying..." : "Verify OTP"}
            </button>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isSubmitting}
              className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Resend OTP"}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default PasswordResetOtp;
