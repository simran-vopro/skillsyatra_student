// import { useEffect, useMemo, useState } from "react";
// import { ChevronLeft, ChevronRight, Trash } from "lucide-react";
// import Input from "../../components/form/input/InputField";
// import TextArea from "../../components/form/input/TextArea";
// import Select from "../../components/form/input/SelectField";
// import Button from "../../components/ui/button/Button";
// import ReactQuill from 'react-quill-new';
// import 'react-quill-new/dist/quill.snow.css';
// import { useAxios } from "../../hooks/useAxios";
// import { API_PATHS, IMAGE_URL } from "../../utils/config";
// import Label from "../../components/form/Label";
// import { CategoryType, Course, Instructor } from "../../types/course";
// import { useLocation, useNavigate } from "react-router";
// import DropzoneComponent from "../../components/form/form-elements/DropZone";
// import { useAuth } from "../../hooks/useAuth";


// export default function EditCourse() {
//     const [step, setStep] = useState(1);

//     const location = useLocation();
//     const { courseId } = location.state || {};

//     const {
//         data: courseData,
//         loading: courseDefaultLoading
//     } = useAxios({
//         url: courseId ? `${API_PATHS.COURSE_DETAIL}/${courseId}` : "",
//         method: "get",
//     });

//     useEffect(() => {
//         if (!courseDefaultLoading) {
//             setCourse(courseData);
//         }
//     }, [courseData, courseDefaultLoading]);

//     const [course, setCourse] = useState<Course>({
//         "createdBy": "admin",
//         "title": "",
//         "thumbnail": "",
//         "promoVideo": "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/rMadI-Zz9l0vd44f0/videoblocks-web-development_sk0c_cpra__4f01f9139763fa3bae63e48025ef7f14__P360.mp4",
//         "description": "Learn the fundamentals of web development, including HTML, CSS, JavaScript, and building your first responsive website. Perfect for complete beginners.",
//         "language": "English",
//         "pricingType": "paid",
//         "pricing": 100,
//         "category": {
//             "_id": "",
//             "name": ""
//         },
//         "instructor": {
//             "_id": "",
//             "email": "",
//             "password": "",
//             "phone": "",
//             "firstName": "",
//             "lastName": "",
//             "address": "",
//             "city": ""
//         },
//         "whatYouLearn": "<ol><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>- Build responsive websites using HTML and CSS</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span> - Add interactivity with JavaScript</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span> - Understand the basics of web hosting and domains </li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>- Create a personal portfolio site</li></ol>",
//         "courseInclude": "<ol><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>- 5 hours of video content </li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>- Downloadable code examples </li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>- Certificate of completion</li></ol>",
//         "audience": "<ol><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span><em>Beginners who want to start learning web development from scratch.</em></li></ol>",
//         "requirements": "<ol><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span><em>No programming experience needed. Just a computer and internet connection.</em></li></ol>",
//         "certificate": true,
//         "modules": [
//             {
//                 "name": "Getting Started with Web Development",
//                 "chapters": [
//                     {
//                         "title": "Introduction to the Web",
//                         "description": "Learn what the web is, how websites work, and the tools you'll need.",
//                         "video": "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/BgrICs-NZj4hksnn3/videoblocks-65cb91da59b1a96035c0302e_rqehnhvsna__0843fd16dd5ec76cfa9fddae8422748b__P360.mp4",
//                         "audio": "",
//                         "image": "",
//                         "quiz": [
//                             {
//                                 type: "mcq",
//                                 "question": "Which of the following is a web browser?",
//                                 "options": [
//                                     { "name": "Google Chrome" },
//                                     { "name": "Microsoft Word" },
//                                     { "name": "Adobe Photoshop" },
//                                     { "name": "Final Cut Pro" }
//                                 ],
//                                 "answer": "Google Chrome"
//                             }
//                         ]
//                     },
//                     {
//                         "title": "Installing Your Development Environment",
//                         "description": "Set up VS Code and essential extensions for a better coding experience.",
//                         "video": "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/H5BOVymHiplawzr0/65-q29tccax-f6mrvq6wvg__f22aeb0baa4333c60dfe1f0f8ace7056__P360.mp4",
//                         "audio": "",
//                         "image": "",
//                         "quiz": [
//                             {
//                                 type: "mcq",
//                                 "question": "What editor are we using in this course?",
//                                 "options": [
//                                     { "name": "Sublime Text" },
//                                     { "name": "Atom" },
//                                     { "name": "Visual Studio Code" },
//                                     { "name": "Notepad" }
//                                 ],
//                                 "answer": "Visual Studio Code"
//                             }
//                         ]
//                     }
//                 ]
//             },
//         ]
//     });




