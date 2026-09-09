import { useEffect, useState } from "react";
import axios from "axios";
import Slidebar from "./Slidebar";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableContainer,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  useTheme,
} from "@mui/material";
import {
  Bar,
  Pie,
  Doughnut,
  Line
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend, LineElement, PointElement);

interface Asset {
  id: number;
  name: string;
  description: string;
  status: string;
  capability: string;
  portfolio: string;
}

const Reports = () => {
  const theme = useTheme();
  const [assets, setAssets] = useState<Asset[]>([]);
  const API_URL = "http://localhost:5256/api/AI/Aset";

  useEffect(() => {
    axios
      .get<Asset[]>(API_URL, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      })
      .then((res) => setAssets(res.data))
      .catch((err) => console.error(err));
  }, []);

  // UNIQUE VALUES
  const portfolios = [...new Set(assets.map(a => a.portfolio))];
  const statuses = [...new Set(assets.map(a => a.status))];
  const capabilities = [...new Set(assets.map(a => a.capability))];

  // PORTFOLIO COUNTS
  const portfolioCount = portfolios.map(p => 
    assets.filter(a => a.portfolio === p).length
  );

  // STATUS COUNTS
  const statusCount = statuses.map(s => 
    assets.filter(a => a.status === s).length
  );

  // CAPABILITY COUNTS
  const capabilityCount = capabilities.map(c =>
    assets.filter(a => a.capability === c).length
  );

  const barChartData = {
    labels: portfolios,
    datasets: [
      {
        label: "Assets by Portfolio",
        data: portfolioCount,
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderColor: "rgba(0, 0, 0, 0.2)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(0, 0, 0, 0.1)",
        borderRadius: {
          topLeft: 5,
          topRight: 5,
        },
      },
    ],
  };

  const pieChartData = {
    labels: statuses,
    datasets: [
      {
        label: "Assets by Status",
        data: statusCount,
        backgroundColor: [
          "#8884d8",
          "#82ca9d",
          "#ffc658",
          "#ff8042",
          "#a4de6c",
          "#d0ed57",
        ],
        hoverOffset: 4,
      },
    ],
  };

  const capabilityLineChartData = {
    labels: capabilities,
    datasets: [
      {
        label: "Assets by Capability",
        data: capabilityCount,
        fill: true,
        borderColor: "#4bc0c0",
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, "rgba(75, 192, 192, 0.5)");
          gradient.addColorStop(1, "rgba(75, 192, 192, 0)");
          return gradient;
        },
        stepped: true,
        pointBackgroundColor: "#4bc0c0",
      },
    ],
  };

  const capabilityDoughnutChartData = {
    labels: capabilities,
    datasets: [
      {
        label: "Assets by Capability",
        data: capabilityCount,
        backgroundColor: [
          "#4BC0C0",
          "#FF6384",
          "#FFCE56",
          "#36A2EB",
          "#9966FF",
          "#FF9F40"
        ],
        hoverBackgroundColor: [
          "#4BC0C0",
          "#FF6384",
        ],
      },
    ],
  };
  return (
    <>
      <Slidebar />
      <div style={{ marginLeft: 70, padding: 24 }}>
        
        {/* PAGE HEADER */}
        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
          📊 Assets Report & Analytics
        </Typography>

        {/* GRAPHS SECTION */}
        <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {/* BAR CHART */}
          <Paper sx={{ p: 3, width: "45%" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Assets by Portfolio
            </Typography>
            <Bar data={barChartData} />
          </Paper>

          {/* PIE CHART */}
          <Paper sx={{ p: 3, width: "45%" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Assets by Status
            </Typography>
            <Pie data={pieChartData} />
          </Paper>

          {/* CAPABILITY LINE CHART */}
          <Paper sx={{ p: 3, width: "45%" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Assets by Capability
            </Typography>
            <Line data={capabilityLineChartData} />
          </Paper>

          {/* CAPABILITY DOUGHNUT CHART */}
          <Paper sx={{ p: 3, width: "45%" }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Assets by Capability (Doughnut)
            </Typography>
            <Doughnut data={capabilityDoughnutChartData} />
          </Paper>
        </Box>

        {/* SUMMARY TABLE */}
        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          Summary Breakdown
        </Typography>

        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme.palette.mode === "light" ? "#f0f4f9" : theme.palette.grey[800] }}>
                <TableCell><strong>Category</strong></TableCell>
                <TableCell><strong>Value</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Total Assets</TableCell>
                <TableCell>{assets.length}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Total Unique Portfolios</TableCell>
                <TableCell>{portfolios.length}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Total Unique Status Values</TableCell>
                <TableCell>{statuses.length}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Total Unique Capabilities</TableCell>
                <TableCell>{capabilities.length}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

      </div>
    </>
  );
};

export default Reports;
