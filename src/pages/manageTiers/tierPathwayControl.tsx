import { useState, useMemo } from "react";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import {
  Box,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Switch,
  TextField,
  Typography,
  Drawer,
} from "@mui/material";
import { Edit2, Trash2, Lock, Unlock, Plus } from "lucide-react";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import DataTable from "../../components/common/DataTable";

// ======================= Types =======================
interface Tier {
  _id: string;
  tierName: string;
  courses: string[];
  progression: string;
  locked: boolean;
  createdAt: string;
}

// ======================= Component =======================
export default function TierPathwayControl() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 20,
    page: 0,
  });

  // Dummy tier data
  const [tierData, setTierData] = useState<Tier[]>([
    {
      _id: "1",
      tierName: "Foundation",
      courses: ["Intro to Programming", "Basic Math"],
      progression: "None",
      locked: false,
      createdAt: "2025-09-10",
    },
    {
      _id: "2",
      tierName: "Level Up",
      courses: ["Data Structures", "Algorithms"],
      progression: "Foundation → Level Up",
      locked: false,
      createdAt: "2025-09-11",
    },
    {
      _id: "3",
      tierName: "Advanced",
      courses: ["System Design", "Machine Learning"],
      progression: "Level Up → Advanced",
      locked: true,
      createdAt: "2025-09-12",
    },

  ]);

  const [deleteTier, setDeleteTier] = useState<Tier | null>(null);
  const [progressionModal, setProgressionModal] = useState<Tier | null>(null);
  const [selectedPrereq, setSelectedPrereq] = useState<string>("");

  // Add Tier drawer state
  const [addTierModal, setAddTierModal] = useState<boolean>(false);
  const [newTierName, setNewTierName] = useState<string>("");
  const [newCourses, setNewCourses] = useState<string>("");
  const [newLocked, setNewLocked] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ tierName?: string; courses?: string }>(
    {}
  );

  // Toggle lock/unlock
  const handleToggleLock = (tierId: string) => {
    setTierData((prev) =>
      prev.map((tier) =>
        tier._id === tierId ? { ...tier, locked: !tier.locked } : tier
      )
    );
  };

  // Handle Add Tier
  const handleAddTier = () => {
    let formErrors: { tierName?: string; courses?: string } = {};

    if (!newTierName.trim()) {
      formErrors.tierName = "Tier name is required";
    }
    if (!newCourses.trim()) {
      formErrors.courses = "At least one course is required";
    }

    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) return;

    const newTier: Tier = {
      _id: (tierData.length + 1).toString(),
      tierName: newTierName.trim(),
      courses: newCourses
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c),
      progression: "None",
      locked: newLocked,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setTierData((prev) => [...prev, newTier]);
    setAddTierModal(false);

    // Reset form
    setNewTierName("");
    setNewCourses("");
    setNewLocked(false);
    setErrors({});
  };

  // ======================= Columns =======================
  const tierColumns: GridColDef[] = useMemo(
    () => [
      {
        field: "tierName",
        headerName: "Tier Name",
        flex: 1,
      },
      {
        field: "courses",
        headerName: "Courses Mapped",
        flex: 1,
        renderCell: (params) => (
          <Box display="flex" gap={1} flexWrap="wrap">
            {params.value.map((c: string, idx: number) => (
              <Chip
                key={idx}
                label={c}
                size="small"
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        ),
      },
      {
        field: "progression",
        headerName: "Progression Rule",
        flex: 1,
      },
      // {
      //   field: "roles",
      //   headerName: "Applicable Roles",
      //   flex: 1,
      //   renderCell: (params) => (
      //     <Box display="flex" gap={1} flexWrap="wrap">
      //       {params.value.map((r: string, idx: number) => (
      //         <Chip key={idx} label={r} size="small" color="secondary" />
      //       ))}
      //     </Box>
      //   ),
      // },
      {
        field: "creditPoints",
        headerName: "Credits",
        flex: 1,
      },
      {
        field: "minScore",
        headerName: "Min Score (%)",
        flex: 1,
      },

      {
        field: "locked",
        headerName: "Visibility",
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
            {params.value ? (
              <Lock className="text-red-500" size={18} />
            ) : (
              <Unlock className="text-green-500" size={18} />
            )}
            <Switch
              checked={params.value}
              onChange={() => handleToggleLock(params.row._id)}
              size="small"
            />
          </Box>
        ),
      },
      {
        field: "createdAt",
        headerName: "Created At",
        flex: 1,
      },
      {
        field: "actions",
        headerName: "Actions",
        flex: 1,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Box display="flex" gap={1}>
            <Tooltip title="Edit Progression Rule">
              <IconButton
                color="primary"
                size="small"
                onClick={() => setProgressionModal(params.row as Tier)}
              >
                <Edit2 size={16} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Tier">
              <IconButton
                color="error"
                size="small"
                onClick={() => setDeleteTier(params.row as Tier)}
              >
                <Trash2 size={16} />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    []
  );


  // ======================= Render =======================
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Tier & Pathway Control
        </h2>
        <div className="flex items-center gap-3">
          <Input
            name="search"
            type="search"
            placeholder="Search tiers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            variant="primary"
            size="sm"
            onClick={() => setAddTierModal(true)}
          >
            <Plus size={16} className="mr-1" /> Add Tier
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        rows={tierData}
        rowCount={tierData.length}
        pagination
        paginationMode="client"
        paginationModel={paginationModel}
        onPaginationModelChange={(model) => setPaginationModel(model)}
        columns={tierColumns}
        getRowId={(row: Tier) => row._id}
      />

      {/* Confirm Delete Modal */}
      <Dialog
        open={!!deleteTier}
        onClose={() => setDeleteTier(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle className="bg-red-600 text-white">
          Confirm Delete Tier
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography>
            Are you sure you want to delete tier {" "}
            <strong>{deleteTier?.tierName}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions className="bg-gray-100">
          <Button variant="outline" onClick={() => setDeleteTier(null)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              setTierData((prev) =>
                prev.filter((tier) => tier._id !== deleteTier?._id)
              );
              setDeleteTier(null);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Progression Rule Drawer */}
      <Drawer
        anchor="right"
        open={!!progressionModal}
        onClose={() => setProgressionModal(null)}
        PaperProps={{ sx: { width: 400, p: 3 } }}
      >
        <Box display="flex" flexDirection="column" height="100%" gap={3}>
          <Typography variant="h6">Set Progression Rule</Typography>

          <Typography className="text-gray-600">
            Define which tier must be completed before unlocking {" "}
            <strong>{progressionModal?.tierName}</strong>.
          </Typography>

          <FormControl fullWidth>
            <InputLabel id="prereq-label">Select prerequisite tier</InputLabel>
            <Select
              labelId="prereq-label"
              value={selectedPrereq}
              onChange={(e) => setSelectedPrereq(e.target.value)}
            >
              {tierData.map((tier) => (
                <MenuItem key={tier._id} value={tier.tierName}>
                  {tier.tierName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box mt="auto" display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outline" onClick={() => setProgressionModal(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                console.log(
                  `Set rule: ${selectedPrereq} → ${progressionModal?.tierName}`
                );
                setProgressionModal(null);
              }}
            >
              Save Rule
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Add Tier Drawer */}
      <Drawer
        anchor="right"
        open={addTierModal}
        onClose={() => setAddTierModal(false)}
        PaperProps={{ sx: { width: 450, p: 3 } }}
      >
        <Box display="flex" flexDirection="column" height="100%" gap={3}>
          <Typography variant="h6">Add New Tier</Typography>

          {/* Tier Name */}
          <TextField
            fullWidth
            label="Tier Name"
            value={newTierName}
            onChange={(e) => setNewTierName(e.target.value)}
            error={!!errors.tierName}
            helperText={errors.tierName}
          />

          {/* Tier Description */}
          <TextField
            fullWidth
            label="Tier Description"
            multiline
            minRows={2}
            placeholder="Short description of this tier..."
          />

          {/* Category */}
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select defaultValue="Beginner">
              <MenuItem value="Beginner">Beginner</MenuItem>
              <MenuItem value="Intermediate">Intermediate</MenuItem>
              <MenuItem value="Advanced">Advanced</MenuItem>
            </Select>
          </FormControl>

          {/* Applicable Roles */}
          <FormControl fullWidth>
            <InputLabel>Applicable Roles</InputLabel>
            <Select multiple defaultValue={["Student"]}>
              <MenuItem value="Student">Student</MenuItem>
              <MenuItem value="Instructor">Instructor</MenuItem>
              <MenuItem value="Sub Admin">Sub Admin</MenuItem>
            </Select>
          </FormControl>

          {/* Courses Multi-Select */}
          <TextField
            fullWidth
            label="Courses (comma-separated)"
            value={newCourses}
            onChange={(e) => setNewCourses(e.target.value)}
            error={!!errors.courses}
            helperText={errors.courses}
          />

          {/* Credit Points */}
          <TextField
            fullWidth
            type="number"
            label="Credit Points"
            placeholder="e.g. 50"
          />

          {/* Unlock Criteria */}
          <TextField
            fullWidth
            type="number"
            label="Minimum Score Required (%)"
            placeholder="e.g. 70"
          />

          {/* Lock Switch */}
          <Box display="flex" alignItems="center" gap={2}>
            <span>Locked:</span>
            <Switch
              checked={newLocked}
              onChange={(e) => setNewLocked(e.target.checked)}
            />
          </Box>

          {/* Actions */}
          <Box mt="auto" display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outline" onClick={() => setAddTierModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddTier}>
              Add Tier
            </Button>
          </Box>
        </Box>
      </Drawer>

    </div>
  );
}