import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Search, Filter, ArrowDown, ArrowUp, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/useAuth.js";
import { TransactionVolumeChart, RevenueChart } from "../components/AnalyticsCharts";

export default function TransactionDashboardPage() {
  const { currentUser: user } = useAuth();
  const isAdmin = user?.role === "admin";
  
  const [transactions, setTransactions] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("ALL"); // ALL, ESCROW, DEPOSIT

  useEffect(() => {
    fetchData();
  }, [filterType, isAdmin]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = isAdmin ? "/transactions/admin/all" : "/transactions/my-transactions";
      const params = filterType !== "ALL" ? new URLSearchParams({ type: filterType }).toString() : "";
      const baseUrl = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");
      const url = `${baseUrl}${endpoint}${params ? `?${params}` : ""}`;
      
      const res = await fetch(url, {
        credentials: "include"
      });
      const data = await res.json();
      
      if (data.success) {
        setTransactions(data.transactions);
      }

      if (isAdmin) {
        const analyticsRes = await fetch(`${baseUrl}/transactions/admin/analytics`, {
          credentials: "include"
        });
        const analyticsData = await analyticsRes.json();
        if (analyticsData.success) {
          setAnalytics(analyticsData.analytics);
        }
      }
    } catch (error) {
      console.error("Failed to fetch transaction data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
      case "RELEASED":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      case "HELD_IN_ESCROW":
      case "PENDING":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "FAILED":
      case "CANCELLED":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      default:
        return "text-gray-500 bg-gray-500/10 border-gray-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isAdmin ? "Platform Transactions" : "My Transactions"}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {isAdmin ? "Monitor overall platform volume and revenue." : "Track your deposits and escrow payments."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="ALL">All Types</option>
              <option value="ESCROW">Escrow Only</option>
              <option value="DEPOSIT">Deposits Only</option>
            </select>
            <button
              onClick={fetchData}
              className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-300 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Analytics Section for Admins */}
        {isAdmin && analytics.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TransactionVolumeChart data={analytics} />
            <RevenueChart data={analytics} />
          </div>
        )}

        {/* Ledger Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Date</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Type</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Related User</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Amount</th>
                  {isAdmin && <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Platform Fee</th>}
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Transaction ID</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {transactions.length === 0 && !loading && (
                  <tr>
                    <td colSpan={isAdmin ? 7 : 6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      No transactions found.
                    </td>
                  </tr>
                )}
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">
                      {format(new Date(txn.date), "MMM dd, yyyy HH:mm")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {txn.type === "DEPOSIT" ? (
                          <ArrowDown className="w-4 h-4 text-blue-500" />
                        ) : (
                          <ArrowUp className="w-4 h-4 text-purple-500" />
                        )}
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {txn.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(() => {
                        let relatedUser = null;
                        if (isAdmin) {
                          relatedUser = txn.user || txn.hirer || txn.provider;
                        } else {
                          relatedUser = (txn.hirer?._id === user.id || txn.hirer?.id === user.id) ? txn.provider : txn.hirer;
                        }
                        
                        if (relatedUser && (relatedUser._id || relatedUser.id)) {
                          return (
                            <Link 
                              to={`/user/${relatedUser._id || relatedUser.id}`}
                              className="text-sm font-medium text-[#0066FF] hover:underline"
                            >
                              {relatedUser.name || "User"}
                            </Link>
                          );
                        }
                        return <span className="text-sm text-gray-500 dark:text-gray-400">-</span>;
                      })()}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                      {(() => {
                        let displayAmount = txn.amount;
                        if (!isAdmin && txn.type === "ESCROW" && txn.platformFee) {
                          const isProvider = txn.provider?._id === user.id || txn.provider?.id === user.id;
                          if (isProvider) {
                            displayAmount = txn.amount - txn.platformFee;
                          }
                        }
                        return `৳${displayAmount}`;
                      })()}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap">
                        {txn.platformFee ? `৳${txn.platformFee}` : "-"}
                      </td>
                    )}
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap font-mono">
                      {txn.gatewayTransactionId || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(txn.status)}`}>
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
