import React from "react";

interface Props {
  episode: string;
  setEpisode: (value: string) => void;
}

const EpisodeSelect: React.FC<Props> = ({ episode, setEpisode }) => {
  return (
    <div className="flex-1">
        <label className="px-1 text-[12px] text-gray-600 relative top-[10px] left-4 z-50 bg-white">Episode</label>
        <select
        className="w-full bg-white p-2 border border-gray-300 rounded-full focus:outline-none"
        value={episode}
        onChange={(e) => setEpisode(e.target.value)}
        >
        <option value="">Select Episode</option>
        {Array.from({ length: 50 }, (_, num) => (
            <option key={num} value={num + 1}>Episode {num + 1}</option>
        ))}
        </select>
    </div>
  );
};

export default EpisodeSelect;
