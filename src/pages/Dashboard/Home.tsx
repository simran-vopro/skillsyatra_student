import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import PageMeta from "../../components/common/PageMeta";
import ReportsAnalytics from "../ReportsAnalytics/reportsAnalytics";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Work Safety - Work Wear and Safety Solutions "
        description="Gear Up with Work Safety: Your Trusted Workwear"
      />
      {/* <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-12">
          <EcommerceMetrics />

        </div>



        <div className="col-span-12">
          <StatisticsChart />
        </div>


      </div> */}


      <ReportsAnalytics />


    </>
  );
}
