// src/components/BallsGrid.jsx
import { AnimatePresence, motion } from "framer-motion";
import { Box, Tooltip } from "@mui/material";
import { useMemo } from "react";

// Transitions from deep purple -> magenta -> orange -> bright yellow
const MAGMA_COLORS = [
  { r: 42, g: 11, b: 79 },
  { r: 205, g: 50, b: 128 },
  { r: 253, g: 135, b: 53 },
  { r: 252, g: 253, b: 191 },
];

// Helper to linearly interpolate between two values
const lerp = (a, b, t) => a + (b - a) * t;

// Gets the color for a given value `t` (0 to 1) along the magma scale
function colorFor(t) {
  const segmentCount = MAGMA_COLORS.length - 1;
  const segment = Math.floor(t * segmentCount);
  const segmentT = t * segmentCount - segment;

  const start = MAGMA_COLORS[segment];
  const end = MAGMA_COLORS[Math.min(segment + 1, segmentCount)];

  const r = Math.round(lerp(start.r, end.r, segmentT));
  const g = Math.round(lerp(start.g, end.g, segmentT));
  const b = Math.round(lerp(start.b, end.b, segmentT));

  return `rgb(${r}, ${g}, ${b})`;
}

export default function BallsGrid({ N, collected, lastDraw, drawCounts = [] }) {
  // Memoize sanitized props for performance
  const safeN = useMemo(
    () => (Number.isFinite(N) && N > 0 ? Math.floor(N) : 0),
    [N]
  );
  const safeCollected = useMemo(
    () =>
      collected instanceof Set
        ? collected
        : new Set(Array.isArray(collected) ? collected : []),
    [collected]
  );
  const maxCount = useMemo(
    () => (drawCounts.length ? Math.max(1, ...drawCounts) : 1),
    [drawCounts]
  );

  return (
    <Box
      display="flex"
      justifyContent="center"
      flexWrap="wrap"
      gap={2.5}
      my={4}
    >
      <AnimatePresence>
        {Array.from({ length: safeN }, (_, i) => {
          const count = drawCounts[i] ?? 0;
          const isLast = lastDraw === i;

          // Normalize count to a 0-1 range for the color function
          const heatT = Math.min(count / maxCount, 1);
          const heatColor = colorFor(heatT);

          // Subtle scale increase based on draw count
          const baseScale = 1 + Math.min(count * 0.03, 0.15);

          return (
            <Tooltip
              key={i}
              title={`Drawn: ${count} time(s)`}
              arrow
              placement="top"
            >
              <motion.div
                aria-label={`Ball ${i + 1}, drawn ${count} times`}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  color: "#fff",
                  cursor: "pointer",
                  // Use the generated color in the gradient and shadow
                  background: `radial-gradient(circle, ${heatColor} 0%, #1a1a1a 85%)`,
                  textShadow: "1px 1px 3px rgba(0, 0, 0, 0.7)",
                }}
                animate={{
                  scale: isLast ? baseScale * 1.2 : baseScale,
                  y: isLast ? -5 : 0,
                  boxShadow: isLast
                    ? `0 0 20px #e4d2d2ff, 0 0 30px ${heatColor}` // Brighter white glow for last draw
                    : `0 0 12px ${heatColor}`,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                whileHover={{ scale: baseScale * 1.1, y: -5 }}
              >
                {i + 1}
              </motion.div>
            </Tooltip>
          );
        })}
      </AnimatePresence>
    </Box>
  );
}
