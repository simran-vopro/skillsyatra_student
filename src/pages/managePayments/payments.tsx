import React from "react";
import {
  Download,
  CheckCircle,
  XCircle,
  RefreshCcw,
  CreditCard,
  Calendar,
  TrendingUp,
  HelpCircle,
  ArrowLeft,
  MoreVertical,
} from "lucide-react";

// --- TYPE DEFINITIONS & MOCK DATA ---

// Represents a single course or tier purchase by the student.
interface PaymentTransaction {
  id: string;
  item: string; // Course/Tier name purchased
  date: string; // ISO date of transaction
  amount: number;
  currency: string;
  method: string; // Payment method used
  status: "Paid" | "Refunded" | "Failed";
  invoiceId: string;
}

// Reusable component for displaying status chips with consistent Tailwind styling.
interface StatusChipProps {
  label: "Paid" | "Refunded" | "Failed";
}

const StatusChip: React.FC<StatusChipProps> = ({ label }) => {
  let colorClasses = "bg-gray-100 text-gray-700 ring-gray-500/10";

  switch (label) {
    case "Paid":
      colorClasses = "bg-green-100 text-green-700 ring-green-500/10";
      break;
    case "Refunded":
      colorClasses = "bg-blue-100 text-blue-700 ring-blue-500/10";
      break;
    case "Failed":
      colorClasses = "bg-red-100 text-red-700 ring-red-500/10";
      break;
  }

  let Icon = CheckCircle;
  if (label === "Refunded") Icon = RefreshCcw;
  if (label === "Failed") Icon = XCircle;

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${colorClasses}`}
    >
      <Icon size={14} className="mr-1" /> {label}
    </span>
  );
};

const MOCK_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: "ORD-87654",
    item: "Cloud Infrastructure Tier - Annual Subscription",
    date: "2025-08-15T10:30:00Z",
    amount: 299.99,
    currency: "USD",
    method: "Visa **** 4567",
    status: "Paid",
    invoiceId: "INV-001A",
  },
  {
    id: "ORD-87653",
    item: "Advanced React Course Bundle (Refunded)",
    date: "2025-07-01T14:45:00Z",
    amount: 99.0,
    currency: "USD",
    method: "MasterCard **** 1234",
    status: "Refunded",
    invoiceId: "INV-002B",
  },
  {
    id: "ORD-87652",
    item: "Python for Data Science Module",
    date: "2025-06-20T09:00:00Z",
    amount: 49.5,
    currency: "USD",
    method: "PayPal",
    status: "Paid",
    invoiceId: "INV-003C",
  },
  {
    id: "ORD-87651",
    item: "React Essentials Workshop Pass (Failed Payment)",
    date: "2025-05-05T17:10:00Z",
    amount: 19.99,
    currency: "USD",
    method: "Amex **** 9999",
    status: "Failed",
    invoiceId: "INV-004D",
  },
  {
    id: "ORD-87650",
    item: "Full Stack Development Bootcamp",
    date: "2025-04-22T12:00:00Z",
    amount: 499.0,
    currency: "USD",
    method: "Wire Transfer",
    status: "Paid",
    invoiceId: "INV-005E",
  },
];

// --- UTILITY FUNCTIONS ---

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

// Custom alert/message box implementation instead of window.alert()
const useAppAlert = () => {
  return (message: string, title: string = "Information") => {
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4";
    modal.innerHTML = `
          <div class="bg-white p-6 rounded-xl shadow-2xl transform transition-all duration-300 scale-100">
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

/**
 * Main Student Order History Component
 */
export default function StudentOrderHistory() {
  const transactions = MOCK_TRANSACTIONS;
  const alert = useAppAlert();

  const mockNavigateBack = () => {
    console.log("Mock Navigation: Attempted to go back.");
  };

  const handleSupportClick = () => {
    alert(
      "For immediate assistance with any payment, invoice, or refund issue, please contact our dedicated financial support team via email at support@learnflow.com or reference your Order ID when opening a support ticket.",
      "Payment Support & Help"
    );
  };

  const handleDownloadInvoice = (txn: PaymentTransaction) => {
    const isDownloadable = txn.status === "Paid" || txn.status === "Refunded";
    if (isDownloadable) {
      alert(
        `Invoice ${txn.invoiceId} for ${txn.item} is now downloading. (Mock Action)`,
        "Invoice Download Initiated"
      );
    } else {
      alert(
        `Invoice is not available for transactions with status: ${txn.status}.`,
        "Action Not Available"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
      <div >
        {/* Header */}
        <header className="mb-8 border-b pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h1 className="text-3xl font-extrabold text-indigo-700 flex items-center">
            <CreditCard size={32} className="mr-3 text-indigo-500" /> Order &
            Payment History
          </h1>
          <button
            onClick={mockNavigateBack}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition-colors mt-3 sm:mt-0"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
          </button>
        </header>

        {/* Support Banner (Required Feature: Support link for payment issues) */}
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-md">
          <div className="flex items-start">
            <HelpCircle
              size={24}
              className="text-yellow-600 mr-3 mt-0.5 flex-shrink-0"
            />
            <p className="text-sm text-yellow-800 font-medium">
              Experiencing a payment issue or need a refund processed? Get help
              here.
            </p>
          </div>
          <button
            onClick={handleSupportClick}
            className="flex items-center text-sm font-semibold text-yellow-800 bg-yellow-200 px-3 py-1.5 rounded-lg hover:bg-yellow-300 transition-colors mt-3 sm:mt-0 flex-shrink-0"
          >
            Contact Support <HelpCircle size={16} className="ml-2" />
          </button>
        </div>

        {/* Transaction Table */}
        <main className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Your Recent Transactions
            </h2>
          </div>

          {transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[250px]">
                      Purchased Item
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {transactions.map((txn) => (
                    <tr
                      key={txn.id}
                      className="hover:bg-indigo-50/50 transition-colors"
                    >
                      {/* Item */}
                      <td className="px-4 sm:px-6 py-4 whitespace-normal text-sm font-medium text-indigo-700">
                        <p className="font-semibold">{txn.item}</p>
                        <span className="text-xs text-gray-500 block">
                          Order: {txn.id}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-bold text-green-700">
                        {formatCurrency(txn.amount, txn.currency)}
                      </td>

                      {/* Date */}
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(txn.date).toLocaleDateString()}
                        <span className="text-xs text-gray-400 block">
                          {new Date(txn.date).toLocaleTimeString()}
                        </span>
                      </td>

                      {/* Method */}
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {txn.method}
                      </td>

                      {/* Status */}
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                        <StatusChip label={txn.status} />
                      </td>

                      {/* Actions */}
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDownloadInvoice(txn)}
                          disabled={txn.status === "Failed"}
                          className="inline-flex items-center px-3 py-1 text-xs font-medium text-indigo-600 border border-indigo-400 rounded-md bg-indigo-50 hover:bg-indigo-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-500"
                          title={
                            txn.status === "Failed"
                              ? "Invoice not available"
                              : "Download Invoice"
                          }
                        >
                          <Download size={14} className="mr-1" />
                          Invoice ({txn.invoiceId})
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-12">
              <CreditCard size={48} className="mx-auto text-gray-300" />
              <p className="mt-4 text-lg font-semibold text-gray-600">
                You haven't purchased any courses yet!
              </p>
              <p className="text-sm text-gray-500">
                All your purchases will appear here after checkout.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
