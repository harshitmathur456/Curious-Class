import TeacherDashboard from "./teacher-dashboard";

export const metadata = {
  title: "Teacher Dashboard — CuriousClass",
  description:
    "Monitor student comprehension in real-time. View heatmaps, focus alerts, and AI-generated insights for your classroom.",
};

export default function TeacherPage() {
  return <TeacherDashboard />;
}
