import React from "react";
import SeriesToggle from "./SeriesToggle";

interface Props {
  se: string;
  setSe: (value: string) => void;
}

const Se: React.FC<Props> = ({ se, setSe }) => {
  return (
    <div className="w-full">
      <label className="px-1 text-[12px] text-gray-600 relative top-[10px] left-4 z-50 bg-white">Season</label>
      <input
        type="text"
        className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-blue-200"
        placeholder="Season"
        value={se}
        onChange={(e) => setSe(e.target.value)}
      />
    </div>
    // <div className="w-full">
    //     <label className="px-1 text-[12px] text-gray-600 relative top-[10px] left-4 z-50 bg-white">Title</label>
    //     <div className="flex items-center space-x-2 mb-3 w-full">
    //         <input
    //         type="text"
    //         className="w-full p-2 border rounded-full focus:outline-none"
    //         value={title}
    //         onChange={(e) => setTitle(e.target.value)}
    //         placeholder="Enter Movie Title"
    //         required
    //         />
    //     </div>
    // </div>
  );
};

export default Se;