//     const { adminToken } = useAuth();
//     const {
//         loading: editLoading,
//         refetch: editCourseRequest,
//     } = useAxios({
//         url: `${API_PATHS.EDIT_COURSE}/${course._id}`,
//         method: "put",
//         manual: true,
//         config: {
//             headers: {
//                 "Content-Type": "multipart/form-data",
//             },
//             Authorization: adminToken ? `Bearer ${adminToken}` : "",
//         }
//     });

//     const [showSuggestions, setShowSuggestions] = useState(false);
//     const {
//         data: categories,
//     } = useAxios<CategoryType[]>({
//         url: API_PATHS.CATEGORIES,
//         method: "get",
//     });
//     const filteredCategories = useMemo(() => {
//         const search = course?.category?.name.toLowerCase();
//         return (
//             categories?.filter((category: CategoryType) =>
//                 category.name.toLowerCase().includes(search)
//             ) || []
//         );
//     }, [course?.category?.name, categories]);



//     const {
//         data: instructors,
//     } = useAxios<Instructor[]>({
//         url: API_PATHS.INSTRUCTORS,
//         method: "get",
//     });
//     const [showInstructorSuggestions, setShowInstructorSuggestions] = useState(false);
//     const filteredInstructors = useMemo(() => {
//         const search = course.instructor.firstName.toLowerCase();
//         return (instructors?.filter((instructor: Instructor) =>
//             instructor.firstName.toLowerCase().includes(search) ||
//             instructor.lastName.toLowerCase().includes(search)
//         ) || []
//         );
//     }, [course.instructor, instructors]);



//     const buildCourseFormData = (course: Course) => {
//         const formData = new FormData();

//         // Top-level fields
//         formData.append("createdBy", course.createdBy);
//         formData.append("title", course.title);
//         formData.append("promoVideo", course.promoVideo);
//         formData.append("description", course.description);
//         formData.append("language", course.language);
//         formData.append("pricingType", course.pricingType);
//         formData.append("pricing", course.pricing?.toString());
//         formData.append("certificate", course.certificate?.toString());

//         // Thumbnail (file or string)
//         if (typeof course.thumbnail === "string") {
//             formData.append("thumbnail", course.thumbnail);
//         } else if (course.thumbnail instanceof File) {
//             formData.append("thumbnail", course.thumbnail, course.thumbnail.name);
//         }

//         // Category
//         if (course?.category._id) {
//             formData.append("category[_id]", course.category._id);
//         }
//         formData.append("category[name]", course.category.name);

//         // Instructor
//         Object.entries(course.instructor).forEach(([key, value]) => {
//             formData.append(`instructor[${key}]`, value);
//         });

//         // HTML strings
//         formData.append("whatYouLearn", course.whatYouLearn);
//         formData.append("courseInclude", course.courseInclude);
//         formData.append("audience", course.audience);
//         formData.append("requirements", course.requirements);

//         // Modules and Chapters
//         course.modules.forEach((module, mIdx) => {
//             formData.append(`modules[${mIdx}][name]`, module.name);

//             module.chapters.forEach((chapter, cIdx) => {
//                 const base = `modules[${mIdx}][chapters][${cIdx}]`;

//                 formData.append(`${base}[title]`, chapter.title);
//                 formData.append(`${base}[description]`, chapter.description);
//                 formData.append(`${base}[video]`, chapter.video);

//                 // Audio
//                 if (typeof chapter.audio === "string") {
//                     formData.append(`${base}[audio]`, chapter.audio);
//                 } else if (chapter.audio instanceof File) {
//                     formData.append(`${base}[audio]`, chapter.audio, chapter.audio.name);
//                 }

//                 // Image
//                 if (typeof chapter.image === "string") {
//                     formData.append(`${base}[image]`, chapter.image);
//                 } else if (chapter.image instanceof File) {
//                     formData.append(`${base}[image]`, chapter.image, chapter.image.name);
//                 }

//                 // Quiz
//                 chapter.quiz.forEach((q, qIdx) => {
//                     formData.append(`${base}[quiz][${qIdx}][question]`, q.question);
//                     q.options.forEach((opt, oIdx) => {
//                         formData.append(`${base}[quiz][${qIdx}][options][${oIdx}][name]`, opt.name);
//                     });
//                     formData.append(`${base}[quiz][${qIdx}][answer]`, q.answer);
//                 });
//             });
//         });

//         return formData;
//     };

//     const navigate = useNavigate();
//     const handleSubmit = async () => {
//         const formData = buildCourseFormData(course);

