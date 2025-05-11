import { CheckCircleFilled, EditOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { Form, Input } from "antd";

const ProfileOverview = ({ user }) => {
    return (
      <div>
        {!user.isVerified && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md flex items-center gap-3">
            <ExclamationCircleFilled className="text-yellow-500" />
            <div>
              <p className="text-sm text-yellow-700">
                Your account is not verified. Please check your email to
                activate your account.
              </p>
              <button className="text-blue-600 hover:underline text-sm mt-1">
                Resend verification email
              </button>
            </div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row items-start gap-6 mb-6">
          <img
            src={user.avatar || "https://via.placeholder.com/150"}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover border border-gray-200"
          />
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  {user.display_name}
                  {user.isVerified ? (
                    <CheckCircleFilled className="text-green-500" />
                  ) : (
                    <ExclamationCircleFilled className="text-yellow-500" />
                  )}
                </h2>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-gray-500 text-sm">
                  Member since:{" "}
                  {new Date(
                    user.createdAt || "2025-01-01"
                  ).toLocaleDateString()}
                </p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2">
                <EditOutlined />
                Edit
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
            <Form layout="vertical" className="space-y-4">
              <Form.Item
                name="display_name"
                label="Display Name"
                initialValue={user.display_name}
                rules={[
                  {
                    required: true,
                    message: "Please enter your display name",
                  },
                ]}
              >
                <Input
                  placeholder="Enter display name"
                  className="rounded-md"
                />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                initialValue={user.email}
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
                  className="rounded-md"
                />
              </Form.Item>
              <Form.Item>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Save
                </button>
              </Form.Item>
            </Form>
          </div>
          <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
            <h3 className="text-lg font-medium text-gray-700 mb-3">
              Account Status
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Account Active:</span>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      user.isActive ? "bg-green-500" : "bg-gray-400"
                    }`}
                  ></div>
                  <span>{user.isActive ? "Active" : "Inactive"}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span>Email Verified:</span>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      user.isVerified ? "bg-green-500" : "bg-yellow-500"
                    }`}
                  ></div>
                  <span>{user.isVerified ? "Verified" : "Not Verified"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default ProfileOverview;