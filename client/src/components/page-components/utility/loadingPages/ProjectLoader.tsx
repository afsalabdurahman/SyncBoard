import React, { useState, useEffect } from 'react';

const ProjectLoader = (props:any) => {
  const [shapeIndex, setShapeIndex] = useState(0);

  const shapes = [
    'w-4 h-4 bg-black rounded-full', // Circle
    'w-4 h-4 bg-black', // Square
    'w-4 h-4 bg-black transform rotate-45', // Diamond
    'w-6 h-1 bg-black rounded-full', // Line
    'w-0 h-0 border-l-2 border-r-2 border-b-4 border-transparent border-b-black', // Triangle
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setShapeIndex((prev) => (prev + 1) % shapes.length);
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="flex items-center justify-center w-12 h-12 mb-4">
        <div 
          className={`${shapes[shapeIndex]} transition-all duration-200 ease-in-out`}
        />
      </div>
      <p className="text-black text-sm font-medium">{props.title||"Please Wait..."}</p>
    </div>
  );
};

export default ProjectLoader;