//         const { success } = await editCourseRequest({ body: formData });
//         if (success) {
//             navigate("/courses")
//             setCourse({
//                 createdBy: "admin",
//                 title: "",
//                 thumbnail: "",
//                 promoVideo: "",
//                 description: "",
//                 language: "English",
//                 pricingType: "paid",
//                 pricing: 0,
//                 category: { _id: "", name: "" },
//                 instructor: {
//                     _id: "",
//                     email: "",
//                     password: "",
//                     phone: "",
//                     firstName: "",
//                     lastName: "",
//                     address: "",
//                     city: ""
//                 },
//                 whatYouLearn: "",
//                 courseInclude: "",
//                 audience: "",
//                 requirements: "",
//                 certificate: true,
//                 modules: []
//             });
//         }
//     };

//     const next = () => setStep((s) => s + 1);
//     const prev = () => setStep((s) => s - 1);

//     return (
//         <div className="space-y-4" >
//             <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white ">{course?.title}</h2>
//             <p className="mb-10">Admin can edit this course here.</p>

//             {/* Step Tabs */}
//             <div className="flex space-x-2 text-xs font-semibold " >
//                 {
//                     ["Category", "Basic", "Curriculum", "Metadata", "Pricing", "Publish"].map((label, i) => (
//                         <button
//                             key={i}
//                             className={`px-3 py-1 border flex items-center space-x-1 rounded-2xl ${step === i + 1 ? "bg-sky-600 text-white" : "bg-gray-100 dark:bg-gray-700"
//                                 }`}
//                             onClick={() => setStep(i + 1)}
//                         >
//                             <span>{i + 1}.</span>
//                             <span>{label}</span>
//                         </button>
//                     ))
//                 }
//             </div >

//             {/* Progress Bar */}
//             < div className="h-1 w-full bg-gray-200 rounded overflow-hidden" >
//                 <div
//                     className="h-1 bg-sky-600 transition-all"
//                     style={{ width: `${(step / 6) * 100}%` }}
//                 />
//             </div >

//             {/* Step 1: Category */}
//             {
//                 step === 1 && (
//                     <section className="rounded-xl p-4  bg-white dark:bg-black text-xs space-y-2">
//                         <Label>Category</Label>
//                         <div className="relative">
//                             <input
//                                 type="text"
//                                 className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
//                                 placeholder="Start typing a user's name..."
//                                 value={course.category.name}
//                                 onChange={(e) => {
//                                     const value = e.target.value;

//                                     if (value.trim() === "") {
//                                         // If input is cleared, reset the entire customer form
//                                         setCourse({ ...course, category: { name: "" } }),
//                                             setShowSuggestions(false);
//                                     } else {
//                                         setCourse({ ...course, category: { name: value } });
//                                         setShowSuggestions(true);
//                                     }
//                                 }}
//                                 onFocus={() => setShowSuggestions(true)}
//                             />
//                             {showSuggestions && filteredCategories.length > 0 && (
//                                 <ul className="absolute z-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 mt-1 rounded max-h-40 overflow-y-auto w-full text-sm">
//                                     {filteredCategories.map((category: CategoryType) => (
//                                         <li
//                                             key={category._id}
//                                             className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
//                                             onClick={() => {
//                                                 setCourse({
//                                                     ...course,
//                                                     category: {
//                                                         _id: category._id,  // ✅ Add this
//                                                         name: category.name,
//                                                     }
//                                                 });
//                                                 setShowSuggestions(false);
//                                             }}
//                                         >
//                                             {category?.name}
//                                         </li>
//                                     ))}
//                                 </ul>
//                             )}
//                         </div>

//                     </section>
//                 )
//             }



//             {
//                 step === 2 && (
//                     <section className="rounded-xl  bg-white dark:bg-black p-4 text-xs space-y-2">
//                         {[
//                             { label: "Title", value: course.title, field: "title" },
//                             { label: "Short Description", value: course.description, field: "description", type: "textarea" },
//                             { label: "Language", value: course.language, field: "language" },
//                             { label: "Thumbnail URL", value: course.thumbnail, field: "thumbnail", type: "image" },
//                             { label: "Promo Video", value: course.promoVideo, field: "promoVideo" },
//                         ].map(({ label, value, field, type }) => {
//                             const normalizedValue = typeof value === "string" ? value : URL.createObjectURL(value);

