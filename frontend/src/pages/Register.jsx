// frontend/src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  // UploadOutlined, // Avatar upload is not handled by backend yet, can be added later
} from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext"; // Use your AuthContext
import background from "/bg.jpg";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth(); // Get register function from context
  const [formData, setFormData] = useState({
    email: "",
    display_name: "", // Frontend uses display_name
    password: "",
    password_confirmation: "", // Backend expects this
    // avatar: null, // Defer avatar for now as backend doesn't handle it on register
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value /*, files */ } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value, // For now, only handle text inputs
      // [name]: files ? files[0] : value, // If you re-enable avatar
    }));
    setError("");
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    // Basic client-side check (backend will also validate)
    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match");
      setFieldErrors({ password_confirmation: ["Passwords do not match."] });
      toast.error("Passwords do not match");
      return;
    }
    setIsSubmitting(true);

    try {
      // Prepare data for backend: backend expects 'name', not 'display_name'
      const backendData = {
        name: formData.display_name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      };

      await register(backendData); // Call context register
      toast.success(
        "Registration successful! Please verify your email to activate your account."
      );
      navigate("/"); // Navigate to home page
    } catch (err) {
      if (err.response && err.response.data) {
        if (err.response.status === 422 && err.response.data.errors) {
          setFieldErrors(err.response.data.errors);
          // Map backend 'name' error back to 'display_name' if needed for display
          if (err.response.data.errors.name) {
            setFieldErrors((prev) => ({
              ...prev,
              display_name: err.response.data.errors.name,
            }));
          }
          setError("Please check the fields below.");
          toast.error("Registration failed. Please check your input.");
        } else if (err.response.data.message) {
          setError(err.response.data.message);
          toast.error(err.response.data.message);
        } else {
          setError("Registration failed. Please try again.");
          toast.error("Registration failed. An unknown error occurred.");
        }
      } else {
        setError(
          "Registration failed. Please check your connection and try again."
        );
        toast.error(
          "Registration failed. Network error or server unavailable."
        );
      }
      console.error("Registration error:", err);
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
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && !Object.keys(fieldErrors).length && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}
          <div className="rounded-md space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailOutlined className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border ${
                    fieldErrors.email ? "border-red-500" : "border-gray-300"
                  } placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-colors`}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {fieldErrors.email[0]}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="display_name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Display Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserOutlined className="text-gray-400" />
                </div>
                <input
                  id="display_name"
                  name="display_name"
                  type="text"
                  autoComplete="name"
                  required
                  className={`appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border ${
                    fieldErrors.display_name || fieldErrors.name
                      ? "border-red-500"
                      : "border-gray-300"
                  } placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-colors`}
                  placeholder="Choose a display name"
                  value={formData.display_name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              {(fieldErrors.display_name || fieldErrors.name) && (
                <p className="text-xs text-red-500 mt-1">
                  {(fieldErrors.display_name || fieldErrors.name)[0]}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockOutlined className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className={`appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border ${
                    fieldErrors.password ? "border-red-500" : "border-gray-300"
                  } placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-colors`}
                  placeholder="Create a password (min 8 characters)"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              {fieldErrors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {fieldErrors.password[0]}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="password_confirmation"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockOutlined className="text-gray-400" />
                </div>
                <input
                  id="password_confirmation"
                  name="password_confirmation"
                  type="password"
                  autoComplete="new-password"
                  required
                  className={`appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border ${
                    fieldErrors.password_confirmation
                      ? "border-red-500"
                      : "border-gray-300"
                  } placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition-colors`}
                  placeholder="Confirm your password"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
              {fieldErrors.password_confirmation && (
                <p className="text-xs text-red-500 mt-1">
                  {fieldErrors.password_confirmation[0]}
                </p>
              )}
            </div>
            {/* Avatar input removed for now - can be added later when backend supports it */}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
