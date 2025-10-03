// export const BASE_URL = "https://work-safety-backend.onrender.com";
// export const IMAGE_URL = "https://work-safety-backend.onrender.com/static";

export const BASE_URL = "http://localhost:5000";
export const IMAGE_URL = "http://localhost:5000/static";

export const API_PATHS = {

  // auth
  LOGIN: `${BASE_URL}/api/auth/login`,

  //CATEGORIES
  CATEGORIES: `${BASE_URL}/api/category`,

  //COURSEs
  COURSES: `${BASE_URL}/api/course`,
  COURSE_DETAIL: `${BASE_URL}/api/course/detail`,
  ADD_COURSE: `${BASE_URL}/api/course/add`,
  ADD_COURSE_DRAFT :  `${BASE_URL}/api/course/add/draft`,
  EDIT_COURSE: `${BASE_URL}/api/course/edit`,
  COURSE_DELETE: `${BASE_URL}/api/course/delete`,
  COURSE_VISIBILITY: `${BASE_URL}/api/course/status`,

  //INSTRUCTORS
  INSTRUCTORS: `${BASE_URL}/api/instructor`,
  ADD_INSTRUCTOR: `${BASE_URL}/api/instructor/add`,

  //STUDNETS
  STUDENTS: `${BASE_URL}/api/student`,

};
