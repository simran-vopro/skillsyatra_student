import { ChevronLeft, ChevronRight } from "lucide-react";

import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";

import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import { API_PATHS } from "../../utils/config";
import { useState } from "react";
import { Instructor } from "../../types/course";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import DropzoneComponent from "../../components/form/form-elements/DropZone";


export default function InstructorCreate() {

  const { adminToken } = useAuth();
  const navigate = useNavigate();

  const [instructorData, setInstructorData] = useState<Instructor>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });


  const submitInstructor = async () => {
    try {
      const res = await axios.post(API_PATHS.ADD_INSTRUCTOR, {
        ...instructorData
      }, {
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      });
      if (res) {
        toast.success("Instructor created successfully");
        setInstructorData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          address: "",
          password: "",
          confirmPassword: "",
        });
        navigate("/instructors")
      }

      console.log(res);
    } catch (error) {
      toast.error("Failed to create instructor");
      console.error(error);
      return;
    }

  }


  const [value, setValue] = useState<File | string | null>(null);


  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white mb-5">
        Create Instructor
      </h2>

      <section className="rounded-xl p-4  bg-white dark:bg-black text-xs space-y-2">
        <form className="pt-4 space-y-2">
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
                onChange={(e) => setInstructorData({ ...instructorData, [field]: e.target.value })}
                value={instructorData[field as keyof Instructor] as string | number}
              />
            </div>
          ))}


          <DropzoneComponent
            accept={{ "image/*": [".jpg", ".jpeg", ".png"] }}
            label="Upload Identity Verification Documents"
            helperText="Please upload a valid government-issued ID (e.g., Passport, Driver’s License, National ID). Supported formats: .jpg, .jpeg, .png."
            previewFile={value}
            onDrop={(files: File[]) => {
              const file = files[0];
              setValue(file);
            }}
          />
        </form>
        <div className="flex mt-4 text-xs gap-3">
          <Button variant="outline">
            <ChevronLeft size={12} /> Cancel
          </Button>

          <Button onClick={submitInstructor}>
            Submit <ChevronRight size={12} />
          </Button>

        </div>
      </section>

    </div>
  );
}
