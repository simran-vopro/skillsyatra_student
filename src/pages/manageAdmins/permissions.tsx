import { useState } from "react";
import {
  Avatar,
  Box,
  Checkbox,
  Chip,
  Divider,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Typography,
  Paper,
  Stack,
} from "@mui/material";

// ===== Mock static sub-admins =====
const subAdmins = [
  {
    id: 1,
    name: "Arlo Kingston",
    role: "Sales Manager",
    avatar: "https://i.pravatar.cc/150?img=3",
    email: "arlo.kingston@example.com",
    status: "Active",
    lastLogin: "2023-09-16 09:45 AM",
    permissions: {
      Academics: {
        "Dashboard": { view: true, create: false, edit: false, delete: false },
        "Manage Students": { view: true, create: true, edit: true, delete: true },
        "Manage Courses": { view: true, create: true, edit: false, delete: false },
        "Manage Instructors": { view: true, create: false, edit: false, delete: false },
      },
      Administration: {
        "Tier Pathway Control": { view: true, create: false, edit: false, delete: false },
        "Manage Sub Admins": { view: true, create: false, edit: false, delete: false },
        "Practical Scheduling": { view: true, create: true, edit: true, delete: false },
      },
      Finance: {
        "Payments & Bills": { view: true, create: false, edit: false, delete: false },
      },
      Reports: {
        "Certificates & Achievements": { view: true, create: true, edit: true, delete: false },
        "Reports & Analytics": { view: true, create: false, edit: false, delete: false },
      },
      System: {
        "Support Tickets": { view: true, create: true, edit: true, delete: true },
        "Audit Logs & Activities": { view: true, create: false, edit: false, delete: false },
      },
      User: {
        "Manage Profile": { view: true, create: true, edit: true, delete: false },
        "System Settings": { view: false, create: false, edit: false, delete: false },
      },
    },
  },
  {
    id: 2,
    name: "Sienna Brooks",
    role: "Marketing Lead",
    avatar: "https://i.pravatar.cc/150?img=5",
    email: "sienna.brooks@example.com",
    status: "Inactive",
    lastLogin: "2023-09-12 05:30 PM",
    permissions: {
      Academics: {
        "Dashboard": { view: true, create: false, edit: false, delete: false },
        "Manage Students": { view: true, create: false, edit: false, delete: false },
        "Manage Courses": { view: true, create: false, edit: false, delete: false },
        "Manage Instructors": { view: false, create: false, edit: false, delete: false },
      },
      Administration: {
        "Tier Pathway Control": { view: false, create: false, edit: false, delete: false },
        "Manage Sub Admins": { view: true, create: true, edit: false, delete: false },
        "Practical Scheduling": { view: true, create: false, edit: false, delete: false },
      },
      Finance: {
        "Payments & Bills": { view: true, create: false, edit: false, delete: false },
      },
      Reports: {
        "Certificates & Achievements": { view: true, create: true, edit: false, delete: false },
        "Reports & Analytics": { view: true, create: true, edit: true, delete: false },
      },
      System: {
        "Support Tickets": { view: true, create: true, edit: false, delete: false },
        "Audit Logs & Activities": { view: false, create: false, edit: false, delete: false },
      },
      User: {
        "Manage Profile": { view: true, create: false, edit: false, delete: false },
        "System Settings": { view: false, create: false, edit: false, delete: false },
      },
    },
  },
];

export default function SubAdminPermissions() {
  const [admins, setAdmins] = useState(subAdmins);
  const [selectedId, setSelectedId] = useState(admins[0].id);

  const selected = admins.find((a) => a.id === selectedId)!;

  const handlePermissionChange = (
    section: string,
    module: string,
    action: keyof typeof selected.permissions.Academics["Dashboard"],
    checked: boolean
  ) => {
    setAdmins((prev) =>
      prev.map((admin) =>
        admin.id === selected.id
          ? {
              ...admin,
              permissions: {
                ...admin.permissions,
                [section]: {
                  ...admin.permissions[section],
                  [module]: {
                    ...admin.permissions[section][module],
                    [action]: checked,
                  },
                },
              },
            }
          : admin
      )
    );
  };

  return (
    <Box display="flex" height="100%">
      {/* Left Sidebar - Fixed */}
      <Box
        width="280px"
        borderRight="1px solid #e0e0e0"
        bgcolor="#fafafa"
        sx={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <List>
          {admins.map((admin) => (
            <ListItemButton
              key={admin.id}
              selected={selectedId === admin.id}
              onClick={() => setSelectedId(admin.id)}
            >
              <ListItemAvatar>
                <Avatar src={admin.avatar} />
              </ListItemAvatar>
              <ListItemText
                primary={admin.name}
                secondary={admin.role}
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* Right Side - Permissions */}
      <Box flex={1} p={4} overflow="auto">
        {/* Header Info */}
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={selected.avatar} sx={{ width: 64, height: 64 }} />
            <Box>
              <Typography variant="h6">{selected.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {selected.role} • {selected.email}
              </Typography>
              <Stack direction="row" spacing={2} mt={1}>
                <Chip
                  label={selected.status}
                  color={selected.status === "Active" ? "success" : "default"}
                  size="small"
                />
                <Typography variant="caption" color="text.secondary">
                  Last Login: {selected.lastLogin}
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </Paper>

        {/* Permissions Section */}
        {Object.entries(selected.permissions).map(([section, modules]) => (
          <Paper
            key={section}
            elevation={1}
            sx={{ mb: 4, p: 2, borderRadius: 2 }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              gutterBottom
              sx={{ color: "primary.main" }}
            >
              {section}
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <table className="w-full border-collapse border border-gray-200 rounded-md overflow-hidden">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-3 py-2 text-left">Module</th>
                  <th className="border px-3 py-2">View</th>
                  <th className="border px-3 py-2">Create</th>
                  <th className="border px-3 py-2">Edit</th>
                  <th className="border px-3 py-2">Delete</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(modules as any).map(([moduleName, perms]: any) => (
                  <tr key={moduleName}>
                    <td className="border px-3 py-2 font-medium">
                      {moduleName}
                    </td>
                    {(["view", "create", "edit", "delete"] as const).map(
                      (action) => (
                        <td
                          key={action}
                          className="border px-3 py-2 text-center"
                        >
                          <Checkbox
                            checked={perms[action]}
                            onChange={(e) =>
                              handlePermissionChange(
                                section,
                                moduleName,
                                action,
                                e.target.checked
                              )
                            }
                          />
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
