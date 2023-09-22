// src/components/Sidebar.js
import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import { Menu, ChevronLeft, ChevronRight } from '@mui/icons-material';

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const toggleSidebar = () => {
    setOpen(!open);
  };

  return (
    <Drawer variant="permanent" sx={{ width: open ? 240 : 64, flexShrink: 0 }}>
      <div>
        <IconButton onClick={toggleSidebar}>
          {open ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </div>
      <List>
        <ListItem button>
          <ListItemIcon>
            <Menu />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        {/* Add more menu items as needed */}
      </List>
    </Drawer>
  );
};

export default Sidebar;
