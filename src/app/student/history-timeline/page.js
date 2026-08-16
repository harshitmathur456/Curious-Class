import HistoryTimelineView from "@/components/history-timeline/HistoryTimelineView";

export const metadata = {
  title: "History Timeline Explorer — CuriousClass",
  description: "Interactive historical event timelines, turning points, and key figures in CuriousClass.",
};

export default async function HistoryTimelinePage({ searchParams }) {
  const params = await searchParams;
  const topic = params?.topic || "salt-march";

  return <HistoryTimelineView topic={topic} />;
}
