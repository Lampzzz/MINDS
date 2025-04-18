import PageContainer from "@/components/layout/page-container";
import TotalData from "./total-data";
import { ShelterPieGraph } from "./shelter-status-graph";
import { AreaGraph } from "./resident-graph";
import { MonthSelect, YearSelect } from "./select-filters";

export default function OverviewPage() {
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4 mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
          <div className="flex space-x-4">
            <YearSelect />
            <MonthSelect />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <TotalData />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            <AreaGraph />
          </div>
          <div className="col-span-4 md:col-span-3">
            <ShelterPieGraph />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