//                             return (
//                                 <div key={field}>
//                                     <Label>{label}</Label>
//                                     {type === "textarea" ? (
//                                         <TextArea
//                                             placeholder={label}
//                                             value={typeof value === "string" ? value : ""}
//                                             onChange={(v) => setCourse({ ...course, [field]: v })}
//                                         />
//                                     ) : type === "image" ? (
//                                         <DropzoneComponent
//                                             accept={{ "image/*": [".jpg", ".jpeg", ".png"] }}
//                                             label="Upload Thumbnail Image"
//                                             helperText="Only .jpg, .jpeg, or .png files are supported"
//                                             previewFile={(typeof value === "string" && value.startsWith("/uploads")) ? IMAGE_URL + value : normalizedValue}
//                                             onDrop={(files: File[]) => {
//                                                 const file = files[0];
//                                                 setCourse({ ...course, thumbnail: file });
//                                             }}
//                                         />
//                                     ) : (
//                                         <Input
//                                             placeholder={label}
//                                             value={typeof value === "string" ? value : ""}
//                                             onChange={(e) => setCourse({ ...course, [field]: e.target.value })}
//                                         />
//                                     )}
//                                 </div>
//                             );
//                         })}

//                         {/* <Label>Instructor</Label>
//                     <Select
//                         placeholder="Instructor"
//                         options={[{ value: "1", label: "John" }]}
//                         value={course.instructor.firstName}
//                         onChange={(v) => setCourse({ ...course, instructor: { ...course.instructor, firstName: v } })}
//                     /> */}

//                         <div className="pt-4 space-y-2">
//                             <Label className="font-bold text-sm">Instructor Details</Label>


//                             <div className="relative">
//                                 <input
//                                     type="text"
//                                     className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
//                                     placeholder="Start typing an instructor's name..."
//                                     value={course.instructor.firstName}
//                                     onChange={(e) => {
//                                         const value = e.target.value;

//                                         if (value.trim() === "") {
//                                             setCourse((prev) => ({
//                                                 ...prev,
//                                                 instructor: {
//                                                     ...prev.instructor,
//                                                     firstName: "",
//                                                     lastName: "",
//                                                     email: "",
//                                                     password: "",
//                                                     phone: "",
//                                                     address: "",
//                                                     city: "",
//                                                 },
//                                             }));
//                                             setShowInstructorSuggestions(false);
//                                         } else {
//                                             setCourse((prev) => ({
//                                                 ...prev,
//                                                 instructor: {
//                                                     ...prev.instructor,
//                                                     firstName: value,
//                                                 },
//                                             }));
//                                             setShowInstructorSuggestions(true);
//                                         }
//                                     }}
//                                     onFocus={() => setShowInstructorSuggestions(true)}
//                                 />

//                                 {showInstructorSuggestions && filteredInstructors.length > 0 && (
//                                     <ul className="absolute z-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 mt-1 rounded max-h-40 overflow-y-auto w-full text-sm">
//                                         {filteredInstructors.map((instructor) => (
//                                             <li
//                                                 key={instructor._id}
//                                                 className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
//                                                 onClick={() => {
//                                                     setCourse((prev) => ({
//                                                         ...prev,
//                                                         instructor: { ...instructor },
//                                                     }));
//                                                     setShowInstructorSuggestions(false);
//                                                 }}
//                                             >
//                                                 {instructor.firstName} {instructor.lastName}
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 )}

//                             </div>

//                             {[
//                                 { label: "First Name", field: "firstName" },
//                                 { label: "Last Name", field: "lastName" },
//                                 { label: "Email", field: "email" },
//                                 { label: "Password", field: "password", type: "password" },
//                                 { label: "Phone", field: "phone" },
//                                 { label: "Address", field: "address" },
//                                 { label: "City", field: "city" },
//                             ].map(({ label, field, type }) => (
//                                 <div key={field}>
//                                     <Label>{label}</Label>
//                                     <Input
//                                         type={type || "text"}
//                                         placeholder={label}
//                                         value={course.instructor[field as keyof Instructor]}
//                                         onChange={(e) =>
//                                             setCourse((prev) => ({
//                                                 ...prev,
//                                                 instructor: {
//                                                     ...prev.instructor,
//                                                     [field]: e.target.value,
//                                                 },
//                                             }))
//                                         }
//                                     />
//                                 </div>
//                             ))}

//                         </div>



//                         {/* <Button variant="outline" onClick={() => toast.success("Draft saved!")}>
//                         Save Draft
//                     </Button> */}
//                     </section>
//                 )
//             }

