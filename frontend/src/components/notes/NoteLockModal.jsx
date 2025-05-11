// import { Modal, Input } from "antd";
// import { useState } from "react";
// import { useNote } from "../../contexts/NotesContext";
// import toast from "react-hot-toast";

// const NoteLockModal = () => {
//   const { showLockModal, setShowLockModal, note, handleLockConfirm } =
//     useNote();

//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState("");

//   const isLocking = !note.lockStatus?.isLocked;

//   const handleConfirm = () => {
//     setError("");

//     if (isLocking) {
//       // Locking the note
//       if (password.length < 6) {
//         setError("Password must be at least 6 digits");
//         return;
//       }

//       if (password !== confirmPassword) {
//         setError("Passwords do not match");
//         return;
//       }

//       // Check if password is already used in another note
//       const notes = JSON.parse(localStorage.getItem("notes")) || [];
//       const isPasswordUsed = notes.some(
//         (n) =>
//           n.id !== note.id &&
//           n.lockStatus?.isLocked &&
//           n.lockStatus?.password === password
//       );

//       if (isPasswordUsed) {
//         setError("This password is already used in another note");
//         return;
//       }

//       handleLockConfirm(password);
//       toast.success("Note locked successfully");
//     } else {
//       // Unlocking the note
//       if (password !== note.lockStatus?.password) {
//         setError("Incorrect password");
//         return;
//       }
//       handleLockConfirm(null);
//       toast.success("Note unlocked successfully");
//     }

//     // Reset form
//     setPassword("");
//     setConfirmPassword("");
//     setShowLockModal(false);
//   };

//   const handleCancel = () => {
//     setPassword("");
//     setConfirmPassword("");
//     setError("");
//     setShowLockModal(false);
//   };

//   return (
//     <Modal
//       title={isLocking ? "Lock Note" : "Unlock Note"}
//       open={showLockModal}
//       onOk={handleConfirm}
//       onCancel={handleCancel}
//       okText={isLocking ? "Lock" : "Unlock"}
//       cancelText="Cancel"
//     >
//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             {isLocking ? "Enter Password" : "Enter Password to Unlock"}
//           </label>
//           <Input.Password
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder={
//               isLocking ? "Enter 6-digit password" : "Enter password"
//             }
//             maxLength={6}
//             className="w-full"
//           />
//         </div>

//         {isLocking && (
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Confirm Password
//             </label>
//             <Input.Password
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               placeholder="Confirm password"
//               maxLength={6}
//               className="w-full"
//             />
//           </div>
//         )}

//         {error && <p className="text-red-500 text-sm">{error}</p>}
//       </div>
//     </Modal>
//   );
// };

// export default NoteLockModal;

import { Modal, Input } from "antd";
import { useState } from "react";
import { useNote } from "../../contexts/NotesContext";
import toast from "react-hot-toast";

const NoteLockModal = () => {
  const { showLockModal, setShowLockModal, note, handleLockConfirm } =
    useNote();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const isSettingPassword =
    note.lockFeatureEnabled && !note.lockStatus?.password;
  const isUnlocking = note.lockStatus?.isLocked;
  const isDisabling =
    note.lockFeatureEnabled && !isSettingPassword && !isUnlocking;

  const handleConfirm = () => {
    setError("");

    if (isSettingPassword) {
      // Setting password for the first time
      if (password.length < 6) {
        setError("Password must be at least 6 digits");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      const allNotes = JSON.parse(localStorage.getItem("notes")) || [];
      if (
        allNotes.some(
          (n) =>
            n.id !== note.id &&
            n.lockStatus?.isLocked &&
            n.lockStatus?.password === password
        )
      ) {
        setError("This password is already used by another note");
        return;
      }
      handleLockConfirm(password, true, true);
      toast.success("Note locked successfully");
    } else if (isUnlocking) {
      // Unlocking note
      if (password !== note.lockStatus?.password) {
        setError("Incorrect password");
        return;
      }
      handleLockConfirm(note.lockStatus?.password, true, false);
      toast.success("Note unlocked successfully");
    } else if (isDisabling) {
      // Disabling lock feature
      if (
        !note.lockStatus?.password 
      ) {
        setError("Incorrect password");

        return;
      }
      else if (password !== note.lockStatus?.password) {
        setError("Wrong password");
        return;
      }
      handleLockConfirm(null, false, false);
      toast.success("Lock feature disabled");
    }

    setPassword("");
    setConfirmPassword("");
    setShowLockModal(false);
  };

  const handleCancel = () => {
    setPassword("");
    setConfirmPassword("");
    setError("");
    setShowLockModal(false);
  };

  return (
    <Modal
      title={
        isSettingPassword
          ? "Set Password"
          : isDisabling
          ? "Disable Lock Feature"
          : "Unlock Note"
      }
      open={showLockModal}
      onOk={handleConfirm}
      onCancel={handleCancel}
      okText={
        isSettingPassword ? "Set and Lock" : isDisabling ? "Disable" : "Unlock"
      }
      cancelText="Cancel"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {isSettingPassword
              ? "Set Password"
              : isDisabling
              ? "Enter Password to Disable"
              : "Enter Password to Unlock"}
          </label>
          <Input.Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={
              isSettingPassword ? "Enter 6-digit password" : "Enter password"
            }
            minLength={6}
            className="w-full"
          />
        </div>

        {isSettingPassword && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <Input.Password
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              minLength={6}
              className="w-full"
            />
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </Modal>
  );
};

export default NoteLockModal;