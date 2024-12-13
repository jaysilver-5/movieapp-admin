import React from "react";

interface Props {
  series: boolean;
  handleSeries: () => void;
}

const SeriesToggle: React.FC<Props> = ({ series, handleSeries }) => {
  return (
    <button
      type="button"
      className={`px-[14px] py-[8px] text-white rounded-full ${series ? 'bg-green-600' : 'border text-[#000]'}`}
      onClick={handleSeries}
    >
      <span className={`${series ? 'text-[#fff]' : 'text-[#000]'}`}>Series</span>
    </button>
  );
};

export default SeriesToggle;
