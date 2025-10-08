import { useState } from "react";
import {
  Gift,
  Share2,
  UserPlus,
  Copy,
  CheckCircle,
  Mail,
  Send,
  ChevronDown,
} from "lucide-react";

// --- MAIN COMPONENT ---
export default function ReferralInvitePage() {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");

  const referralLink = "https://studentportal.com/referral/ABC123";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = () => {
    if (!email) return alert("Please enter your friend’s email address!");
    alert(`Invitation sent successfully to ${email}`);
    setEmail("");
  };

  const mockNavigateBack = () => {
    console.log("Mock Navigation: Attempted to go back.");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
      {/* Header */}
      <header className="mb-8 border-b pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-extrabold text-indigo-700 flex items-center">
          <Gift size={32} className="mr-3 text-indigo-500" /> Referral / Invite a Friend
        </h1>
        <button
          onClick={mockNavigateBack}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition-colors mt-3 sm:mt-0"
        >
          <ChevronDown size={16} className="mr-2 transform rotate-90" /> Back to Dashboard
        </button>
      </header>

      {/* Banner */}
      <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl mb-8 flex items-start shadow-md">
        <UserPlus size={20} className="text-indigo-600 mr-3 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-indigo-800 font-medium">
          Invite your friends to join the portal and earn exciting rewards when they register using your link!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Referral Link Card */}
        <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center border-b pb-3 mb-4">
            <Share2 size={20} className="mr-2 text-indigo-500" /> Your Referral Link
          </h2>

          <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
            <p className="text-sm text-gray-700 truncate">{referralLink}</p>
            <button
              onClick={handleCopy}
              className="ml-3 px-3 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center text-sm"
            >
              {copied ? (
                <>
                  <CheckCircle size={16} className="mr-1" /> Copied
                </>
              ) : (
                <>
                  <Copy size={16} className="mr-1" /> Copy
                </>
              )}
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-3">
            Share this link with your friends — when they join, you both get special rewards!
          </p>
        </section>

        {/* Invite via Email Card */}
        <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center border-b pb-3 mb-4">
            <Mail size={20} className="mr-2 text-indigo-500" /> Invite via Email
          </h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Friend’s Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <button
              onClick={handleInvite}
              className="w-full flex items-center justify-center bg-indigo-600 text-white py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              <Send size={16} className="mr-2" /> Send Invitation
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-3">
            Your friend will receive an invitation email with your referral link.
          </p>
        </section>
      </div>

      {/* Reward Info */}
      <section className="mt-10 bg-green-50 border border-green-200 p-5 rounded-xl shadow-md flex items-start">
        <CheckCircle size={22} className="text-green-600 mr-3 mt-0.5" />
        <p className="text-sm text-green-800">
          For every successful referral, you’ll earn <b>₹500 credit</b> or <b>1 month of free access</b> to premium content!
        </p>
      </section>
    </div>
  );
}
