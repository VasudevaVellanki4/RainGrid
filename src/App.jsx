import React, { useState, useEffect } from "react";
import {
  Settings,
  RefreshCw,
  Code,
  Info,
  Twitter,
  Layers,
  Sliders,
} from "lucide-react";
import RainGrid from "./components/RainGrid";

const App = () => {
  const [gridConfig, setGridConfig] = useState({
    rows: 15,
    cols: 20,
    squareSize: 25,
    fallingIntensity: 0.5,
    gravityMultiplier: 1,
  });
  const [activeSection, setActiveSection] = useState("about");

  const handleConfigChange = (key, value) => {
    setGridConfig((prev) => ({
      ...prev,
      [key]:
        key === "fallingIntensity"
          ? Math.max(0, Math.min(value, 1))
          : Math.max(5, Math.min(value, 30)),
    }));
  };

  const randomizeGrid = () => {
    setGridConfig({
      rows: Math.floor(Math.random() * 15) + 10,
      cols: Math.floor(Math.random() * 15) + 15,
      squareSize: Math.floor(Math.random() * 10) + 20,
      fallingIntensity: Math.random(),
      gravityMultiplier: Math.random() * 2,
    });
  };

  const renderSection = () => {
    switch (activeSection) {
      case "config":
        return (
          <div className="bg-black/50 p-6 rounded-xl max-w-md mx-auto">
            <h3 className="text-2xl text-white font-bold mb-4 flex items-center">
              <Sliders className="mr-2" /> Grid Configuration
            </h3>
            <div className="space-y-4">
              {[
                { key: "rows", min: 5, max: 30, label: "Rows" },
                { key: "cols", min: 5, max: 30, label: "Columns" },
                { key: "squareSize", min: 10, max: 40, label: "Square Size" },
                {
                  key: "fallingIntensity",
                  min: 0,
                  max: 1,
                  step: 0.1,
                  label: "Falling Intensity",
                },
                {
                  key: "gravityMultiplier",
                  min: 0,
                  max: 2,
                  step: 0.1,
                  label: "Gravity Multiplier",
                },
              ].map((config) => (
                <div key={config.key}>
                  <label className="block text-white mb-2">
                    {config.label}: {gridConfig[config.key].toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min={config.min}
                    max={config.max}
                    step={config.step || 1}
                    value={gridConfig[config.key]}
                    onChange={(e) =>
                      handleConfigChange(config.key, Number(e.target.value))
                    }
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <RainGrid
        rows={gridConfig.rows}
        cols={gridConfig.cols}
        squareSize={gridConfig.squareSize}
        fallingIntensity={gridConfig.fallingIntensity}
        gravityMultiplier={gridConfig.gravityMultiplier}
      />

      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20">
        <div className="flex space-x-2">
          {["about", "config", "code"].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`p-2 rounded-full transition-all ${
                activeSection === section
                  ? "bg-white/30"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {section === "about" && <Info color="white" size={24} />}
              {section === "config" && <Settings color="white" size={24} />}
              {section === "code" && <Layers color="white" size={24} />}
            </button>
          ))}
        </div>

        <button
          onClick={randomizeGrid}
          className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all z-20"
        >
          <RefreshCw color="white" size={24} />
        </button>
      </div>

      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="w-full max-w-4xl p-4">
          <div className="pointer-events-auto">{renderSection()}</div>
        </div>
      </div>
    </div>
  );
};

export default App;
