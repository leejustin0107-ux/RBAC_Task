import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { apiRequest } from "../services/api";
import useAuth from "../context/UseAuth";

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    apiRequest("/dashboard")
      .then((data) => {
        if (!cancelled) {
          setDashboardData(data);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setError(error.message);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>

        <p>
          Welcome, {user?.name}.
        </p>
      </div>

      <div className="stats-grid">
        <div className="card">
          <p>Total Users</p>
          <h2>{dashboardData.stats.totalUsers}</h2>
        </div>

        <div className="card">
          <p>Active Users</p>
          <h2>{dashboardData.stats.activeUsers}</h2>
        </div>

        <div className="card">
          <p>Reports Generated</p>
          <h2>{dashboardData.stats.reportsGenerated}</h2>
        </div>

        <div className="card">
          <p>System Uptime</p>
          <h2>
            {dashboardData.stats.systemUptime}%
          </h2>
        </div>
      </div>

      <div className="charts-grid">
        <div className="card">
          <h2>User Growth</h2>
          <ResponsiveContainer
            width="100%"
            height={280}
          >
            <LineChart
              data={dashboardData.userGrowth}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="users"
                stroke="#222"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2>Weekly Activity</h2>
          <ResponsiveContainer
            width="100%"
            height={280}
          >
            <BarChart
              data={dashboardData.activity}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="day" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="requests"
                fill="#555"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}