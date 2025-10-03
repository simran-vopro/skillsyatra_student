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

export const useStudentsList = () => {
  // const { page, pageSize} = paginationModel;

  // const query = useMemo(() => {
  //   const params: Record<string, string> = {};

  //   if (searchQuery) params.search = searchQuery;
  //   if (page !== undefined) params.page = (page + 1).toString(); // 1-based index
  //   if (pageSize !== undefined) params.limit = pageSize.toString();

  //   return new URLSearchParams(params).toString();
  // }, [searchQuery, page, pageSize]);

  const { data, metaData, loading, error, refetch } = useAxios<Course[]>({
    url: API_PATHS.STUDENTS,
  });

  return {
    instructorData: data || [
      {
        userId: "user123",
        firstName: "John",
        lastName: "Doe",
        email: "john@gmail.com",
        phone: "1234567890",
        address: "123 Main St, City, Country",
        isActive: true,
        suspended: false,
        totalCourses: 5,
        totalSpent: 250,
        _id: "1",
      },
      {
        userId: "user456",
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@gmail.com",
        phone: "9876543210",
        address: "456 Elm St, City, Country",
        isActive: false,
        suspended: false,
        totalCourses: 2,
        totalSpent: 50,
        _id: "2",
      },
      {
        userId: "user678",
        firstName: "Sumith",
        lastName: "Doe",
        email: "sumith@gmail.com",
        phone: "9976543210",
        address: "456 Elm St, City, Country",
        isActive: false,
        suspended: false,
        totalCourses: 0,
        totalSpent: 0,
        _id: "3",
      },
    ],
    metaData,
    loading,
    error,
    refetch,
  };
};