//             {
//                 step === 3 && (
//                     <section className="rounded-xl p-4  bg-white dark:bg-black text-xs space-y-4">
//                         {course.modules.map((mod, mIdx) => (
//                             <details
//                                 key={mIdx}
//                                 className="border rounded p-3 bg-white dark:bg-gray-800"
//                             >
//                                 <summary className="font-semibold flex justify-between items-center">
//                                     {mod.name || "Untitled Module"}
//                                     <button
//                                         onClick={(e) => {
//                                             e.preventDefault();
//                                             const mods = [...course.modules];
//                                             mods.splice(mIdx, 1);
//                                             setCourse({ ...course, modules: mods });
//                                         }}
//                                         title="Delete module"
//                                     >
//                                         <Trash size={14} className="text-red-500" />
//                                     </button>
//                                 </summary>

//                                 <div className="mt-3 space-y-3">
//                                     <Label>Module Title</Label>
//                                     <Input
//                                         placeholder="Module Title"
//                                         value={mod.name}
//                                         onChange={(e) => {
//                                             const mods = [...course.modules];
//                                             mods[mIdx].name = e.target.value;
//                                             setCourse({ ...course, modules: mods });
//                                         }}
//                                     />

//                                     {mod.chapters.map((ch, cIdx) => (
//                                         <div
//                                             key={cIdx}
//                                             className="pl-3 border-l-4 border-blue-400 bg-gray-50 p-3 rounded relative space-y-3"
//                                         >
//                                             <div className="flex justify-between items-center">
//                                                 <Label>Chapter Title</Label>
//                                                 <button
//                                                     onClick={() => {
//                                                         const mods = [...course.modules];
//                                                         mods[mIdx].chapters.splice(cIdx, 1);
//                                                         setCourse({ ...course, modules: mods });
//                                                     }}
//                                                     title="Delete chapter"
//                                                 >
//                                                     <Trash size={12} className="text-red-500" />
//                                                 </button>
//                                             </div>
//                                             <Input
//                                                 placeholder="Chapter Title"
//                                                 value={ch.title}
//                                                 onChange={(e) => {
//                                                     const mods = [...course.modules];
//                                                     mods[mIdx].chapters[cIdx].title = e.target.value;
//                                                     setCourse({ ...course, modules: mods });
//                                                 }}
//                                             />

//                                             <Label>Description</Label>
//                                             <ReactQuill
//                                                 theme="snow"
//                                                 value={ch.description || ""}
//                                                 onChange={(v) => {
//                                                     const mods = [...course.modules];
//                                                     mods[mIdx].chapters[cIdx].description = v;
//                                                     setCourse({ ...course, modules: mods });
//                                                 }}
//                                                 className="text-xs mb-15"
//                                                 style={{ height: 200 }}
//                                             />

//                                             <Label>Video URL</Label>
//                                             <Input
//                                                 placeholder="Video URL"
//                                                 value={ch.video || ""}
//                                                 onChange={(e) => {
//                                                     const mods = [...course.modules];
//                                                     mods[mIdx].chapters[cIdx].video = e.target.value;
//                                                     setCourse({ ...course, modules: mods });
//                                                 }}
//                                             />


//                                             <Label>Audio URL</Label>
//                                             <DropzoneComponent
//                                                 accept={{
//                                                     "audio/*": [".mp3", ".wav", ".m4a", ".aac", ".ogg"],
//                                                 }}
//                                                 label="Upload Audio"
//                                                 helperText="Only .mp3, .wav, .m4a, .aac, or .ogg files are supported"
//                                                 previewFile={(typeof ch.audio === "string" && ch.audio.startsWith("/uploads")) ? IMAGE_URL + ch.audio : ch.audio}
//                                                 onDrop={(files: File[]) => {
//                                                     console.log(files)
//                                                     const mods = [...course.modules];
//                                                     mods[mIdx].chapters[cIdx].audio = files[0];
//                                                     setCourse({ ...course, modules: mods });
//                                                 }}
//                                             />
//                                             <Label>Image URL</Label>
//                                             <DropzoneComponent accept={{
//                                                 "image/*": [".jpg", ".jpeg", ".png"],
//                                             }}
//                                                 label="Upload Image"
//                                                 helperText="Only .jpg, .jpeg, or .png files are supported"
//                                                 previewFile={(typeof ch.image === "string" && ch.image.startsWith("/uploads")) ? IMAGE_URL + ch.image : ch.image}

//                                                 onDrop={(files: File[]) => {
//                                                     const mods = [...course.modules];
//                                                     mods[mIdx].chapters[cIdx].image = files[0];
//                                                     setCourse({ ...course, modules: mods });
//                                                 }}
//                                             />

