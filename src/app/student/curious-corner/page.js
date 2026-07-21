import StudentChat from "../student-chat";

export const metadata = {
  title: "Curious Corner — CuriousClass",
  description: "Explore live news on subjects you are studying.",
};

export default function CuriousCornerPage() {
  return <StudentChat isCuriousCorner={true} />;
}
