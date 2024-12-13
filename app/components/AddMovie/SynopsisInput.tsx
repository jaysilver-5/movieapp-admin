import React from "react";
        <label className="px-1 text-[12px] text-gray-600 relative top-[10px] left-4 z-50 bg-white">Title</label>

interface Props {
  synopsis: string;
  setSynopsis: (value: string) => void;
}

const SynopsisInput: React.FC<Props> = ({ synopsis, setSynopsis }) => {
  return (
    <div className="w-full">
        <label className="px-1 text-[12px] text-gray-600 relative top-[10px] left-4 z-50 bg-white">Synopsis</label>
        <textarea
        className="rounded-2xl w-full p-2 border border-gray-300 focus:outline-none"
        rows={4}
        value={synopsis}
        onChange={(e) => setSynopsis(e.target.value)}
        ></textarea>
    </div>
  );
};

export default SynopsisInput;
