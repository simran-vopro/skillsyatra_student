import { useNavigate } from "react-router";
import {
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";
// import { useAxios } from "../../hooks/useAxios";
// import { API_PATHS } from "../../utils/config";

export default function EcommerceMetrics() {
  const navigate = useNavigate();
  // const { metaData: productMetaData, loading: productLoading } = useProductList();
  //get all agents
  // const {
  //   data: productMetaData,
  // } = useAxios<number>({
  //   url: API_PATHS.PRODUCTS_COUNT,
  //   method: "get",
  // });


  // //get all agents
  // const {
  //   data: userCount,
  // } = useAxios<number>({
  //   url: API_PATHS.USERS_COUNT,
  //   method: "get",
  // });




  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Enrollments
            </span>



            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {/* {userCount} */}
              1000
            </h4>
          </div>


          <div onClick={() => navigate("/customers")} className="cursor-pointer">
            <Badge color="info">
              {/* <ArrowUpIcon /> */}
              View
            </Badge>      </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Courses Published
            </span>

            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              10 {/* {productMetaData} */}
            </h4>


          </div>

          <div onClick={() => navigate("/products")} className="cursor-pointer">
            <Badge color="info">
              {/* <ArrowDownIcon /> */}
              View
            </Badge>
          </div>


        </div>
      </div>

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Pending Course Approvals
            </span>

            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              10 {/* {productMetaData} */}
            </h4>


          </div>

          <div onClick={() => navigate("/products")} className="cursor-pointer">
            <Badge color="info">
              {/* <ArrowDownIcon /> */}
              View
            </Badge>
          </div>


        </div>
      </div>

      {/* <!-- Metric Item End --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Active Users
            </span>

            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              10 {/* {productMetaData} */}
            </h4>


          </div>

          <div onClick={() => navigate("/products")} className="cursor-pointer">
            <Badge color="info">
              {/* <ArrowDownIcon /> */}
              View
            </Badge>
          </div>


        </div>
      </div>
    </div>
  );
}
