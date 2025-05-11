const defaultNotes = [
  {
    id: 1,
    title: "Meeting Notes",
    content: "Discuss project timeline and deliverables",
    labels: [
      { name: "Work", color: "#000000" },
      { name: "Urgent", color: "#f5222d" },
    ],
    files: [{ name: "agenda.pdf", size: 1200000 }],
    lockStatus: { isLocked: false, password: null },
    createdAt: "2025-04-30",
  },
  {
    id: 2,
    title: "Study Plan",
    content: "Review chapters 1-3 for upcoming exam",
    labels: [
      { name: "Study", color: "#1890ff" },
      { name: "Exam", color: "#722ed1" },
    ],
    files: [],
    lockStatus: { isLocked: false, password: null },
    createdAt: "2025-04-30",
  },
  {
    id: 3,
    title: "Shopping List",
    content: "Milk, eggs, bread, vegetables",
    labels: [{ name: "Personal", color: "#52c41a" }],
    files: [],
    lockStatus: { isLocked: false, password: null },
    createdAt: "2025-03-29",
  },
  {
    id: 4,
    title: "Project Ideas",
    content: "Brainstorming session notes",
    labels: [
      { name: "Ideas", color: "#2f54eb" },
      { name: "Work", color: "#000000" },
    ],
    files: [],
    lockStatus: { isLocked: false, password: null },
    createdAt: "2025-04-15",
  },
  {
    id: 5,
    title: "Weekend Plan",
    content: "Visit the botanical garden and read a new book.",
    labels: [
      { name: "Relax", color: "#eb2f96" },
      { name: "Personal", color: "#52c41a" },
    ],
    files: [],
    lockStatus: { isLocked: false, password: null },
    createdAt: "2025-03-02",
  },
];

const notes = JSON.parse(localStorage.getItem("notes")) || defaultNotes;

export { notes };
