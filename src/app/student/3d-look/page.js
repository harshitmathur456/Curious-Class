import Take3DLookView from "@/components/3d/Take3DLookView";

export const metadata = {
  title: "Take a 3D Look — CuriousClass",
  description: "Interactive 3D Surface Graphs and 2D Line Plots for mathematical equations in CuriousClass.",
};

export default async function Take3DLookPage({ searchParams }) {
  const params = await searchParams;
  const initialEquation = params?.eq || "2x + 3";

  return <Take3DLookView initialEquation={initialEquation} />;
}
