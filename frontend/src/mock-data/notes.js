const spaces = [
  { id: 1, name: "Work", color: "bg-red-500" },
  { id: 2, name: "Study", color: "bg-blue-500" },
  { id: 3, name: "Personal", color: "bg-green-500" },
  { id: 4, name: "Ideas", color: "bg-yellow-500" },
];

const defaultNotes = [
  {
    id: 1,
    title: "Meeting Notes",
    content: "Discuss project timeline and deliverables.",
    tags: [
      { name: "Urgent", color: "bg-red-400" },
      { name: "Work", color: "bg-yellow-400" },
    ],
    spaceId: 1,
    files: [{ name: "agenda.pdf", size: 1200000 }],
    createdAt: "2025-04-30",
  },
  {
    id: 2,
    title: "Study Plan",
    content: "Revise chapters 1-3 for the exam.",
    tags: [
      { name: "Study", color: "bg-blue-400" },
      { name: "Exam", color: "bg-purple-400" },
    ],
    spaceId: 2,
    files: [],
    createdAt: "2025-04-30",
  },
  {
    id: 3,
    title: "Grocery List",
    content: "Milk, Eggs, Bread, Chicken, Spinach",
    tags: [{ name: "Personal", color: "bg-green-400" }],
    spaceId: 3,
    files: [],
    createdAt: "2025-03-29",
  },
  {
    id: 4,
    title: "Startup Idea",
    content: "An app that connects language learners with native speakers.",
    tags: [
      { name: "Ideas", color: "bg-yellow-400" },
      { name: "Brainstorm", color: "bg-gray-400" },
    ],
    spaceId: 4,
    files: [],
    createdAt: "2025-04-15",
  },
  {
    id: 5,
    title: "Weekend Plan",
    content: "Visit the botanical garden and read a new book.",
    tags: [
      { name: "Relax", color: "bg-pink-400" },
      { name: "Personal", color: "bg-green-400" },
    ],
    spaceId: 3,
    files: [],
    createdAt: "2025-03-02",
  },
];

const notes = JSON.parse(localStorage.getItem("notes")) || defaultNotes;

export { spaces, notes };