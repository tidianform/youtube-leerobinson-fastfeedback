import useSWR from "swr";

import { useAuth } from "@/lib/auth";
import fetcher from "@/utils/fetcher";

import EmptyState from "@/components/EmptyState";
import SiteTableSkeleton from "@/components/SiteTableSkeleton";
import DashboardShell from "@/components/DashboardShell";
import FeedbackTable from "@/components/FeedbackTable";
import FeedbackTableHeader from "@/components/FeedbackTableHeader";

const MyFeedback = () => {
  const { user } = useAuth();
  const { data } = useSWR(user ? ["/api/feedback", user.token] : null, fetcher);

  // if(!user){
  //   // redirect
  // }

  if (!data) {
    return (
      <DashboardShell>
        <FeedbackTableHeader />
        <SiteTableSkeleton />
      </DashboardShell>
    );
  }
  return (
    <DashboardShell>
      <FeedbackTableHeader />
      {data.feedback.length ? (
        <FeedbackTable allFeedback={data.feedback} />
      ) : (
        <EmptyState />
      )}
    </DashboardShell>
  );
};

export default MyFeedback;
