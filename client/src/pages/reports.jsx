import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    apiRequest("/reports")
      .then((data) => {
        if (!cancelled) {
          setReports(data.reports);
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
    return <p>Loading reports...</p>;
  }

  if (error) {
    return (
      <p className="error-message">
        {error}
      </p>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>Reports</h1>
        <p>View available system reports.</p>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Report</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{report.title}</td>
                <td>{report.status}</td>
                <td>{report.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}