//                                             {/* Quizzes */}
//                                             <div className="space-y-4 mt-3">
//                                                 {ch.quiz.map((q, qIdx) => (
//                                                     <div
//                                                         key={qIdx}
//                                                         className="border rounded p-3 bg-white dark:bg-gray-700 space-y-2"
//                                                     >
//                                                         <div className="flex justify-between items-center">
//                                                             <h4 className="font-semibold">Quiz #{qIdx + 1}</h4>
//                                                             <button
//                                                                 className="text-red-500"
//                                                                 onClick={() => {
//                                                                     const mods = [...course.modules];
//                                                                     mods[mIdx].chapters[cIdx].quiz.splice(qIdx, 1);
//                                                                     setCourse({ ...course, modules: mods });
//                                                                 }}
//                                                             >
//                                                                 <Trash size={14} />
//                                                             </button>
//                                                         </div>

//                                                         <Label>Question</Label>
//                                                         <Input
//                                                             placeholder="Enter question text"
//                                                             value={q.question}
//                                                             onChange={(e) => {
//                                                                 const mods = [...course.modules];
//                                                                 mods[mIdx].chapters[cIdx].quiz[qIdx].question = e.target.value;
//                                                                 setCourse({ ...course, modules: mods });
//                                                             }}
//                                                         />

//                                                         <Label>Options</Label>
//                                                         <div className="space-y-2">
//                                                             {q.options.map((opt, optIdx) => (
//                                                                 <div key={optIdx} className="flex items-center space-x-2">
//                                                                     <Input
//                                                                         className="flex-1"
//                                                                         placeholder={`Option ${optIdx + 1}`}
//                                                                         value={opt.name}
//                                                                         onChange={(e) => {
//                                                                             const mods = [...course.modules];
//                                                                             mods[mIdx].chapters[cIdx].quiz[qIdx].options[optIdx].name = e.target.value;
//                                                                             setCourse({ ...course, modules: mods });
//                                                                         }}
//                                                                     />
//                                                                     <button
//                                                                         onClick={() => {
//                                                                             const mods = [...course.modules];
//                                                                             mods[mIdx].chapters[cIdx].quiz[qIdx].options.splice(optIdx, 1);
//                                                                             setCourse({ ...course, modules: mods });
//                                                                         }}
//                                                                         className="text-red-500"
//                                                                     >
//                                                                         <Trash size={12} />
//                                                                     </button>
//                                                                 </div>
//                                                             ))}
//                                                             <Button
//                                                                 size="sm"
//                                                                 onClick={() => {
//                                                                     const mods = [...course.modules];
//                                                                     mods[mIdx].chapters[cIdx].quiz[qIdx].options.push({ name: "" });
//                                                                     setCourse({ ...course, modules: mods });
//                                                                 }}
//                                                             >
//                                                                 + Add Option
//                                                             </Button>
//                                                         </div>

//                                                         <Label>Correct Answer (Text)</Label>
//                                                         <Input
//                                                             placeholder="Enter correct option text"
//                                                             value={q.answer}
//                                                             onChange={(e) => {
//                                                                 const mods = [...course.modules];
//                                                                 mods[mIdx].chapters[cIdx].quiz[qIdx].answer = e.target.value;
//                                                                 setCourse({ ...course, modules: mods });
//                                                             }}
//                                                         />
//                                                     </div>
//                                                 ))}
//                                                 <Button
//                                                     size="sm"
//                                                     variant="outline"
//                                                     onClick={() => {
//                                                         const mods = [...course.modules];
//                                                         mods[mIdx].chapters[cIdx].quiz.push({
//                                                             type: "mcq",
//                                                             question: "",
//                                                             options: [{ name: "" }],
//                                                             answer: ""
//                                                         });
//                                                         setCourse({ ...course, modules: mods });
//                                                     }}
//                                                 >
//                                                     + Add Quiz
//                                                 </Button>
//                                             </div>
//                                         </div>
//                                     ))}

//                                     <Button
//                                         size="sm"
//                                         onClick={() => {
//                                             const mods = [...course.modules];
//                                             mods[mIdx].chapters.push({
//                                                 title: "",
//                                                 description: "",
//                                                 video: "",
//                                                 audio: "",
//                                                 image: "",
//                                                 quiz: [
//                                                     {
//                                                         type: "mcq",
//                                                         question: "",
//                                                         options: [{ name: "" }],
//                                                         answer: ""
//                                                     }
//                                                 ]
//                                             });
//                                             setCourse({ ...course, modules: mods });
//                                         }}
//                                     >
//                                         + Add Chapter
//                                     </Button>
//                                 </div>
//                             </details>
//                         ))}

//                         <Button
//                             size="sm"
//                             onClick={() =>
//                                 setCourse({
//                                     ...course,
//                                     modules: [...course.modules, {
//                                         name: "",
//                                         chapters: []
//                                     }]
//                                 })
//                             }
//                         >
//                             + Add Module
//                         </Button>
//                     </section>
//                 )
//             }


