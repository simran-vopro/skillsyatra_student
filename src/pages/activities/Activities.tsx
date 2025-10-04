import React, { useState } from "react";
import {
  Shield,
  Clock,
  MapPin,
  Monitor,
  Smartphone,
  AlertTriangle,
  LogOut,
  CheckCircle,
  XCircle,
  Trash2,
  ChevronDown,
} from "lucide-react";

// --- TYPE DEFINITIONS & MOCK DATA ---

interface LoginHistory {
  id: string;
  timestamp: string; // ISO date
  ipAddress: string;
  location: string;
  device: string; // e.g., Chrome on Windows, Safari on iOS
  status: "Success" | "Failed";
}

interface ActiveSession {
  id: string;
  device: string;
  location: string;
  ipAddress: string;
  lastActive: string; // ISO date
  isCurrent: boolean;
}

const MOCK_LOGIN_HISTORY: LoginHistory[] = [
  {
    id: "L005",
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hr ago
    ipAddress: "203.0.113.45",
    location: "New Delhi, India",
    device: "Chrome on Windows 10",
    status: "Success",
  },
  {
    id: "L004",
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hrs ago
    ipAddress: "198.51.100.22",
    location: "London, UK",
    device: "Firefox on macOS",
    status: "Failed",
  },
  {
    id: "L003",
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    ipAddress: "192.0.2.1",
    location: "New Delhi, India",
    device: "Safari on iPhone",
    status: "Success",
  },
  {
    id: "L002",
    timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    ipAddress: "172.16.0.10",
    location: "New York, USA",
    device: "Edge on Android",
    status: "Success",
  },
];

const MOCK_ACTIVE_SESSIONS: ActiveSession[] = [
  {
    id: "S001",
    device: "Chrome on Windows 10",
    location: "New Delhi, India",
    ipAddress: "203.0.113.45",
    lastActive: new Date(Date.now() - 60000).toISOString(), // 1 min ago
    isCurrent: true,
  },
  {
    id: "S002",
    device: "Safari on iPhone SE",
    location: "New York, USA",
    ipAddress: "198.51.100.50",
    lastActive: new Date(Date.now() - 900000).toISOString(), // 15 min ago
    isCurrent: false,
  },
  {
    id: "S003",
    device: "Firefox on macOS",
    location: "London, UK",
    ipAddress: "203.0.113.1",
    lastActive: new Date(Date.now() - 7200000).toISOString(), // 2 hrs ago
    isCurrent: false,
  },
];

// --- UTILITY COMPONENTS & HOOKS ---

// Custom alert/message box implementation instead of window.alert()
const useAppAlert = () => {
  return (message: string, title: string = "Information") => {
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4";
    modal.innerHTML = `
          <div class="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full transform transition-all duration-300 scale-100';">
            <h3 class="text-xl font-bold mb-3 text-indigo-700">${title}</h3>
            <p class="text-gray-700 text-sm">${message}</p>
            <button id="closeAlert" class="mt-5 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md">
              Close
            </button>
          </div>
        `;
    document.body.appendChild(modal);
    document
      .getElementById("closeAlert")
      ?.addEventListener("click", () => document.body.removeChild(modal));
  };
};

const formatTimeAgo = (isoDate: string) => {
  const date = new Date(isoDate);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return "just now";
};

const getDeviceIcon = (device: string) => {
  if (
    device.includes("iPhone") ||
    device.includes("iOS") ||
    device.includes("Android")
  )
    return Smartphone;
  if (device.includes("Windows") || device.includes("macOS")) return Monitor;
  return Monitor; // Default
};

// --- MAIN COMPONENT ---

