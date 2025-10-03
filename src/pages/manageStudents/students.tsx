import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import moment from "moment";

import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { Avatar, Box, IconButton, Switch, Tooltip } from "@mui/material";
import { Edit2, Eye, Trash2 } from "lucide-react";

import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import DataTable from "../../components/common/DataTable";
import ConfirmModal from "../../components/common/ConfirmModal";

import { useAxios } from "../../hooks/useAxios";

import { API_PATHS, IMAGE_URL } from "../../utils/config";
import { Instructor } from "../../types/course";
import { useStudentsList } from "../../hooks/userStudentsList";


export default function StudentsManagement() {
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState("");

    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        pageSize: 50,
        page: 0,
    });

    const { instructorData, refetch, metaData, loading } = useStudentsList();

    // Modal state
    const [deleteCourse, setDeleteCourse] = useState<Instructor | null>(null);
    const [statusChangeCourse, setStatusChangeCourse] = useState<Instructor | null>(null);

    // ========================================> handle delete
    const {
        refetch: deleteCourseById,
    } = useAxios({
        url: deleteCourse ? `${API_PATHS.COURSE_DELETE}/${deleteCourse._id}` : "",
        method: "delete",
        manual: true,
    });

    const handleDelete = async () => {
        await deleteCourseById();
        refetch();
        setDeleteCourse(null);
    };


    // ========================================> update visisbility
    // Change Status
    const {
        refetch: statusChangeRequest,
    } = useAxios({
        url: statusChangeCourse ? `${API_PATHS.COURSE_VISIBILITY}/${statusChangeCourse._id}` : "",
        method: "put",
        body: { isActive: !statusChangeCourse?.isActive },
        manual: true,
    });

    const handleConfirmStatusChange = async () => {
        if (!statusChangeCourse) return;
        await statusChangeRequest();
        refetch();
        setStatusChangeCourse(null);
    };


    const courseColumns: GridColDef[] = useMemo(
        () => [
            {
                field: "thumbnail",
                headerName: "Image",
                width: 80,
                renderCell: (params) => (
                    <Avatar
                        src={params.value?.startsWith("/uploads") ? IMAGE_URL + params.value : params.value}
                        alt={params.row.title}
                        variant="square"
                        sx={{ width: 48, height: 48 }}
                    />
                ),
                sortable: false,
                filterable: false,
            },
            {
                field: "createdAt", headerName: "Created At", width: 150, renderCell: (params) => (
                    <>
                        {moment(params.value).format("DD-MM-YYYY HH:MM")}
                    </>
                )
            },
            {
                field: "userId",
                headerName: "User Id",
                width: 150,
            },
            {
                field: "firstName", headerName: "Full Name", width: 150, renderCell: (params) => (
                    <>
                        {`${params.row.firstName} ${params.row.lastName}`}
                    </>
                )
            },
            { field: "email", headerName: "Email", width: 200 },
            {
                field: "phone",
                headerName: "Phone",
                width: 150,
            },

            {
                field: "address",
                headerName: "Address",
                width: 150,
            },
            {
                field: "totalCourses",
                headerName: "Total Courses",
                renderCell: (params) => (
                    <>

                        <div onClick={() => navigate(`/courses`, { state: { studentId: params.row.userId } })} className="text-blue-600 cursor-pointer">
                            {params.row.totalCourses}
                        </div>
                    </>
                ),
                width: 100,
            },
            {
                field: "totalSpent",
                headerName: "Total Spent",
                renderCell: (params) => (
                    <>

                        <div onClick={() => navigate(`/payments`, { state: { studentId: params.row.userId } })} className="text-blue-600 cursor-pointer">
                            {params.row.totalSpent}
                        </div>
                    </>
                ),
                width: 100,
            },
            {
                field: "suspended",
                headerName: "Suspended",
                renderCell: (params) => (
                    <Box display="flex" justifyContent="center" width="100%">
                        <Switch
                            checked={params.value}
                            onChange={() => setStatusChangeCourse(params.row)}
                            size="small"
                        />
                    </Box>
                ),
                width: 100,
            },
            {
                field: "isActive",
                headerName: "Visibility",
                width: 80,
                align: "center",
                headerAlign: "center",
                renderCell: (params) => (
                    <Box display="flex" justifyContent="center" width="100%">
                        <Switch
                            checked={params.value}
                            onChange={() => setStatusChangeCourse(params.row)}
                            size="small"
                        />
                    </Box>
                ),
            },

            {
                field: "actions",
                headerName: "Actions",
                width: 120,
                align: "center",
                headerAlign: "center",
                renderCell: (params) => (
                    <Box>

                        <Tooltip title="view">
                            <IconButton
                                onClick={() => navigate(`/studentDetails`)}
                                color="primary"
                                size="small">
                                <Eye size={16} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                            <IconButton
                                color="primary"
                                size="small">
                                <Edit2 size={16} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton
                                color="error"
                                size="small"
                                onClick={() => setDeleteCourse(params.row)}>
                                <Trash2 size={16} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                ),
                sortable: false,
                filterable: false,
                cellClassName: "actions-column-sticky",
                headerClassName: "actions-column-sticky",
            },
        ],
        [instructorData]
    );

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Manage Students
                </h2>
                <div className="flex items-center gap-3">
                    <div>
                        <Input
                            name="search"
                            type="search"
                            placeholder="Search students by tier, course, user id..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button
                        variant="primary"
                        size="sm"
                    >
                        Create New Student
                    </Button>

                    {/* <Button variant="outline" size="sm" onClick={() => setCsvModalOpen(true)}>
                        Upload CSV
                    </Button> */}
                </div>
            </div>

            <DataTable
                rows={instructorData || []}
                rowCount={metaData?.total || 0}
                pagination
                paginationMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={(model) => setPaginationModel(model)}
                loading={loading}
                columns={courseColumns}
                getRowId={(row: any) => row._id}
            />

            {/* Confirm Delete Modal */}
            <ConfirmModal
                open={!!deleteCourse}
                onClose={() => setDeleteCourse(null)}
                onConfirm={() => deleteCourse && handleDelete()}
                title="Confirm Delete Course"
                description={`Are you sure you want to delete this instructor "${deleteCourse?.firstName}"?`}
            />

            {/* Confirm Status Change Modal */}
            <ConfirmModal
                open={!!statusChangeCourse}
                onClose={() => setStatusChangeCourse(null)}
                onConfirm={handleConfirmStatusChange}
                title="Confirm Status Change"
                description={
                    <>
                        Are you sure you want to{" "}
                        <strong>{statusChangeCourse?.isActive ? "deactivate" : "activate"}</strong>{" "}
                        instructor <strong>{statusChangeCourse?.firstName} {statusChangeCourse?.lastName}</strong>?
                    </>
                }
            />



        </div>
    );
}
