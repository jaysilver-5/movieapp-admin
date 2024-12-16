import React from "react";
import SeriesToggle from "./SeriesToggle";

interface Props {
  newEpisodeTitle: string;
  setNewEpisodeTitle: (value: string) => void;
}

const EpisodeTitle: React.FC<Props> = ({ newEpisodeTitle, setNewEpisodeTitle }) => {
  return (
    <div className="">
      <label className="px-1 text-[12px] text-gray-600 relative top-[10px] left-4 z-50 bg-white">Episode</label>
      <input
        type="text"
        className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-blue-200"
        placeholder="Episode"
        value={newEpisodeTitle}
        onChange={(e) => setNewEpisodeTitle(e.target.value)}
      />
    </div>
  );
};

export default EpisodeTitle;
