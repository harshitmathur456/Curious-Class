import StudentChat from "../student-chat";

export const metadata = {
  title: "History — CuriousClass",
  description: "Explore History topics, critical historical events, and Socratic dialogues in CuriousClass.",
};

export default function HistoryPage() {
  return <StudentChat subject="history" />;
}
