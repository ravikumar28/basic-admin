import React, { useEffect, useState } from "react";
import { patientService } from "../services/patientService";
import Card from "../components/common/Card";
import { format } from "date-fns";
import Layout from "../components/layout/Layout";

const statusColors = {
  scheduled: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  pending: "bg-orange-100 text-orange-700",
  cancelled: "bg-gray-100 text-gray-700",
};

const DashboardPage = () => {
  const [stats, setStats] = useState({
    total: 0,
    byStatus: {},
    today: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Fetch all appointments (last 30 days)
        const from_date = format(
          new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
          "yyyy-MM-dd"
        );
        const to_date = format(new Date(), "yyyy-MM-dd");
        const resp = await patientService.getPatients({ startDate: from_date, endDate: to_date });
        if (
          resp.data &&
          resp.data.success &&
          Array.isArray(resp.data.data)
        ) {
          const all = resp.data.data;
          const byStatus = all.reduce((acc, a) => {
            acc[a.appointment_status] = (acc[a.appointment_status] || 0) + 1;
            return acc;
          }, {});
          const todayStr = format(new Date(), "yyyy-MM-dd");
          const today = all.filter((a) => (a.slot_start_time || "").slice(0, 10) === todayStr);
          setStats({ total: all.length, byStatus, today });
        }
      } catch {
        setStats({ total: 0, byStatus: {}, today: [] });
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <Layout>
      <div>
        <h1 className="text-2xl font-bold mb-4 text-primary-600">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="flex flex-col items-center border-t-4 border-primary-500">
          <span className="text-lg font-semibold text-primary-500">Total Appointments</span>
          <span className="text-3xl font-bold mt-2">{loading ? "..." : stats.total}</span>
        </Card>
        {["scheduled", "completed", "pending", "cancelled"].map((status) => (
          <Card key={status} className={`flex flex-col items-center border-t-4 ${statusColors[status] || "border-primary-500"}`}>
            <span className="text-lg font-semibold capitalize">{status}</span>
            <span className="text-3xl font-bold mt-2">{loading ? "..." : stats.byStatus[status] || 0}</span>
          </Card>
        ))}
      </div>
      <Card>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-primary-500">Today's Appointments</h2>
          <span className="text-gray-500 text-sm">{format(new Date(), "yyyy-MM-dd")}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="px-2 py-1 text-left">Patient</th>
                <th className="px-2 py-1 text-left">Branch</th>
                <th className="px-2 py-1 text-left">Status</th>
                <th className="px-2 py-1 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="text-center py-4">Loading...</td></tr>
              ) : stats.today.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-4">No appointments</td></tr>
              ) : (
                stats.today.map((a) => (
                  <tr key={a.id}>
                    <td className="px-2 py-1">{a.profile?.name || "-"}</td>
                    <td className="px-2 py-1">{a.facility?.branch_name || "-"}</td>
                    <td className="px-2 py-1 capitalize">{a.appointment_status}</td>
                    <td className="px-2 py-1">{a.slot_object?.[0]?.slotTime || ""}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        </Card>
      </div>
    </Layout>
  );
};

export default DashboardPage;