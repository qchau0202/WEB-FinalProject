<<<<<<< HEAD
export const mockCollaborators = [
  {
    id: 1,
    uuid: "user-1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://i.pravatar.cc/150?img=1",
    permission: "edit",
    status: "accepted",
    accepted_at: "2024-03-20T10:00:00Z",
  },
  {
    id: 2,
    uuid: "user-2",
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "https://i.pravatar.cc/150?img=2",
    permission: "read",
    status: "accepted",
    accepted_at: "2024-03-19T15:30:00Z",
  },
  {
    id: 3,
    uuid: "user-3",
    name: "Mike Johnson",
    email: "mike@example.com",
    avatar: "https://i.pravatar.cc/150?img=3",
    permission: "edit",
    status: "pending",
    accepted_at: null,
=======
// frontend/src/mock-data/collaborators.js

export const mockCollaborators = [
  {
    uuid: "user-1",
    name: "Alice Johnson",
    email: "alice@example.com",
    avatarUrl: "https://randomuser.me/api/portraits/women/1.jpg",
    permission: "edit",
  },
  {
    uuid: "user-2",
    name: "Bob Smith",
    email: "bob@example.com",
    avatarUrl: "https://randomuser.me/api/portraits/men/2.jpg",
    permission: "read",
  },
  {
    uuid: "user-3",
    name: "Charlie Lee",
    email: "charlie@example.com",
    avatarUrl: "https://randomuser.me/api/portraits/men/3.jpg",
    permission: "edit",
  },
  {
    uuid: "user-4",
    name: "Dana White",
    email: "dana@example.com",
    avatarUrl: "https://randomuser.me/api/portraits/women/4.jpg",
    permission: "read",
>>>>>>> 6bdd6d7c66b4ef51f188d44a7a11976137dd83f9
  },
];
