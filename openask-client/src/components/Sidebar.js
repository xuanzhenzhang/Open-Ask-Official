import React from "react";
import SidebarList from "./SidebarList";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";

const Sidebar = (props) => {
  const { onAvatarClick, mobileOpen, setMobileOpen, signInTwitter } = props;

  return (
    <>
      <Drawer
        className="sidebar"
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={onAvatarClick}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "flex", sm: "flex", md: "none" },
          "& .MuiDrawer-paper": {
            width: "200px",
          },
        }}
      >
        <SidebarList
          setMobileOpen={setMobileOpen}
          mobileOpen={mobileOpen}
          signInTwitter={signInTwitter}
        />
      </Drawer>

      <Drawer
        className="sidebar"
        variant="permanent"
        anchor="right"
        sx={{
          display: { xs: "none", sm: "none", md: "flex" },
          "& .MuiDrawer-paper": {
            width: "300px",
          },
        }}
        open
      >
        <SidebarList signInTwitter={signInTwitter} />
      </Drawer>
    </>
  );
};

export default Sidebar;
