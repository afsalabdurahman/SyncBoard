import { useState } from 'react';

export default function SimpleAlert({message,onclose}) {


  return (
    <div >
     

    
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-4 w-64 z-50">
  <div className="text-center">
    <h2 className="text-lg font-semibold text-gray-800 mb-2">Rejection Reason</h2>
    <p className="text-gray-600 mb-4">{message}</p>
    <button
      onClick={() => onclose(false)}
      className="bg-blue-600 text-white px-4 py-1 rounded-lg font-medium hover:bg-blue-700 transition-colors"
    >
      OK
    </button>
  </div>
</div>

    
    </div>
  );
}