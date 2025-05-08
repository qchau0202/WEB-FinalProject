import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { mockUsers } from "../mock-data/users";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    display_name: "",
    password: "",
    confirm_password: "",
    avatar: null,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    // Check if email already exists
    if (mockUsers.some((user) => user.email === formData.email)) {
      setError("Email already registered");
      toast.error("Email already registered");
      return;
    }

    // Create new user (in a real app, this would be an API call)
    const newUser = {
      id: mockUsers.length + 1,
      email: formData.email,
      display_name: formData.display_name,
      password: formData.password, // In a real app, this would be hashed
      avatar: formData.avatar
        ? URL.createObjectURL(formData.avatar)
        : "https://i.pravatar.cc/150?img=" + (mockUsers.length + 1),
      preferences: {
        theme: "light",
        fontSize: "medium",
        noteColors: ["#ffebee", "#e8f5e9", "#e3f2fd"],
      },
      email_verified_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Store user data in localStorage (in a real app, you'd use a more secure method)
    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        id: newUser.id,
        email: newUser.email,
        display_name: newUser.display_name,
        avatar: newUser.avatar,
        preferences: newUser.preferences,
      })
    );

    toast.success("Account created successfully!");
    // Navigate to home page
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-orange-600">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-orange-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-orange-600 hover:text-orange-500"
            >
              Sign in
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-orange-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 appearance-none rounded-lg relative block w-full px-3 py-2 border border-orange-300 placeholder-orange-400 text-orange-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor="display_name"
                className="block text-sm font-medium text-orange-700"
              >
                Display Name
              </label>
              <input
                id="display_name"
                name="display_name"
                type="text"
                required
                className="mt-1 appearance-none rounded-lg relative block w-full px-3 py-2 border border-orange-300 placeholder-orange-400 text-orange-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                placeholder="Choose a display name"
                value={formData.display_name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-orange-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 appearance-none rounded-lg relative block w-full px-3 py-2 border border-orange-300 placeholder-orange-400 text-orange-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor="confirm_password"
                className="block text-sm font-medium text-orange-700"
              >
                Confirm Password
              </label>
              <input
                id="confirm_password"
                name="confirm_password"
                type="password"
                required
                className="mt-1 appearance-none rounded-lg relative block w-full px-3 py-2 border border-orange-300 placeholder-orange-400 text-orange-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                placeholder="Confirm your password"
                value={formData.confirm_password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor="avatar"
                className="block text-sm font-medium text-orange-700"
              >
                Profile Picture (Optional)
              </label>
              <input
                id="avatar"
                name="avatar"
                type="file"
                accept="image/*"
                className="mt-1 block w-full text-sm text-orange-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-orange-50 file:text-orange-700
                  hover:file:bg-orange-100"
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
