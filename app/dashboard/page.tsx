'use client';
import React, { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { ClerkLogo } from "../components/clerk-logo";
import { NextLogo } from "../components/next-logo";
import Overview from "./Overview";
import UserList from "./UserList";
import AddMovie from "./AddMovie";
import {
  FaTachometerAlt,
  FaUsers,
  FaPlus,
  FaBars,
  FaChevronLeft,
} from "react-icons/fa";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />;
      case "users":
        return <UserList />;
      case "addMovie":
        return <AddMovie />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between bg-[#1a1a2e] text-white px-4 py-3 shadow-lg">
        <div className="flex items-center gap-4">
          <ClerkLogo />
          <div aria-hidden className="w-px h-6 bg-gray-600" />
          <NextLogo />
        </div>
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              userButtonAvatarBox: "size-6",
            },
          }}
        />
      </header>

      {/* Main Content */}
      <div className="flex flex-grow overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarCollapsed ? "w-16" : "w-64"
          } bg-[#1a1a2e] text-white transition-all duration-300 flex-shrink-0 flex flex-col`}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <div className={`${isSidebarCollapsed ? "hidden" : "block"} text-lg font-bold`}>
              Admin Dashboard
            </div>
            <button
              className="text-white hover:text-gray-400"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            >
              {isSidebarCollapsed ? <FaBars /> : <FaChevronLeft />}
            </button>
          </div>
          <nav className="flex flex-col space-y-2 mt-4">
            <button
              className={`flex items-center gap-4 px-4 py-3 hover:bg-gray-700 rounded-lg ${
                activeTab === "overview" ? "bg-gray-700" : ""
              }`}
              onClick={() => setActiveTab("overview")}
            >
              <FaTachometerAlt />
              {!isSidebarCollapsed && <span>Overview</span>}
            </button>
            <button
              className={`flex items-center gap-4 px-4 py-3 hover:bg-gray-700 rounded-lg ${
                activeTab === "users" ? "bg-gray-700" : ""
              }`}
              onClick={() => setActiveTab("users")}
            >
              <FaUsers />
              {!isSidebarCollapsed && <span>Users</span>}
            </button>
            <button
              className={`flex items-center gap-4 px-4 py-3 hover:bg-gray-700 rounded-lg ${
                activeTab === "addMovie" ? "bg-gray-700" : ""
              }`}
              onClick={() => setActiveTab("addMovie")}
            >
              <FaPlus />
              {!isSidebarCollapsed && <span>Add Movie</span>}
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow overflow-y-auto bg-gray-100 p-4">
          {renderTab()}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-[#1a1a2e] text-white p-2 text-[12px] text-center">
        © 2024 Your Company. All rights reserved.
      </footer>
    </div>
  );
}