//             {/* Step 4: Metadata */}
//             {
//                 step === 4 && (
//                     <section className="rounded-xl  bg-white dark:bg-black p-4 text-xs space-y-4">
//                         <div className="flex flex-col col-span-full mb-15">
//                             <Label>
//                                 What You’ll Learn <span className="text-error-500">*</span>
//                             </Label>
//                             <ReactQuill
//                                 theme="snow"
//                                 value={course.whatYouLearn}
//                                 onChange={(value) => setCourse({ ...course, whatYouLearn: value })}
//                                 placeholder="Describe what students will learn in this course"
//                                 style={{ height: "200px" }}
//                             />
//                         </div>

//                         <div className="flex flex-col col-span-full mb-15">
//                             <Label>
//                                 Course Includes <span className="text-error-500">*</span>
//                             </Label>
//                             <ReactQuill
//                                 theme="snow"
//                                 value={course.courseInclude}
//                                 onChange={(value) => setCourse({ ...course, courseInclude: value })}
//                                 placeholder="List what’s included (e.g. videos, PDFs, quizzes)"
//                                 style={{ height: "200px" }}
//                             />
//                         </div>

//                         <div className="flex flex-col col-span-full mb-15">
//                             <Label>
//                                 Target Audience <span className="text-error-500">*</span>
//                             </Label>
//                             <ReactQuill
//                                 theme="snow"
//                                 value={course.audience}
//                                 onChange={(value) => setCourse({ ...course, audience: value })}
//                                 placeholder="Who is this course for?"
//                                 style={{ height: "200px" }}
//                             />
//                         </div>

//                         <div className="flex flex-col col-span-full mb-15">
//                             <Label>
//                                 Requirements <span className="text-error-500">*</span>
//                             </Label>
//                             <ReactQuill
//                                 theme="snow"
//                                 value={course.requirements}
//                                 onChange={(value) => setCourse({ ...course, requirements: value })}
//                                 placeholder="What are the prerequisites for this course?"
//                                 style={{ height: "200px" }}
//                             />
//                         </div>

//                         <Label className="flex items-center space-x-2">
//                             <input
//                                 type="checkbox"
//                                 checked={course.certificate ?? false}
//                                 onChange={(e) =>
//                                     setCourse({
//                                         ...course,
//                                         certificate: e.target.checked
//                                     })
//                                 }
//                             />
//                             <span>Certificate of Completion</span>
//                         </Label>
//                     </section>
//                 )
//             }


//             {
//                 step === 5 && (
//                     <section className="rounded-xl p-4 bg-white dark:bg-black text-xs space-y-2">
//                         <Label>
//                             Pricing Type <span className="text-error-500">*</span>
//                         </Label>
//                         <Select
//                             placeholder="Pricing Type"
//                             options={[
//                                 { value: "free", label: "Free" },
//                                 { value: "paid", label: "Paid" },
//                             ]}
//                             value={course.pricingType}
//                             onChange={(v) => setCourse({ ...course, pricingType: v })}
//                             className="mb-3"
//                         />

//                         <Label>Price</Label>
//                         <Input type="number" placeholder="Price" value={course.pricing} onChange={e => setCourse({ ...course, pricing: Number(e.target.value) || 0 })} />
//                     </section>
//                 )
//             }


//             {
//                 step === 6 && course && (
//                     <section className="rounded-xl p-4 bg-slate-50 dark:bg-slate-800 text-sm space-y-6">
//                         <h2 className="text-xl font-semibold border-b pb-2">Course Overview</h2>

//                         {/* Thumbnail and Promo Video */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div className="border rounded-lg p-2 bg-white dark:bg-slate-700">
//                                 <img src={typeof course.thumbnail === "string" ? IMAGE_URL + course.thumbnail : URL.createObjectURL(course.thumbnail)} alt="Thumbnail" className="rounded w-full h-[400px] object-cover" />
//                             </div>
//                             <div className="border rounded-lg p-2 bg-white dark:bg-slate-700">
//                                 <video
//                                     src={course.promoVideo}
//                                     controls
//                                     className="rounded w-full h-auto object-cover"
//                                 />
//                             </div>
//                         </div>

