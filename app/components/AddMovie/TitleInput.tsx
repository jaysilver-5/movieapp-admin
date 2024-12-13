import React from "react";
import SeriesToggle from "./SeriesToggle";

interface Props {
  title: string;
  setTitle: (value: string) => void;
  series: any;
  handleSeries: any;
  setSeries: any;
}

const TitleInput: React.FC<Props> = ({ title, setTitle, series, handleSeries, setSeries }) => {
  return (
    <div className="w-full">
        <label className="px-1 text-[12px] text-gray-600 relative top-[10px] left-4 z-50 bg-white">Title</label>
        <div className="flex items-center space-x-2 mb-3 w-full">
            <input
            type="text"
            className="w-full p-2 border rounded-full focus:outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Movie Title"
            required
            />
            <SeriesToggle series={series} handleSeries={() => handleSeries(series, setSeries)} />
        </div>
    </div>
  );
};

export default TitleInput;
