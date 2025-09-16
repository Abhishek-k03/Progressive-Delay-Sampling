// src/components/ProbabilityChart.jsx
import { Paper, Typography } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";

function toDisplayData({ weights, probs, displayMode }) {
  if (displayMode === "raw-weights") {
    return weights.map((w, i) => ({ name: String(i + 1), value: w }));
  }
  if (
    displayMode === "normalized" ||
    displayMode === "log" ||
    displayMode === "linear"
  ) {
    return probs.map((d) => ({ name: d.name, value: d.prob }));
  }
  return probs.map((d) => ({ name: d.name, value: d.prob }));
}

export default function ProbabilityChart({
  weights,
  probs,
  displayMode = "linear",
}) {
  const data = toDisplayData({ weights, probs, displayMode });
  const isLog = displayMode === "log";
  const minDomain = isLog ? 1e-6 : 0;

  return (
    <Paper
      elevation={4}
      sx={{ p: 2, borderRadius: "12px", background: "rgba(0,0,0,0.2)" }}
    >
      <Typography variant="h6" color="primary" gutterBottom>
        Current Probabilities
      </Typography>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#888" />
          <YAxis
            dataKey="value"
            stroke="#888"
            scale={isLog ? "log" : "auto"}
            domain={[minDomain, "auto"]}
            allowDataOverflow={isLog}
          />
          <Tooltip
            formatter={(v) =>
              isLog
                ? Number(v).toExponential(2)
                : `${(Number(v) * 100).toFixed(2)}%`
            }
            contentStyle={{ background: "#333", border: "1px solid #555" }}
          />
          <Bar dataKey="value" fill="url(#colorUv)" radius={[5, 5, 0, 0]} />
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}
