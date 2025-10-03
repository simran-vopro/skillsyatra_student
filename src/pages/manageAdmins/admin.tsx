import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import moment from "moment";

import { GridColDef } from "@mui/x-data-grid";
import { Avatar, Box, IconButton, Switch, Tooltip } from "@mui/material";
import { Edit2, Eye, Trash2 } from "lucide-react";

import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import DataTable from "../../components/common/DataTable";
import ConfirmModal from "../../components/common/ConfirmModal";
import { IMAGE_URL } from "../../utils/config";

// 🔹 Static Admin Data
const staticAdmins = [
    {
        _id: 1,
        thumbnail: "https://i.pravatar.cc/150?img=12",
        createdAt: "2023-09-01T10:00:00Z",
        updatedAt: "2023-09-15T14:00:00Z",
        userId: "ADM001",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+1 234 567 890",
        address: "New York, USA",
        isActive: true,
    },
    {
        _id: 2,
        thumbnail: "https://i.pravatar.cc/150?img=22",
        createdAt: "2023-08-20T09:00:00Z",
        updatedAt: "2023-09-12T13:30:00Z",
        userId: "ADM002",
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        phone: "+44 987 654 321",
        address: "London, UK",
        isActive: false,
    },
];

export default function AdminManagement() {
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState("");
    const [deleteAdmin, setDeleteAdmin] = useState<any | null>(null);
    const [statusChangeAdmin, setStatusChangeAdmin] = useState<any | null>(null);

    // Table Columns
    const adminColumns: GridColDef[] = useMemo(
        () => [
            {
                field: "thumbnail",
                headerName: "Image",
                width: 80,
                renderCell: (params) => (
                    <Avatar
                        src={
                            params.value?.startsWith("/uploads")
                                ? IMAGE_URL + params.value
                                : params.value
                        }
                        alt={params.row.firstName}
                        variant="square"
                        sx={{ width: 48, height: 48 }}
                    />
                ),
                sortable: false,
                filterable: false,
            },
            {
                field: "createdAt",
                headerName: "Created At",
                width: 150,
                renderCell: (params) => (
                    <>{moment(params.value).format("DD-MM-YYYY HH:mm")}</>
                ),
            },
            {
                field: "updatedAt",
                headerName: "Updated At",
                width: 150,
                renderCell: (params) => (
                    <>{moment(params.value).format("DD-MM-YYYY HH:mm")}</>
                ),
            },
            { field: "userId", headerName: "User Id", width: 150 },
            {
                field: "firstName",
                headerName: "Full Name",
                width: 150,
                renderCell: (params) => (
                    <>{`${params.row.firstName} ${params.row.lastName}`}</>
                ),
            },
            { field: "email", headerName: "Email", width: 200 },
            { field: "phone", headerName: "Phone", width: 150 },
            {
                field: "isActive",
                headerName: "Status",
                width: 100,
                align: "center",
                headerAlign: "center",
                renderCell: (params) => (
                    <Box display="flex" justifyContent="center" width="100%">
                        <Switch
                            checked={params.value}
                            onChange={() => setStatusChangeAdmin(params.row)}
                            size="small"
                        />
                    </Box>
                ),
            },
            { field: "address", headerName: "Address", width: 180 },
            {
                field: "permissions",
                headerName: "Permissions",
                width: 140,
                align: "center",
                headerAlign: "center",
                renderCell: (params) => (
                    <Tooltip title="Manage Permissions">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                navigate("/managePermissions", { state: { adminId: params.row._id } });
                            }}
                        >
                            Permissions
                        </Button>
                    </Tooltip>
                ),
                sortable: false,
                filterable: false,
            },

            {
                field: "actions",
                headerName: "Actions",
                width: 120,
                align: "center",
                headerAlign: "center",
                renderCell: (params) => (
                    <Box>
                        <Tooltip title="View">
                            <IconButton
                                color="primary"
                                size="small"
                                onClick={() =>
                                    navigate("/addAdmin", { state: { adminId: params.row._id } })
                                }
                            >
                                <Eye size={16} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                            <IconButton
                                color="primary"
                                size="small"
                                onClick={() =>
                                    navigate("/addAdmin", { state: { adminId: params.row._id } })
                                }
                            >
                                <Edit2 size={16} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <IconButton
                                color="error"
                                size="small"
                                onClick={() => setDeleteAdmin(params.row)}
                            >
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
        []
    );

    // Filter rows by search
    const filteredAdmins = staticAdmins.filter((admin) =>
        `${admin.firstName} ${admin.lastName} ${admin.email}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Manage Admins
                </h2>
                <div className="flex items-center gap-3">
                    <Input
                        name="search"
                        type="search"
                        placeholder="Search admins..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                            navigate("/addAdmin");
                        }}
                    >
                        Add New Admin
                    </Button>
                </div>
            </div>

            {/* Table */}
            <DataTable
                rows={filteredAdmins}
                rowCount={filteredAdmins.length}
                pagination
                paginationMode="client"
                paginationModel={{ page: 0, pageSize: filteredAdmins.length }} // default
                onPaginationModelChange={() => { }} // no-op
                loading={false}
                columns={adminColumns}
                getRowId={(row: any) => row._id}
            />

            {/* Confirm Delete Modal */}
            <ConfirmModal
                open={!!deleteAdmin}
                onClose={() => setDeleteAdmin(null)}
                onConfirm={() => {
                    console.log("Deleted admin:", deleteAdmin);
                    setDeleteAdmin(null);
                }}
                title="Confirm Delete Admin"
                description={`Are you sure you want to delete admin "${deleteAdmin?.firstName}"?`}
            />

            {/* Confirm Status Change Modal */}
            <ConfirmModal
                open={!!statusChangeAdmin}
                onClose={() => setStatusChangeAdmin(null)}
                onConfirm={() => {
                    console.log(
                        "Toggled status:",
                        statusChangeAdmin.firstName,
                        !statusChangeAdmin.isActive
                    );
                    setStatusChangeAdmin(null);
                }}
                title="Confirm Status Change"
                description={
                    <>
                        Are you sure you want to{" "}
                        <strong>
                            {statusChangeAdmin?.isActive ? "deactivate" : "activate"}
                        </strong>{" "}
                        admin{" "}
                        <strong>
                            {statusChangeAdmin?.firstName} {statusChangeAdmin?.lastName}
                        </strong>
                        ?
                    </>
                }
            />
        </div>
    );
}
