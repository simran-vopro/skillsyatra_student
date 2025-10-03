import { ChevronLeft, ChevronRight } from "lucide-react";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import { API_PATHS } from "../../utils/config";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import DropzoneComponent from "../../components/form/form-elements/DropZone";

type AdminRole = "Super Admin" | "Sub Admin";

interface AdminData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  confirmPassword: string;
  role: AdminRole;
  permissions: string[];
}

const AVAILABLE_PERMISSIONS = [
  "Marked All",
  "Manage Instructors",
  "Manage Students",
  "Manage Courses",
  "Manage Payments",
  "View Reports",
  "System Settings",
];

export default function AdminCreate() {
  const { adminToken } = useAuth();
  const navigate = useNavigate();

  const [adminData, setAdminData] = useState<AdminData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    role: "Sub Admin",
    permissions: [],
  });

  const [value, setValue] = useState<File | string | null>(null);

  const handlePermissionChange = (permission: string) => {
    setAdminData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const submitAdmin = async () => {
    try {
      const res = await axios.post(
        API_PATHS.ADD_INSTRUCTOR,
        { ...adminData },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      if (res) {
        toast.success("Admin created successfully");
        setAdminData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          address: "",
          password: "",
          confirmPassword: "",
          role: "Sub Admin",
          permissions: [],
        });
        setValue(null);
        navigate("/admins");
      }
    } catch (error) {
      toast.error("Failed to create admin");
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-5 text-gray-800 dark:text-white">
        Create Admin / Sub-Admin
      </h2>

      <section className="rounded-xl p-4 bg-white dark:bg-black text-xs space-y-4">
        <form className="pt-4 space-y-3">
          {[
            { label: "First Name", field: "firstName", type: "text" },
            { label: "Last Name", field: "lastName", type: "text" },
            { label: "Phone", field: "phone", type: "text" },
            { label: "Email", field: "email", type: "text" },
            { label: "Password", field: "password", type: "password" },
            { label: "Confirm Password", field: "confirmPassword", type: "password" },
            { label: "Address", field: "address", type: "text" },
          ].map(({ label, field, type }) => (
            <div key={field}>
              <Label>{label}</Label>
              <Input
                type={type}
                onChange={(e) =>
                  setAdminData({ ...adminData, [field]: e.target.value })
                }
                value={adminData[field as keyof AdminData] as string}
              />
            </div>
          ))}

          {/* Role Selection */}
          <div>
            <Label>Role</Label>
            <select
              className="border rounded p-2 w-full"
              value={adminData.role}
              onChange={(e) =>
                setAdminData({ ...adminData, role: e.target.value as AdminRole })
              }
            >
              <option value="Super Admin">Super Admin</option>
              <option value="Sub Admin">Sub Admin</option>
            </select>
          </div>

          {/* Permissions */}
          <div>
            <Label>Permissions</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {AVAILABLE_PERMISSIONS.map((perm) => (
                <label key={perm} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={adminData.permissions.includes(perm)}
                    onChange={() => handlePermissionChange(perm)}
                  />
                  {perm}
                </label>
              ))}
            </div>
          </div>

          {/* Identity Verification */}
          <DropzoneComponent
            accept={{ "image/*": [".jpg", ".jpeg", ".png"] }}
            label="Upload Identity Verification Documents"
            helperText="Upload a valid government-issued ID (e.g., Passport, Driver’s License, National ID). Supported formats: .jpg, .jpeg, .png."
            previewFile={value}
            onDrop={(files: File[]) => {
              const file = files[0];
              setValue(file);
            }}
          />
        </form>

        {/* Actions */}
        <div className="flex mt-4 text-xs gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ChevronLeft size={12} /> Cancel
          </Button>

          <Button onClick={submitAdmin}>
            Submit <ChevronRight size={12} />
          </Button>
        </div>
      </section>
    </div>
  );
}
