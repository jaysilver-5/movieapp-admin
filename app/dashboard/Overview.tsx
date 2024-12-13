import React from "react";

const Overview: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Overview</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-lg font-bold">Total Movies</h2>
          <p className="text-4xl">150</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-lg font-bold">Total Users</h2>
          <p className="text-4xl">500</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-lg font-bold">Downloads Today</h2>
          <p className="text-4xl">320</p>
        </div>
      </div>
    </div>
  );
};

export default Overview;
