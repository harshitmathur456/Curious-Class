// ─── Chat Messages (Student Chat Demo) ───────────────────────────
export const demoChatMessages = [
  {
    id: 1,
    sender: 'ai',
    mode: 'question',
    text: "Welcome! Today we're exploring the **Salt March of 1930**. Let's start with a big question: Gandhi had many options to protest British rule — petitions, boycotts, armed rebellion. Why do you think he chose *salt* as the symbol for his protest?",
    timestamp: '10:02 AM',
  },
  {
    id: 2,
    sender: 'student',
    text: 'Because salt was something everyone needed, rich or poor. So it united people.',
    timestamp: '10:03 AM',
  },
  {
    id: 3,
    sender: 'ai',
    mode: 'explano',
    text: "Interesting point about unity. But here's a challenge: **water** is also something everyone needs. Why didn't Gandhi march against the water tax? What made salt *specifically* powerful as a symbol of resistance — beyond just being universally needed?",
    timestamp: '10:03 AM',
  },
  {
    id: 4,
    sender: 'student',
    text: 'Maybe because the British had a specific law — the Salt Act — that made it illegal for Indians to make their own salt? So breaking that law was a direct challenge.',
    timestamp: '10:05 AM',
  },
  {
    id: 5,
    sender: 'ai',
    mode: 'follow-up',
    text: "Excellent reasoning! You've identified something crucial — the Salt Act made it a *legal* act of defiance, not just a symbolic one. Now think about this: recently, farmers in Gujarat protested against new agricultural laws by refusing to sell crops at government mandis. How is their strategy similar to Gandhi's approach with salt?",
    timestamp: '10:05 AM',
  },
  {
    id: 6,
    sender: 'student',
    text: 'Both used something from daily life — salt and crops — to make a political point. And both broke or challenged a specific government rule rather than protesting in general.',
    timestamp: '10:07 AM',
  },
  {
    id: 7,
    sender: 'ai',
    mode: 'explano',
    text: "Strong connection! But consider this counterargument: the farmers' protest involved *withholding* something from the market, while Gandhi's march involved *creating* something (making salt). Does this difference matter? Could one strategy be more effective than the other for building a mass movement?",
    timestamp: '10:07 AM',
  },
];

export const suggestedChips = [
  'Maybe to show defiance?',
  "Petitions didn't work before...",
  'Taki sab log jud sakein?',
];

// ─── Topic Progress (Student Sidebar) ─────────────────────────────
export const topicProgress = [
  { id: 1, label: 'Causes of Civil Disobedience', status: 'completed' },
  { id: 2, label: 'The Salt March', status: 'active' },
  { id: 3, label: 'Impact & Legacy', status: 'upcoming' },
];

export const todaysGoal = {
  topic: 'Salt March & Civil Disobedience',
  objective: 'Understand why Gandhi chose salt as a symbol and connect historical protest to modern movements.',
};

// ─── Teacher Dashboard Data ───────────────────────────────────────
export const dashboardStats = [
  {
    id: 'participants',
    label: 'Active participants',
    value: '32',
    total: '/40',
    trend: '↑12%',
    variant: 'green',
  },
  {
    id: 'comprehension',
    label: 'Avg comprehension',
    value: '82%',
    total: '',
    trend: '↑4%',
    variant: 'green',
  },
  {
    id: 'alerts',
    label: 'Critical focus alerts',
    value: '3',
    total: ' students',
    trend: '',
    variant: 'red',
  },
];

export const currentUnit = {
  name: 'Modern Indian History',
  description: 'Focusing on Indian Independence movement',
  currentTopic: 'Non-Cooperation Movement',
};

// ─── Heatmap Data ─────────────────────────────────────────────────
export const heatmapSubtopics = ['Causes', 'Events', 'Impact', 'Leaders'];

export const heatmapStudents = [
  {
    name: 'Aarav M.',
    scores: [100, 50, 100, 100], // maps to color stops
  },
  {
    name: 'Rahul K.',
    scores: [30, 10, 50, 30],
  },
  {
    name: 'Priya S.',
    scores: [100, 100, 100, 50],
  },
  {
    name: 'Neha J.',
    scores: [50, 50, 10, 30],
  },
  {
    name: 'Vikram S.',
    scores: [80, 30, 60, 10],
  },
  {
    name: 'Ananya D.',
    scores: [100, 80, 100, 100],
  },
];

