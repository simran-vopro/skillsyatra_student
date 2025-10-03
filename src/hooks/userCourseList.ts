import { useAxios } from "./useAxios";
import { API_PATHS } from "../utils/config";
import { Course } from "../types/course";


export interface PaginationModel {
  page?: number;
  pageSize?: number;
}

// interface UseCourseListProps {
//   searchQuery?: string;
//   paginationModel?: PaginationModel;
// }

export const useCourseList = () => {
  // const { page, pageSize} = paginationModel;

  // const query = useMemo(() => {
  //   const params: Record<string, string> = {};

  //   if (searchQuery) params.search = searchQuery;
  //   if (page !== undefined) params.page = (page + 1).toString(); // 1-based index
  //   if (pageSize !== undefined) params.limit = pageSize.toString();

  //   return new URLSearchParams(params).toString();
  // }, [searchQuery, page, pageSize]);

  const { data, metaData, loading, error, refetch } = useAxios<Course[]>({
    url: API_PATHS.COURSES,
  });

  return {
    courseData: data || [],
    metaData,
    loading,
    error,
    refetch,
  };
};
