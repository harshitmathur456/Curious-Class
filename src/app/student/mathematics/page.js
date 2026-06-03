import StudentChat from "../student-chat";

export const metadata = {
  title: "Mathematics Chat — CuriousClass",
  description: "Chat with the AI tutor. Explore Mathematics topics like Linear Equations through Socratic dialogue.",
};

export default function MathematicsPage() {
  return <StudentChat subject="mathematics" />;
}
