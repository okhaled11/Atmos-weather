# Atmos


**Atmos** is a modern, responsive weather dashboard built with vanilla JavaScript, CSS, and the OpenWeatherMap APIs.

## 🚀 Features

- **Real‑Time Current Conditions**
  - Live temperature, description, and dynamic icon
  - Auto‑detect location or search by city
- **Hourly & 5‑Day Forecasts**
  - Smooth slide‑in animations for forecast cards
  - Responsive layout with day names and dates
- **Sunrise & Sunset Times**
  - Accurate local times via `moment.js` & timezone offsets
- **Air Quality Insights**
  - Displays PM₂.₅, PM₁₀, CO, NO₂, O₃, etc., with clear labels
  - Color‑coded AQI badge (Good → Very Poor)
- **UX Enhancements**
  - Toast notifications for errors
  - "Scroll to Top" button with pulsing animation on mobile

## 🛠️ Tech Stack

- JavaScript (ES6)
- CSS3 (Flexbox, Grid, CSS Variables)
- [OpenWeatherMap APIs](https://openweathermap.org/api) (Current, Forecast, Air‑Pollution)
- [Moment.js](https://momentjs.com/) for time formatting
- [Font Awesome](https://fontawesome.com/) for icons

## 📦 Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/atmos.git
   ```
2. **Install dependencies** (if using a bundler or package manager)
   ```bash
   npm install
   ```
3. **Run locally**
   - Open `index.html` in your browser **OR**
   - Serve via a static server:
     ```bash
     npx serve .
     ```

## ⚙️ Usage

1. Enter a city name and click **Search**
2. Click **Current Location** to fetch your local weather
3. Scroll to view hourly and 5-day forecasts
4. Use the **Scroll to Top** button to quickly navigate

## 🌐 Links

- **Live Demo:** [https://Atmos_weather](https://okhaled11.github.io/Atmos-weather/)

