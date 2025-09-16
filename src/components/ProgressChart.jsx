// src/components/ProgressChart.jsx
import { Paper, Typography } from "@mui/material";
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from "recharts";

export default function ProgressChart({ data, N }) {
  return (
    <Paper
      elevation={4}
      sx={{ p: 2, borderRadius: "12px", background: "rgba(0,0,0,0.2)" }}
    >
      <Typography variant="h6" color="primary" gutterBottom>
        Collection Progress
      </Typography>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="turn" stroke="#888" />
          <YAxis domain={[0, N]} stroke="#888" />
          <Tooltip
            contentStyle={{ background: "#333", border: "1px solid #555" }}
          />
          <Line
            type="monotone"
            dataKey="collected"
            stroke="#3451c5ff"
            strokeWidth={3}
            dot={{ r: 2, fill: "#90b3bcff" }}
            activeDot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}
