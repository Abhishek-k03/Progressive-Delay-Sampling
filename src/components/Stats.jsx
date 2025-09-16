// src/components/Stats.jsx
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

export default function Stats({ turn, collectedCount, N }) {
  return (
    <Box mt={3} textAlign="center">
      <Typography variant="body1">
        Draws: <strong style={{ color: "#90caf9" }}>{turn}</strong> | Collected:{" "}
        <strong style={{ color: "#82ca9d" }}>{collectedCount}</strong>/{N}
      </Typography>

      {collectedCount === N && (
        <motion.p
          style={{
            color: "#82ca9d",
            fontWeight: "bold",
            fontSize: "1.2rem",
            marginTop: "8px",
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          🎉 All items collected in {turn} turns!
        </motion.p>
      )}
    </Box>
  );
}
