import StudentChat from "../student-chat";

export const metadata = {
  title: "Physics Chat — CuriousClass",
  description: "Chat with the AI tutor. Explore Physics topics like Reflection & Mirrors through Socratic dialogue.",
};

export default function PhysicsPage() {
  return <StudentChat subject="physics" />;
}
