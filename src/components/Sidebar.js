import React, { useState } from 'react';
import { Home, BarChart } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material'; // Import Typography for styling

const Sidebar = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div
      className={`sidebar ${isHovered ? 'expanded' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <SidebarItem icon={<Home />} label="Home" isHovered={isHovered} path="/" />
      <SidebarItem
        icon={<Typography variant="h6" style={{ marginRight: '4px' }}>₹</Typography>} // Indian Rupee symbol
        label="Recent Tariff"
        isHovered={isHovered}
        path="/recent-tariffs"
      />
      <SidebarItem icon={<BarChart />} label="Recent Consumptions" isHovered={isHovered} path="/recent-consumptions" />
    </div>
  );
};

const SidebarItem = ({ icon, label, isHovered, path }) => (
  <Link to={path} className="sidebar-item">
    <div className="sidebar-icon">{icon}</div>
    {isHovered && <span className="sidebar-label">{label}</span>}
  </Link>
);

export default Sidebar;