// ─── Focus Alerts ─────────────────────────────────────────────────
export const focusAlerts = [
  {
    id: 1,
    student: 'Rahul K.',
    timeAgo: '5m ago',
    description: 'Struggling with cause-effect logic regarding economic boycotts.',
    priority: 'urgent',
    aiInsight:
      'Rahul consistently identifies events correctly but cannot explain *why* they happened. He listed 3 boycott actions but attributed all of them to "anger" without distinguishing economic pressure from political strategy. Consider asking him to compare two protests with different motivations.',
  },
  {
    id: 2,
    student: 'Neha J.',
    timeAgo: '12m ago',
    description: 'Missed historical sequence of Chauri Chaura incident.',
    priority: 'urgent',
    aiInsight:
      'Neha placed Chauri Chaura *after* the Salt March, suggesting a gap in chronological understanding. She correctly identified the violence but did not connect it to Gandhi\'s decision to suspend Non-Cooperation. A timeline exercise may help.',
  },
  {
    id: 3,
    student: 'Vikram S.',
    timeAgo: '1h ago',
    description: 'Inactive for >15 minutes during interactive quiz.',
    priority: 'low',
    aiInsight:
      'Vikram answered the first two questions quickly and correctly, then stopped responding. This may indicate disengagement after initial success rather than comprehension issues. Consider a check-in.',
  },
];

// ─── Student Roster (for teacher views) ───────────────────────────
export const studentRoster = [
  { id: 1, name: 'Aarav M.', rollNo: '01', lastActive: '2m ago' },
  { id: 2, name: 'Rahul K.', rollNo: '02', lastActive: '5m ago' },
  { id: 3, name: 'Priya S.', rollNo: '03', lastActive: '1m ago' },
  { id: 4, name: 'Neha J.', rollNo: '04', lastActive: '12m ago' },
  { id: 5, name: 'Vikram S.', rollNo: '05', lastActive: '1h ago' },
  { id: 6, name: 'Ananya D.', rollNo: '06', lastActive: '3m ago' },
  { id: 7, name: 'Rohan P.', rollNo: '07', lastActive: '8m ago' },
  { id: 8, name: 'Kavya R.', rollNo: '08', lastActive: '4m ago' },
];

// ─── Teacher Nav Items ────────────────────────────────────────────
export const teacherNavItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid', href: '/teacher' },
  { id: 'students', label: 'Students', icon: 'users', href: '/teacher' },
  { id: 'notes', label: 'Notes', icon: 'book', href: '/teacher' },
  { id: 'reports', label: 'Reports', icon: 'bar-chart', href: '/teacher' },
];

// ─── Explano Responses (for simulator) ───────────────────
export const explanoResponses = [
  "That's a common explanation, but let me challenge it. If {concept} was truly the reason, then why didn't {counter_example} happen? Think deeper about what *specific* conditions made this outcome possible.",
  "You're partially right, but consider this: {alternative_view}. How would you defend your original position against this counterargument?",
  "Interesting! But a historian might argue the exact opposite — that {contrary_point}. Can you find evidence in what we've discussed to either support or refute that claim?",
];

export const followUpResponses = [
  "Great thinking! You've identified the key mechanism. Now let's push further: how does this connect to {next_concept}?",
  "Excellent point about {student_insight}. Can you think of a modern-day example where the same principle applies?",
  "You're building a strong argument. One more layer: what would have happened if {counterfactual}? How would the outcome change?",
];

// ─── Subject & Grade Data (for topic logger) ──────────────────────
export const grades = [
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
];

export const subjects = [
  'History', 'Geography', 'Science', 'Mathematics', 'Civics', 'Economics',
];

export const topicsBySubject = {
  History: [
    'Indian Independence Movement',
    'Non-Cooperation Movement',
    'Salt March',
    'Quit India Movement',
    'Partition of India',
    'Mughal Empire',
    'Vedic Period',
  ],
  Geography: [
    'Water Resources',
    'Climate of India',
    'Natural Vegetation',
    'Soil Types',
    'Agriculture',
    'Industries',
    'Minerals & Energy Resources',
  ],
  Science: [
    'Electric Circuits',
    'Chemical Reactions',
    'Light & Reflection',
    'Force & Motion',
    'Human Body Systems',
    'Reproduction in Plants',
    'Acids, Bases & Salts',
  ],
  Mathematics: [
    'Linear Equations',
    'Quadratic Equations',
    'Triangles',
    'Statistics',
    'Probability',
    'Surface Area & Volume',
    'Coordinate Geometry',
  ],
  Civics: [
    'Democracy',
    'Indian Constitution',
    'Fundamental Rights',
    'Local Government',
    'Judiciary',
    'Gender & Politics',
  ],
  Economics: [
    'Poverty',
    'Food Security',
    'Money & Banking',
    'Globalisation',
    'Consumer Rights',
    'Development',
  ],
};
