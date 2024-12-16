import React from "react";
import SeriesToggle from "./SeriesToggle";
import { IoMdAdd } from "react-icons/io";

interface Props {
  downloadLink: string;
  setDownloadLink: (value: string) => void;
  handleAddEpisode: any;
}

const EpisodeLink: React.FC<Props> = ({ downloadLink, setDownloadLink, handleAddEpisode }) => {
  return (
    <div className="w-full">
    <label className="px-1 text-[12px] text-gray-600 relative top-[10px] left-4 z-50 bg-white">Download Link</label>
    <div className="flex items-center space-x-2 mb-3">
      <input
        type="text"
        className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-blue-200"
        placeholder="Add a download link"
        value={downloadLink}
        onChange={(e) => setDownloadLink(e.target.value)}
      />
      <button
        type="button"
        className="px-2 py-2 bg-green-600 text-white rounded-full hover:bg-green-600"
        onClick={handleAddEpisode}
      >
        <IoMdAdd className="text-[20px] font-bold text-white" />
      </button>
    </div>
    <div className="flex flex-wrap gap-2">
    </div>
  </div>
  );
};

export default EpisodeLink;


