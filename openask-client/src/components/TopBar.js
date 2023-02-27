import React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";


const TopBar = () => {
  const navigate = useNavigate();

  const onFeed = () => {
    navigate("/feed");
  };
  const onSensei = () => {
    navigate("/sensei");
  };

  return (
    <>
      <Breadcrumbs className="topbar" separator="|"
      sx={{
        width: { md: `calc(100% - 300px)` },
        ml: { md: `300px !important` },
      }}>
        <Typography className="topbar-item" onClick={onFeed}>
          Feed
        </Typography>
        <Typography className="topbar-item" onClick={onSensei}>
          Sensei
        </Typography>
      </Breadcrumbs>
    </>
  );
};

export default TopBar;
