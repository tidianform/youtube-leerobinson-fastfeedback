import useSWR from "swr";

import { useAuth } from "@/lib/auth";
import fetcher from "@/utils/fetcher";

import EmptyState from "@/components/EmptyState";
import SiteTableSkeleton from "@/components/SiteTableSkeleton";
import DashboardShell from "@/components/DashboardShell";
import SiteTable from "@/components/SiteTable";

const Dashboard = () => {
  const { user } = useAuth();
  const { data } = useSWR("/api/sites", fetcher);

  console.log(data);

  // if(!user){
  //   // redirect
  // }

  if (!data) {
    return (
      <DashboardShell>
        <SiteTableSkeleton />
      </DashboardShell>
    );
  }
  return (
    <DashboardShell>
      {data.sites.length > 0 ? (
        <SiteTable sites={data.sites} />
      ) : (
        <EmptyState />
      )}
    </DashboardShell>
  );
};

export default Dashboard;