//                         {/* Course Info */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div className="border rounded-lg p-4 bg-white dark:bg-slate-700 space-y-2">
//                                 <p><strong>Title:</strong> {course.title}</p>
//                                 <p><strong>Description:</strong> {course.description}</p>
//                                 <p><strong>Language:</strong> {course.language}</p>
//                                 <p><strong>Pricing:</strong> {course.pricingType === 'free' ? 'Free' : `$${course.pricing}`}</p>
//                                 <p><strong>Status:</strong> {course.status ? 'Active' : 'Inactive'}</p>
//                                 <p><strong>Created By:</strong> {course.createdBy}</p>
//                             </div>
//                             <div className="border rounded-lg p-4 bg-white dark:bg-slate-700 space-y-2">
//                                 <p><strong>Category:</strong> {course.category?.name}</p>
//                                 <p><strong>Instructor:</strong> {`${course.instructor?.firstName} ${course.instructor?.lastName}`}</p>
//                                 <p><strong>Email:</strong> {course.instructor?.email}</p>
//                                 <p><strong>Phone:</strong> {course.instructor?.phone}</p>
//                             </div>
//                         </div>

//                         {/* Rich Text Sections */}
//                         {[
//                             { title: "What You'll Learn", html: course.whatYouLearn },
//                             { title: "Course Includes", html: course.courseInclude },
//                             { title: "Requirements", html: course.requirements },
//                             { title: "Target Audience", html: course.audience },
//                         ].map(({ title, html }) => (
//                             <div key={title}>
//                                 <h3 className="text-md font-semibold border-b mb-2">{title}</h3>
//                                 <div
//                                     className="prose dark:prose-invert max-w-full text-sm border rounded p-3 bg-white dark:bg-slate-700"
//                                     dangerouslySetInnerHTML={{ __html: html }}
//                                 />
//                             </div>
//                         ))}

//                         {/* Modules & Chapters */}
//                         <div>
//                             <h3 className="text-md font-semibold border-b mb-2">Modules & Chapters</h3>
//                             <div className="space-y-4">
//                                 {course.modules?.map((mod: any, i: number) => (
//                                     <div key={i} className="border rounded-lg p-4 bg-white dark:bg-slate-700">
//                                         <p className="font-semibold text-indigo-600 dark:text-indigo-400">
//                                             Module {i + 1}: {mod.name}
//                                         </p>

//                                         {mod.chapters?.map((ch: any, j: number) => (
//                                             <div key={j} className="ml-4 mt-3 border-t pt-2">
//                                                 <p className="font-medium">Chapter {j + 1}: {ch.title}</p>
//                                                 <div
//                                                     className="prose dark:prose-invert text-sm"
//                                                     dangerouslySetInnerHTML={{ __html: ch.description }}
//                                                 />


//                                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5">
//                                                     <div className="border rounded-lg p-2 bg-white dark:bg-slate-700">

//                                                         <img src={typeof ch.image === "string" ? IMAGE_URL + ch.image : URL.createObjectURL(ch.image)} alt="Thumbnail" className="rounded w-full h-[250px] object-cover" />
//                                                     </div>
//                                                     <div className="border rounded-lg p-2 bg-white dark:bg-slate-700">
//                                                         <video
//                                                             src={ch.video}
//                                                             controls
//                                                             className="rounded w-full h-[250px] object-cover"
//                                                         />
//                                                     </div>
//                                                     <div className="border rounded-lg p-2 bg-white dark:bg-slate-700">
//                                                         <audio controls className="mx-auto my-4 w-full">
//                                                             <source src={typeof ch.audio === "string" ? IMAGE_URL + ch.audio : URL.createObjectURL(ch.audio)} />
//                                                             Your browser does not support the audio element.
//                                                         </audio>
//                                                     </div>
//                                                 </div>

//                                                 {ch.quiz?.length > 0 && (
//                                                     <div className="mt-2 ml-4">
//                                                         <p className="font-semibold">Quiz:</p>
//                                                         {ch.quiz.map((q: any, k: number) => (
//                                                             <div key={k} className="text-sm mt-1">
//                                                                 <p>Q{k + 1}: {q.question}</p>
//                                                                 <ul className="list-disc list-inside">
//                                                                     {q.options.map((opt: any, i: number) => (
//                                                                         <li key={i}>{opt.name}</li>
//                                                                     ))}
//                                                                 </ul>
//                                                                 <p className="text-green-600 dark:text-green-400">Answer: {q.answer}</p>
//                                                             </div>
//                                                         ))}
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         ))}
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         <Button disabled={editLoading} onClick={handleSubmit} className="w-full mt-4">
//                             Edit Course
//                         </Button>
//                     </section>
//                 )
//             }

//             <div className="flex justify-between mt-4 text-xs">
//                 <Button variant="outline" onClick={prev} disabled={step === 1}><ChevronLeft size={12} /> Back</Button>
//                 {step < 6 && <Button onClick={next}>Next <ChevronRight size={12} /></Button>}
//             </div>
//         </div >
//     );
// }
