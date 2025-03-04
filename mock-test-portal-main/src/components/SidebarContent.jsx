import React, { useState } from "react";
import { VStack, Text, IconButton } from "@chakra-ui/react";
import { FaBars, FaTimes, FaHome, FaClipboardList, FaChartBar, FaUser, FaTrophy } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "../styles/sidebar.css";

const SidebarContent = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Toggle Button */}
      <IconButton
        icon={isOpen ? <FaTimes /> : <FaBars />}
        className="sidebar-toggle"
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <VStack spacing={4} align="start" className={`sidebar ${isOpen ? "open" : ""}`}>
        <Text fontSize="xl" fontWeight="bold" className="portal-title">
          🏆 Mock Test Portal
        </Text>
        <NavItem to="/" icon={FaHome} label="Home" toggleSidebar={toggleSidebar} />
        <NavItem to="/tests" icon={FaClipboardList} label="Tests" toggleSidebar={toggleSidebar} />
        <NavItem to="/results" icon={FaChartBar} label="Results" toggleSidebar={toggleSidebar} />
        <NavItem to="/profile" icon={FaUser} label="Profile" toggleSidebar={toggleSidebar} />
        <NavItem to="/leaderboard" icon={FaTrophy} label="Leaderboard" toggleSidebar={toggleSidebar} />
      </VStack>
    </>
  );
};

const NavItem = ({ to, icon, label, toggleSidebar }) => (
  <NavLink to={to} className={({ isActive }) => (isActive ? "active" : "")} onClick={toggleSidebar}>
    <div className="nav-item">
      <span className="nav-icon">{React.createElement(icon)}</span>
      {label}
    </div>
  </NavLink>
);

export default SidebarContent;