export default function LoginSecuritySettings() {
  const [activeSessions, setActiveSessions] =
    useState<ActiveSession[]>(MOCK_ACTIVE_SESSIONS);
  const alert = useAppAlert();

  const handleLogoutSession = (sessionId: string) => {
    const sessionToLogout = activeSessions.find((s) => s.id === sessionId);

    if (sessionToLogout?.isCurrent) {
      alert(
        "You cannot log out of your current session here. Please use the standard logout button.",
        "Cannot Log Out Current Session"
      );
      return;
    }

    // Mock the logout process
    setActiveSessions((prev) => prev.filter((s) => s.id !== sessionId));
    alert(
      `Session ${sessionId} (${sessionToLogout?.device} in ${sessionToLogout?.location}) has been successfully terminated.`,
      "Session Terminated"
    );
  };

  const handleLogoutAllDevices = () => {
    // In a real application, this would call an API endpoint.
    // We keep the current session for demonstration, but log out all others.
    const currentSession = activeSessions.find((s) => s.isCurrent);
    setActiveSessions(currentSession ? [currentSession] : []);

    alert(
      "You have successfully logged out of all non-current devices. You may need to sign in again on those devices.",
      "Logout Successful"
    );
  };

  const mockNavigateBack = () => {
    console.log("Mock Navigation: Attempted to go back.");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
      <div>
        {/* Header */}
        <header className="mb-8 border-b pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h1 className="text-3xl font-extrabold text-indigo-700 flex items-center">
            <Shield size={32} className="mr-3 text-indigo-500" /> Login &
            Security Settings
          </h1>
          <button
            onClick={mockNavigateBack}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition-colors mt-3 sm:mt-0"
          >
            <ChevronDown size={16} className="mr-2 transform rotate-90" /> Back
            to Account
          </button>
        </header>

        {/* Alert/Warning Banner */}
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl mb-8 flex items-start shadow-md">
          <AlertTriangle
            size={20}
            className="text-red-600 mr-3 mt-0.5 flex-shrink-0"
          />
          <p className="text-sm text-red-800 font-medium">
            If you see any unfamiliar activity, immediately log out all devices
            and change your password.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Sessions Card (Takes 2/3 width on desktop) */}
          <section className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-200 order-2 lg:order-1">
            <header className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <Monitor size={20} className="mr-2 text-indigo-500" /> Active
                Sessions ({activeSessions.length})
              </h2>
              <button
                onClick={handleLogoutAllDevices}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={activeSessions.length <= 1} // Can't log out from all if only current session exists
              >
                <LogOut size={16} className="mr-2" /> Logout from All Devices
              </button>
            </header>

            <div className="space-y-4">
              {activeSessions.length > 0 ? (
                activeSessions.map((session) => {
                  const Icon = getDeviceIcon(session.device);
                  return (
                    <div
                      key={session.id}
                      className={`flex items-center justify-between p-4 rounded-lg border shadow-sm ${
                        session.isCurrent
                          ? "bg-indigo-50 border-indigo-300"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <Icon
                          size={24}
                          className={
                            session.isCurrent
                              ? "text-indigo-600"
                              : "text-gray-500"
                          }
                        />
                        <div>
                          <p className="font-semibold text-gray-800">
                            {session.device}
                            {session.isCurrent && (
                              <span className="ml-2 px-2 py-0.5 text-xs font-bold text-white bg-green-500 rounded-full">
                                CURRENT
                              </span>
                            )}
                          </p>
                          <div className="text-xs text-gray-500 flex items-center space-x-3 mt-1">
                            <span className="flex items-center">
                              <MapPin size={12} className="mr-1" />{" "}
                              {session.location}
                            </span>
                            <span className="flex items-center">
                              <Clock size={12} className="mr-1" /> Active{" "}
                              {formatTimeAgo(session.lastActive)}
                            </span>
                            <span>(IP: {session.ipAddress})</span>
                          </div>
                        </div>
                      </div>

                      {!session.isCurrent && (
                        <button
                          onClick={() => handleLogoutSession(session.id)}
                          className="p-2 text-sm font-medium text-red-600 border border-red-400 rounded-full hover:bg-red-50 transition-colors"
                          title="Logout Session"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-center py-6 text-gray-500">
                  No other active sessions found.
                </p>
              )}
            </div>
          </section>

          {/* Login History Card (Takes 1/3 width on desktop) */}
          <section className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg border border-gray-200 order-1 lg:order-2">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4 flex items-center">
              <Clock size={20} className="mr-2 text-indigo-500" /> Last Login
              History
            </h2>

            <div className="space-y-4">
              {MOCK_LOGIN_HISTORY.map((login) => {
                const Icon = login.status === "Success" ? CheckCircle : XCircle;
                const statusColor =
                  login.status === "Success"
                    ? "text-green-600"
                    : "text-red-600";
                const bgColor =
                  login.status === "Success" ? "bg-green-50" : "bg-red-50";

                return (
                  <div
                    key={login.id}
                    className={`flex items-start p-3 rounded-lg ${bgColor} border border-gray-200`}
                  >
                    <Icon
                      size={16}
                      className={`mt-0.5 mr-3 flex-shrink-0 ${statusColor}`}
                    />
                    <div className="text-sm">
                      <p className="font-medium text-gray-800 flex items-center">
                        {login.status} Login
                        <span className="text-xs font-normal text-gray-500 ml-2">
                          ({formatTimeAgo(login.timestamp)})
                        </span>
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {login.device}
                      </p>
                      <p className="text-xs text-gray-400 flex items-center mt-0.5">
                        <MapPin size={12} className="mr-1" /> {login.location}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-4 text-xs text-gray-500 text-center">
              History is retained for 30 days for security purposes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
