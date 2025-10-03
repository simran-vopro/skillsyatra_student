import { useState } from "react";
import axios from "axios";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { useNavigate } from "react-router";
import { API_PATHS } from "../../utils/config";
import { loginSuccess } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../app/hooks";
import toast from "react-hot-toast";

export default function SignInForm() {
  const [activeTab, setActiveTab] = useState<"admin" | "instructor">("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // useEffect(() => {
  //   dispatch(logout());
  // },[])

  const handleLogin = async (e: any) => {
    console.log("Login clicked", phone,
      password,
      activeTab,);
    e.preventDefault();

    if (!phone || !password) {
      alert("Please enter both User ID and Password");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(API_PATHS.LOGIN, {
        phone: phone,
        password,
        type: activeTab,
      });
      // // Check if response is valid
      // if (!res.data || !res.data.data || !res.data.data.token || !res.data.data.user) {
      //   throw new Error("Invalid login response");
      // }
      const { token, user } = res.data.data;

      // ✅ Update Redux state
      dispatch(loginSuccess({ adminUser: user, adminToken: token }))

      // Navigate to dashboard or home
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      const err = error as any;
      toast.error(err.response.data.message || "Something Went Wrong")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      {/* <div className="absolute right-0 top-0 -z-1 w-full max-w-[250px] xl:max-w-[300px] opacity-30">
        <img src="./images/shape/2.png" alt="grid" />
      </div> */}
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your Phone Number and password to sign in!
            </p>
          </div>
          <div>

            {/* Tabs */}
            <div className="mb-6 flex border-b border-gray-200 pb-2 dark:border-gray-700">
              {["admin", "instructor"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab as "admin" | "instructor")}
                  className={`px-4 py-2 text-sm font-medium rounded-full border-b-2 ${activeTab === tab
                    ? "bg-brand-500 text-white"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                >
                  {tab === "admin" ? "Admin" : "Instructor"}
                </button>
              ))}
            </div>

            <form onSubmit={handleLogin}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Phone <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter Phone Number"
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>

                {/* <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                </div> */}

                <div>
                  <Button className="w-full" size="sm" disabled={loading}>
                    {loading ? "Signing in..." : "Sign in"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
