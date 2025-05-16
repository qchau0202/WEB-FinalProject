import { Modal, Input } from "antd";
import { useState, useEffect } from "react";
import { useNote } from "../../contexts/NotesContext";
import { noteService } from "../../services";
import { useTheme } from "../../contexts/ThemeContext";

const NoteLockModal = () => {
  const {
    showLockModal,
    setShowLockModal,
    note,
    lockAction,
    setLockAction,
    onLockStateChange,
  } = useNote();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { themeClasses } = useTheme();

  useEffect(() => {
    if (showLockModal) {
      setPassword("");
      setConfirmPassword("");
      setError("");
      setLoading(false);
    }
  }, [showLockModal]);

  const isEnable = lockAction === "enable";
  const isUnlock = lockAction === "unlock";
  const isDisable = lockAction === "disable";

  const handleConfirm = async () => {
    setError("");
    setLoading(true);

    try {
      if (isEnable) {
        if (!password) {
          setError("Password is required");
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }

        // Lock the note with the password
        const response = await noteService.lockNote(note.uuid, password);
        // message.success("Note locked successfully");
        // Update local state
        onLockStateChange?.(response.note);
      } else if (isUnlock) {
        if (!password) {
          setError("Password is required");
          setLoading(false);
          return;
        }
        // First verify the password
        const verifyResponse = await noteService.verifyLockPassword(
          note.uuid,
          password
        );
        if (!verifyResponse.is_valid) {
          setError("Invalid password");
          setLoading(false);
          return;
        }
        // Then unlock the note
        const response = await noteService.unlockNote(note.uuid, password);
        // message.success("Note unlocked successfully");
        // Update local state
        onLockStateChange?.(response.note);
      } else if (isDisable) {
        if (!password) {
          setError("Password is required");
          setLoading(false);
          return;
        }
        // First verify the password
        const verifyResponse = await noteService.verifyLockPassword(
          note.uuid,
          password
        );
        if (!verifyResponse.is_valid) {
          setError("Invalid password");
          setLoading(false);
          return;
        }
        // Then disable the lock feature
        const response = await noteService.disableLockFeature(
          note.uuid,
          password
        );
        onLockStateChange?.(response.note);
      }

      // Only close modal and reset state if the operation was successful
      setPassword("");
      setConfirmPassword("");
      setShowLockModal(false);
      setLockAction(null);
    } catch (err) {
      console.error("Lock operation error:", err);
      const errorMessage =
        err.response?.data?.errors?.current_password?.[0] ||
        err.response?.data?.errors?.password?.[0] ||
        err.response?.data?.message ||
        "An error occurred while performing the lock operation";
      setError(errorMessage);
      // message.error(errorMessage);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setPassword("");
    setConfirmPassword("");
    setError("");
    setShowLockModal(false);
    setLockAction(null);
  };

  return (
    <Modal
      title={
        isEnable
          ? "Set Initial Password"
          : isDisable
          ? "Disable Lock Feature"
          : isUnlock
          ? "Unlock Note"
          : "Lock Note"
      }
      open={showLockModal}
      onOk={handleConfirm}
      onCancel={handleCancel}
      okText={
        isEnable
          ? "Set and Lock"
          : isDisable
          ? "Disable"
          : isUnlock
          ? "Unlock"
          : "Lock"
      }
      cancelText="Cancel"
      confirmLoading={loading}
    >
      <div className="space-y-4">
        <div>
          <label
            className={`block ${themeClasses.font.small} font-medium ${themeClasses.text.secondary} mb-1`}
          >
            {isEnable
              ? "Set Password"
              : isDisable
              ? "Enter Password to Disable"
              : isUnlock
              ? "Enter Password to Unlock"
              : "Enter Password"}
          </label>
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={
              isEnable ? "Enter password (min 6 characters)" : "Enter password"
            }
            minLength={6}
            className="w-full"
            disabled={loading}
          />
        </div>
        {isEnable && (
          <div>
            <label
              className={`block ${themeClasses.font.small} font-medium ${themeClasses.text.secondary} mb-1`}
            >
              Confirm Password
            </label>
            <Input.Password
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              minLength={6}
              className="w-full"
              disabled={loading}
            />
          </div>
        )}
        {error && (
          <p className={`text-red-500 ${themeClasses.font.small}`}>{error}</p>
        )}
      </div>
    </Modal>
  );
};

export default NoteLockModal;
