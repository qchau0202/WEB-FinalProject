import {
  CheckCircleFilled,
  EditOutlined,
  ExclamationCircleFilled,
  KeyOutlined,
  CameraOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Form, Input, Modal, Button, ConfigProvider } from "antd";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import toast from "react-hot-toast";
import { authService } from "../../services/authService";

const ProfileOverview = ({ user }) => {
  const { theme, antdTheme, themeClasses } = useTheme();
  const { resendVerification, fetchUser } = useAuth();
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const isNotVerified = user.email_verified_at === null;

  useEffect(() => {
    form.setFieldsValue({
      display_name: user.name,
      email: user.email,
    });
  }, [user, form]);

  const handleResend = async () => {
    setIsSendingVerification(true);
    try {
      await resendVerification(user.email);
      toast.success("Verification email sent! Please check your inbox");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to send verification email"
      );
    } finally {
      setIsSendingVerification(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      form.resetFields();
    }
    setIsEditing(!isEditing);
  };

  const handlePasswordEditToggle = () => {
    if (isEditingPassword) {
      passwordForm.resetFields();
    }
    setIsEditingPassword(!isEditingPassword);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setIsSavingProfile(true);
      await authService.updateProfile({
        name: values.display_name,
      });
      toast.success("Profile updated successfully");
      setIsEditing(false);
      fetchUser();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
      console.error(err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordChange = async () => {
    try {
      const values = await passwordForm.validateFields();
      setIsChangingPassword(true);
      await authService.updatePassword({
        current_password: values.current_password,
        password: values.password,
        password_confirmation: values.password_confirmation,
      });
      toast.success("Password updated successfully!");
      setIsEditingPassword(false);
      passwordForm.resetFields();
    } catch (err) {
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const errorFields = Object.keys(errors).map((key) => ({
          name: key,
          errors: [errors[key][0]],
        }));
        passwordForm.setFields(errorFields);
      }
      toast.error(err?.response?.data?.message || "Failed to update password");
      console.error(err);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleAvatarClick = () => {
    setShowAvatarModal(true);
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, JPG, or GIF)");
      return;
    }

    if (file.size > maxSize) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
    setSelectedFile(file);
    setShowAvatarModal(false);
    setShowPreviewModal(true);
  };

  const handleConfirmAvatar = async () => {
    if (!selectedFile) return;

    try {
      setIsUploadingAvatar(true);
      await authService.updateAvatar(selectedFile);
      toast.success("Avatar updated successfully");
      fetchUser();
      setShowPreviewModal(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update avatar");
      setPreviewUrl(null);
    } finally {
      setIsUploadingAvatar(false);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleCancelAvatar = () => {
    setShowPreviewModal(false);
    setPreviewUrl(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <ConfigProvider theme={antdTheme}>
      <div>
        {isNotVerified && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              theme === "dark"
                ? "bg-yellow-900/20 border border-yellow-700"
                : "bg-yellow-50 border border-yellow-300"
            }`}
          >
            <ExclamationCircleFilled
              className={
                theme === "dark" ? "text-yellow-500" : "text-yellow-600"
              }
            />
            <div>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-yellow-200" : "text-yellow-800"
                }`}
              >
                Your account is not verified. Please check your email to
                activate.
              </p>
              <button
                className={`text-sm mt-1 disabled:opacity-50 ${
                  theme === "dark"
                    ? "text-blue-400 hover:text-blue-300"
                    : "text-blue-600 hover:text-blue-800"
                }`}
                onClick={handleResend}
                disabled={isSendingVerification}
              >
                {isSendingVerification
                  ? "Sending..."
                  : "Send verification email"}
              </button>
            </div>
          </div>
        )}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
          <div className="relative group">
            <div
              className="relative cursor-pointer"
              onClick={handleAvatarClick}
            >
              <img
                src={
                  previewUrl ||
                  user.avatar ||
                  "https://avatar.iran.liara.run/public/4"
                }
                alt="Avatar"
                className={`w-32 h-32 rounded-full object-cover border-2 transition-transform ${
                  theme === "dark" ? "border-blue-700" : "border-blue-200"
                }`}
              />
              <div
                className={`absolute inset-0 flex items-center justify-center bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${themeClasses.bg.secondary}`}
              >
                <CameraOutlined className={themeClasses.text.primary} />
              </div>
              {isUploadingAvatar && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                  <div
                    className={`animate-spin rounded-full h-8 w-8 border-b-2 ${themeClasses.border.primary}`}
                  ></div>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/jpeg,image/png,image/jpg,image/gif"
              className="hidden"
              disabled={isUploadingAvatar}
            />
          </div>
          <div className="flex-1">
            <div className="flex flex-col gap-2">
              <h2
                className={`text-2xl font-bold flex items-center gap-2 ${themeClasses.text.primary}`}
              >
                {user.name}
                {isNotVerified ? (
                  <ExclamationCircleFilled
                    className={
                      theme === "dark" ? "text-yellow-500" : "text-yellow-600"
                    }
                  />
                ) : (
                  <CheckCircleFilled
                    className={
                      theme === "dark" ? "text-green-500" : "text-green-600"
                    }
                  />
                )}
              </h2>
              <p className={themeClasses.text.secondary}>{user.email}</p>
              <p className={`text-sm ${themeClasses.text.muted}`}>
                Member since:{" "}
                {new Date(
                  user.createdAt || user.created_at || "Unknown"
                ).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            className={`p-6 rounded-lg border ${themeClasses.bg.primary} ${themeClasses.border.primary}`}
          >
            <h3
              className={`text-xl font-semibold mb-4 ${themeClasses.text.primary}`}
            >
              Profile Details
            </h3>
            <Form
              form={form}
              layout="vertical"
              className="space-y-6"
              initialValues={{
                display_name: user.name,
                email: user.email,
              }}
            >
              <Form.Item
                name="display_name"
                label="Display Name"
                rules={[
                  { required: true, message: "Please enter your display name" },
                ]}
              >
                <Input
                  placeholder="Enter display name"
                  className="rounded-lg"
                  disabled={!isEditing}
                />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
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
                  className="rounded-lg"
                />
              </Form.Item>
              <Form.Item>
                {isEditing ? (
                  <Button onClick={handleEditToggle} icon={<CloseOutlined />}>
                    Cancel
                  </Button>
                ) : (
                  <Button onClick={handleEditToggle} icon={<EditOutlined />}>
                    Edit Profile
                  </Button>
                )}
              </Form.Item>
              {isEditing && (
                <Form.Item>
                  <Button
                    type="primary"
                    onClick={handleSave}
                    className="w-full"
                    disabled={isSavingProfile}
                  >
                    {isSavingProfile ? "Saving..." : "Save Changes"}
                  </Button>
                </Form.Item>
              )}
            </Form>
          </div>
          <div
            className={`p-6 rounded-lg border ${themeClasses.bg.primary} ${themeClasses.border.primary}`}
          >
            <h3
              className={`text-xl font-semibold mb-4 ${themeClasses.text.primary}`}
            >
              Account & Security
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className={themeClasses.text.secondary}>
                  Account Active:
                </span>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      user.isActive
                        ? theme === "dark"
                          ? "bg-green-500"
                          : "bg-green-600"
                        : theme === "dark"
                        ? "bg-gray-500"
                        : "bg-gray-400"
                    }`}
                  ></div>
                  <span
                    className={
                      user.isActive
                        ? theme === "dark"
                          ? "text-green-400"
                          : "text-green-700"
                        : theme === "dark"
                        ? "text-gray-400"
                        : "text-gray-600"
                    }
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className={themeClasses.text.secondary}>
                  Email Verified:
                </span>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isNotVerified
                        ? theme === "dark"
                          ? "bg-yellow-500"
                          : "bg-yellow-600"
                        : theme === "dark"
                        ? "bg-green-500"
                        : "bg-green-600"
                    }`}
                  ></div>
                  <span
                    className={
                      isNotVerified
                        ? theme === "dark"
                          ? "text-yellow-400"
                          : "text-yellow-700"
                        : theme === "dark"
                        ? "text-green-400"
                        : "text-green-700"
                    }
                  >
                    {isNotVerified ? "Not Verified" : "Verified"}
                  </span>
                </div>
              </div>
              <div className="mt-6">
                <h1
                  className={`text-lg font-semibold mb-4 ${themeClasses.text.primary}`}
                >
                  Change Password
                </h1>
                <Form
                  form={passwordForm}
                  layout="vertical"
                  className="space-y-6"
                  initialValues={{
                    current_password: "",
                    password: "",
                    password_confirmation: "",
                  }}
                >
                  {isEditingPassword && (
                    <Form.Item
                      name="current_password"
                      label="Current Password"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your current password",
                        },
                      ]}
                    >
                      <Input.Password
                        placeholder="Enter current password"
                        className="rounded-lg"
                      />
                    </Form.Item>
                  )}
                  {isEditingPassword && (
                    <>
                      <Form.Item
                        name="password"
                        label="New Password"
                        rules={[
                          {
                            required: true,
                            message: "Please enter new password",
                          },
                          {
                            min: 8,
                            message: "Password must be at least 8 characters",
                          },
                        ]}
                      >
                        <Input.Password
                          placeholder="Enter new password"
                          className="rounded-lg"
                        />
                      </Form.Item>
                      <Form.Item
                        name="password_confirmation"
                        label="Confirm New Password"
                        dependencies={["password"]}
                        rules={[
                          {
                            required: true,
                            message: "Please confirm new password",
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (
                                !value ||
                                getFieldValue("password") === value
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
                          className="rounded-lg"
                        />
                      </Form.Item>
                    </>
                  )}
                  <Form.Item>
                    {isEditingPassword ? (
                      <Button
                        onClick={handlePasswordEditToggle}
                        icon={<CloseOutlined />}
                      >
                        Cancel
                      </Button>
                    ) : (
                      <Button
                        onClick={handlePasswordEditToggle}
                        icon={<KeyOutlined />}
                      >
                        Change Password
                      </Button>
                    )}
                  </Form.Item>
                  {isEditingPassword && (
                    <Form.Item>
                      <Button
                        type="primary"
                        onClick={handlePasswordChange}
                        icon={<EditOutlined />}
                        loading={isChangingPassword}
                      >
                        Update Password
                      </Button>
                    </Form.Item>
                  )}
                </Form>
              </div>
            </div>
          </div>
        </div>

        <Modal
          title="Avatar"
          open={showAvatarModal}
          onCancel={() => setShowAvatarModal(false)}
          footer={[
            <Button
              key="cancel"
              onClick={() => setShowAvatarModal(false)}
              icon={<CloseOutlined />}
            >
              Cancel
            </Button>,
            <Button
              key="upload"
              type="primary"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload New Photo
            </Button>,
          ]}
        >
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="relative w-32 h-32">
              <img
                src={
                  previewUrl ||
                  user.avatar ||
                  "https://avatar.iran.liara.run/public/4"
                }
                alt="Avatar"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
        </Modal>

        <Modal
          title="Preview Avatar"
          open={showPreviewModal}
          onOk={handleConfirmAvatar}
          onCancel={handleCancelAvatar}
          okText="Confirm"
          cancelText="Cancel"
          confirmLoading={isUploadingAvatar}
        >
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="relative w-48 h-48">
              <img
                src={previewUrl}
                alt="Avatar Preview"
                className={`w-full h-full rounded-full object-cover border-2 ${
                  theme === "dark" ? "border-blue-700" : "border-blue-200"
                }`}
              />
            </div>
            <p className={`text-sm text-center ${themeClasses.text.muted}`}>
              This is how your new avatar will look. Click confirm to save
              changes.
            </p>
          </div>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default ProfileOverview;
