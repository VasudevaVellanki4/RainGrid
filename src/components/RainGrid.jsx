import React, { useState, useEffect, useCallback } from "react";

const FallingSquaresGrid = ({ rows, cols, squareSize }) => {
  const calculateDimensions = useCallback(() => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const defaultCols = screenWidth < 640 ? 10 : 20;
    const defaultRows = screenWidth < 640 ? 10 : 15;
    const defaultSquareSize = screenWidth < 640 ? 20 : 30;

    return {
      rows: rows || defaultRows,
      cols: cols || defaultCols,
      squareSize: squareSize || defaultSquareSize,
    };
  }, [rows, cols, squareSize]);

  const [dimensions, setDimensions] = useState(calculateDimensions());
  const [grid, setGrid] = useState([]);
  const [rotation, setRotation] = useState(0);

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 200);
    const g = Math.floor(Math.random() * 200);
    const b = Math.floor(Math.random() * 200);
    const alpha = Math.random() * 0.7 + 0.3;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const initializeGrid = useCallback(() => {
    const { rows, cols } = dimensions;
    return Array(rows)
      .fill()
      .map(() =>
        Array(cols)
          .fill()
          .map(() => ({
            falling: false,
            color: getRandomColor(),
            position: 0,
            speed: 1,
            active: false,
          }))
      );
  }, [dimensions]);

  const simulateFalling = useCallback(() => {
    const { rows, squareSize } = dimensions;
    setGrid((prevGrid) => {
      return prevGrid.map((row) =>
        row.map((cell) => {
          if (!cell.falling && Math.random() > 0.99) {
            return {
              ...cell,
              falling: true,
              position: 0,
              speed: 1,
              active: true,
            };
          }

          if (cell.falling) {
            const newSpeed = cell.speed * 1.1;
            const newPosition = cell.position + newSpeed;

            if (newPosition < (rows - 1) * squareSize) {
              return {
                ...cell,
                position: newPosition,
                speed: newSpeed,
                active: true,
              };
            }

            return {
              ...cell,
              falling: false,
              position: 0,
              speed: 1,
              color: getRandomColor(),
              active: false,
            };
          }

          return cell;
        })
      );
    });

    setRotation((prevRotation) => (prevRotation + 1) % 360);
  }, [dimensions]);

  useEffect(() => {
    const handleResize = () => {
      setDimensions(calculateDimensions());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [calculateDimensions]);

  useEffect(() => {
    const initialGrid = initializeGrid();
    setGrid(initialGrid);

    const fallingInterval = setInterval(simulateFalling, 50);
    return () => clearInterval(fallingInterval);
  }, [initializeGrid, simulateFalling]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black overflow-hidden"
      style={{
        perspective: "1000px",
        backgroundAttachment: "fixed",
      }}
    >
      <div
        className="relative border-4 border-white rounded-lg shadow-2xl overflow-hidden"
        style={{
          width: `${dimensions.cols * dimensions.squareSize}px`,
          height: `${dimensions.rows * dimensions.squareSize}px`,
          maxWidth: "100vw",
          maxHeight: "100vh",
          boxShadow: "0 0 40px rgba(255,255,255,0.3)",
          position: "relative",
          transform: `rotate(${rotation}deg) rotateX(15deg)`,
          transition: "transform 0.5s ease-in-out, width 0.3s, height 0.3s",
          background: "rgba(255,255,255,0.05)",
        }}
      >
        {[...Array(dimensions.rows + 1)].map((_, i) => (
          <div
            key={`h-line-${i}`}
            className="absolute w-full border-t border-gray-700"
            style={{
              top: `${i * dimensions.squareSize}px`,
              left: 0,
              opacity: 0.5,
            }}
          />
        ))}

        {[...Array(dimensions.cols + 1)].map((_, i) => (
          <div
            key={`v-line-${i}`}
            className="absolute h-full border-l border-gray-700"
            style={{
              left: `${i * dimensions.squareSize}px`,
              top: 0,
              opacity: 0.5,
            }}
          />
        ))}

        <div className="absolute inset-0">
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="absolute"
                style={{
                  width: `${dimensions.squareSize}px`,
                  height: `${dimensions.squareSize}px`,
                  left: `${colIndex * dimensions.squareSize}px`,
                  top: `${rowIndex * dimensions.squareSize}px`,
                }}
              >
                {cell.active && (
                  <div
                    className="absolute w-full h-full"
                    style={{
                      backgroundColor: cell.color,
                      transform: `translateY(${cell.position}px)`,
                      transition: "transform 0.05s linear",
                      borderRadius: "2px",
                    }}
                  />
                )}
              </div>
            ))
          )}
        </div>

        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl sm:text-4xl md:text-6xl font-bold opacity-50"
          style={{
            textShadow: "0 0 20px rgba(255,255,255,0.3)",
            transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          }}
        >
          FOG
        </div>
      </div>
    </div>
  );
};

export default FallingSquaresGrid;
