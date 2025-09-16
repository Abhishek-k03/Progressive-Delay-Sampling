# 🎲 Progressive Decay Sampling (React + Vite)

A **React + Vite** project that demonstrates **progressive decay sampling**, an interactive probabilistic simulation where each draw reduces the probability of the chosen item. It’s a fun, visual way to explore probability, decay mechanisms, and randomness. Perfect for learning probability concepts, visualization, and UI animation.

---

## ⚡ Features

### Core Features
- **Interactive Ball Grid:** Visual representation of N items (balls) with real-time updates on draw counts.
- **Progressive Decay Sampling:** Each draw reduces the likelihood of that item being chosen again.
- **Draw History Tracking:** Keep track of collected items and number of turns.
- **Dynamic Probability Display:** See probabilities update in real-time via charts.
- **Draw Count Heatmap:** Visualize which items are drawn more frequently.
- **Animated Effects:** Smooth scaling and color transitions for selected balls.
- **Custom Decay Functions:** Exponential, linear, or fully custom decay logic.

### Advanced Features
- **Turbo Mode:** Draw items rapidly using requestAnimationFrame.
- **AutoPlay Modes:** Stop, loop, or infinite modes.
- **Seeded RNG:** Reproducible draws via a custom or user-provided seed.
- **Advanced Controls Panel:** Modify N, decay type, speed, seed, and turbo settings.
- **Export / Import Settings:** Save your sampler configuration as JSON and reload it later.

### Visualizations
- **Probability Chart:** Shows current probability distribution of all items.
- **Progress Chart:** Tracks how many items are collected over time.
- **Heatmap Chart:** Displays a heatmap of draw counts for a quick overview.

---

## 🏗 Tech Stack

- **React 18** – Interactive UI
- **Vite** – Fast development environment with HMR
- **Framer Motion** – Animations for balls
- **Material UI (MUI)** – Component library
- **Styled Components** – Theme customization
- **Chart.js / Recharts** – Charts for probability, progress, and heatmap

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9 or yarn ≥ 1.22

### Installation
1. Clone the repository:
```bash
git clone https://github.com/yourusername/progressive-decay-sampler.git
cd progressive-decay-sampler
