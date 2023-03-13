import React from "react";
import SidebarList from "./SidebarList";
import Drawer from "@mui/material/Drawer";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const Sidebar = (props) => {
  const { onAvatarClick, mobileOpen, setMobileOpen } = props;

  const theme = useTheme();
  const breakpoint = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      {breakpoint && (
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
              backgroundColor: "#f2f2f2",
            },
          }}
        >
          <SidebarList setMobileOpen={setMobileOpen} mobileOpen={mobileOpen} />
        </Drawer>
      )}

      {!breakpoint && (
        <Drawer
          className="sidebar"
          variant="permanent"
          anchor="right"
          sx={{
            display: { xs: "none", sm: "none", md: "flex" },
            "& .MuiDrawer-paper": {
              width: "300px",
              backgroundColor: "#f2f2f2",
            },
          }}
          open
        >
          <SidebarList />
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
