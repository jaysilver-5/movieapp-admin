import React from "react";
import SeriesToggle from "./SeriesToggle";

interface Props {
  downloadLink: string;
  setDownloadLink: (value: string) => void;
}

const DownloadLink: React.FC<Props> = ({ downloadLink, setDownloadLink }) => {
  return (
    <div className="w-full">
        <label className="px-1 text-[12px] text-gray-600 relative top-[10px] left-4 z-50 bg-white">Title</label>
        <div className="flex items-center space-x-2 mb-3 w-full">
            <input
            type="text"
            className="w-full p-2 border rounded-full focus:outline-none"
            value={downloadLink}
            onChange={(e) => setDownloadLink(e.target.value)}
            placeholder="Enter Movie Title"
            required
            />
        </div>
    </div>
  );
};

export default DownloadLink;
