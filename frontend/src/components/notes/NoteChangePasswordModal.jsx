import { Modal, Input } from "antd";
import { useState, useEffect } from "react";
import { useNote } from "../../contexts/NotesContext";
import { noteService } from "../../services";
import { useTheme } from "../../contexts/ThemeContext";

const NoteChangePasswordModal = () => {
  const {
    showChangePasswordModal,
    setShowChangePasswordModal,
    note,
    onLockStateChange,
  } = useNote();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { themeClasses } = useTheme();

  useEffect(() => {
    if (showChangePasswordModal) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      setLoading(false);
    }
  }, [showChangePasswordModal]);

  const handleConfirm = async () => {
    setError("");
    setLoading(true);

    try {
      if (!currentPassword) {
        setError("Current password is required");
        setLoading(false);
        return;
      }
      if (!newPassword) {
        setError("New password is required");
        setLoading(false);
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("New passwords do not match");
        setLoading(false);
        return;
      }
      if (newPassword === currentPassword) {
        setError("New password must be different from current password");
        setLoading(false);
        return;
      }

      const response = await noteService.changePassword(note.uuid, {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });

      // Update local state
      onLockStateChange?.(response.note);

      // Close modal and reset state
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowChangePasswordModal(false);
    } catch (err) {
      console.error("Change password error:", err);
      const errorMessage =
        err.response?.data?.errors?.current_password?.[0] ||
        err.response?.data?.errors?.new_password?.[0] ||
        err.response?.data?.errors?.confirm_password?.[0] ||
        err.response?.data?.message ||
        "An error occurred while changing the password";
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setShowChangePasswordModal(false);
  };

  return (
    <Modal
      title="Change Note Password"
      open={showChangePasswordModal}
      onOk={handleConfirm}
      onCancel={handleCancel}
      okText="Change Password"
      cancelText="Cancel"
      confirmLoading={loading}
    >
      <div className="space-y-4">
        <div>
          <label
            className={`block ${themeClasses.font.small} font-medium ${themeClasses.text.secondary} mb-1`}
          >
            Current Password
          </label>
          <Input.Password
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            className="w-full"
            disabled={loading}
          />
        </div>
        <div>
          <label
            className={`block ${themeClasses.font.small} font-medium ${themeClasses.text.secondary} mb-1`}
          >
            New Password
          </label>
          <Input.Password
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password (min 6 characters)"
            minLength={6}
            className="w-full"
            disabled={loading}
          />
        </div>
        <div>
          <label
            className={`block ${themeClasses.font.small} font-medium ${themeClasses.text.secondary} mb-1`}
          >
            Confirm New Password
          </label>
          <Input.Password
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            minLength={6}
            className="w-full"
            disabled={loading}
          />
        </div>
        {error && (
          <p className={`text-red-500 ${themeClasses.font.small}`}>{error}</p>
        )}
      </div>
    </Modal>
  );
};

export default NoteChangePasswordModal;
