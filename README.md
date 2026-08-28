# Ethanol Purity Calculator

A responsive Next.js web application that calculates **ethanol purity** and **specific gravity** from temperature and observed degree measurements.

## Features

- 🌡️ Calculates Degree @ 20°C using lookup table interpolation
- ✨ Computes ethanol purity using temperature-specific conversion factors
- 💧 Looks up specific gravity at 15.6°C from purity
- 📱 Fully responsive — works on mobile and desktop
- ⚡ Instant calculation with detailed breakdown
- 🔢 Input validation with helpful error messages

## Calculation Method

1. **Input**: Temperature (°C) + Observed Degree
2. **Lookup**: Find the corresponding Degree @ 20°C from the calibration table
3. **Purity**: `Degree @ 20°C ÷ Purity Factor (Volume @ 20°C Conversion Factor)`
4. **Specific Gravity**: Look up in the SG table using calculated purity

### Example
- Temperature: 28°C, Observed Degree: 99
- Degree @ 20°C: **96.7**
- Conversion Factor: **0.992**
- Purity: 96.7 ÷ 0.992 = **97.48%**
- Specific Gravity @ 15.6°C: **806.2**

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

```bash
npm run build
npm start
```

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- Data sourced from `ethanol.xlsx` AOAC calibration tables
