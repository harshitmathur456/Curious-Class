import ClientTake3DLookWrapper from "@/components/3d/ClientTake3DLookWrapper";

export const metadata = {
  title: "Take a 3D Look — CuriousClass",
  description: "Interactive 3D Surface Graphs and 2D Line Plots for mathematical equations in CuriousClass.",
};

export default async function Take3DLookPage(props) {
  let initialEquation = "2x + 3";
  try {
    const searchParams = props?.searchParams ? await props.searchParams : null;
    if (searchParams?.eq) {
      initialEquation = searchParams.eq;
    }
  } catch (e) {
    // Fallback safely if searchParams resolution fails
  }

  return <ClientTake3DLookWrapper initialEquation={initialEquation} />;
}
