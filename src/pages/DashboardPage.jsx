import React, { useEffect, useState } from "react";
import { patientService } from "../services/patientService";
import Card from "../components/common/Card";
import { format } from "date-fns";
import Layout from "../components/layout/Layout";
import { useAuth } from "../hooks/useAuth";

const statusColors = {
  scheduled: "bg-yellow-100 text-yellow-700 border-yellow-200",
  completed: "bg-green-100 text-green-700 border-green-200",
  pending: "bg-orange-100 text-orange-700 border-orange-200",
  cancelled: "bg-gray-100 text-gray-700 border-gray-200",
};

const DashboardPage = () => {
  const { currentUser } = useAuth();
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
        const from_date = format(
          new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
          "yyyy-MM-dd"
        );
        const to_date = format(new Date(), "yyyy-MM-dd");
        const resp = await patientService.getPatients({ startDate: from_date, endDate: to_date });
        
        if (resp.data?.success && Array.isArray(resp.data.data)) {
          const all = resp.data.data;
          const byStatus = all.reduce((acc, a) => {
            acc[a.dex] = (acc[a.appointment_status] || 0) + 1;
            return acc;
          }, {});
          const todayStr = format(new Date(), "yyyy-MM-dd");
          const today = all.filter((a) => (a.slot_start_time || "").slice(0, 10) === todayStr);
          setStats({ total: all.length, byStatus, today });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats({ total: 0, byStatus: {}, today: [] });
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Welcome back, {currentUser?.name || 'User'}!</h1>
          <p className="text-gray-500">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-none">
            <div className="flex flex-col">
              <span className="text-orange-700 font-medium">Total</span>
              <span className="text-3xl font-bold text-orange-800 mt-2">
                {loading ? "..." : stats.total}
              </span>
            </div>
          </Card>

          {["scheduled", "completed", "pending", "cancelled"].map((status) => (
            <Card 
              key={status} 
              className={`${statusColors[status]} border`}
            >
              <div className="flex flex-col">
                <span className="font-medium capitalize">{status}</span>
                <span className="text-3xl font-bold mt-2">
                  {loading ? "..." : stats.byStatus[status] || 0}
                </span>
              </div>
            </Card>
          ))}
        </div>

        <Card className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Today's Appointments</h2>
            <span className="text-sm text-gray-500">
              {stats.today.length} appointment{stats.today.length !== 1 ? 's' : ''} today
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-4 text-center text-gray-500">Loading...</td>
                  </tr>
                ) : stats.today.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-4 text-center text-gray-500">No appointments scheduled for today</td>
                  </tr>
                ) : (
                  stats.today.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">{appointment.profile?.name || "-"}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{appointment.facility?.branch_name || "-"}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[appointment.appointment_status]}`}>
                          {appointment.appointment_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{appointment.slot_object?.[0]?.slotTime || "-"}</td>
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