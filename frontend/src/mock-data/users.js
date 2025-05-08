export const mockUsers = [
  {
    id: 1,
    email: "john@example.com",
    display_name: "John Doe",
    password: "123456", // In a real app, this would be hashed
    avatar: "https://i.pravatar.cc/150?img=1",
    preferences: {
      theme: "light",
      fontSize: "medium",
      noteColors: ["#ffebee", "#e8f5e9", "#e3f2fd"],
    },
    email_verified_at: "2024-03-15T10:00:00Z",
    created_at: "2024-03-15T10:00:00Z",
    updated_at: "2024-03-15T10:00:00Z",
  },
  {
    id: 2,
    email: "jane@example.com",
    display_name: "Jane Smith",
    password: "password456",
    avatar: "https://i.pravatar.cc/150?img=2",
    preferences: {
      theme: "dark",
      fontSize: "large",
      noteColors: ["#fce4ec", "#e0f7fa", "#fff3e0"],
    },
    email_verified_at: "2024-03-14T15:30:00Z",
    created_at: "2024-03-14T15:30:00Z",
    updated_at: "2024-03-14T15:30:00Z",
  },
  {
    id: 3,
    email: "bob@example.com",
    display_name: "Bob Wilson",
    password: "password789",
    avatar: "https://i.pravatar.cc/150?img=3",
    preferences: {
      theme: "light",
      fontSize: "small",
      noteColors: ["#f3e5f5", "#e8eaf6", "#f1f8e9"],
    },
    email_verified_at: "2024-03-13T09:15:00Z",
    created_at: "2024-03-13T09:15:00Z",
    updated_at: "2024-03-13T09:15:00Z",
  },
];
