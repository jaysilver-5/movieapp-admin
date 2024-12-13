import React from "react";

interface Props {
  season: string;
  setSeason: (value: string) => void;
}

const SeasonsSelect: React.FC<Props> = ({ season, setSeason }) => {
  return (
    <div className="flex-1">
        <label className="px-1 text-[12px] text-gray-600 relative top-[10px] left-4 z-50 bg-white">Seasons</label>
        <select
        className="w-full bg-white p-2 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-blue-200"
        value={season}
        onChange={(e) => setSeason(e.target.value)}
        >
        <option value="">Select Season</option>
        {Array.from({ length: 50 }, (_, num) => (
            <option key={num} value={num + 1}>Season {num + 1}</option>
        ))}
        </select>
    </div>
  );
};

export default SeasonsSelect;
