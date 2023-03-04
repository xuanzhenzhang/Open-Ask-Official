// import React from "react";
// import AppBar from "@mui/material/AppBar";
// import Box from "@mui/material/Box";
// import IconButton from "@mui/material/IconButton";
// import Toolbar from "@mui/material/Toolbar";
// import Typography from "@mui/material/Typography";
// import Stack from "@mui/material/Stack";
// import Avatar from "@mui/material/Avatar";
// import { Hidden, Tooltip } from "@material-ui/core";

// import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
// import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
// import { useNavigate } from "react-router-dom";

// import { WalletCard } from "./WalletCard";

// const AppHeader = ({ onAvatarClick, userInfo, accessToken, setAccessError }) => {
//   const navigate = useNavigate();

//   return (
//     <>
//       <AppBar
//         color="transparent"
//         sx={{
//           backgroundColor: "white",
//           width: {
//             md:
//               window.location.pathname !== "/" ? `calc(100% - 300px)` : "100%",
//           },
//         }}
//         position="fixed"
//       >
//         <Toolbar
//           className="header"
//           sx={{
//             justifyContent: { md: "flex-end" },
//           }}
//         >
//           {/* {canGoBack && (
//             <IconButton
//               size="large"
//               edge="start"
//               color="inherit"
//               aria-label="menu"
//               sx={{ mr: 2 }}
//               onClick={() => navigate(-1)}
//             >
//               <ArrowBackIosNewIcon />
//             </IconButton>
//           )} */}
//           {window.location.pathname !== "/" && (
//             <Stack
//               className="home-bar"
//               direction="row"
//               spacing={1}
//               justifyContent="flex-start"
//               sx={{
//                 display: { md: "none" },
//               }}
//             >
//               <Hidden mdUp>
//                 <Tooltip title="Menu" placement="right" arrow>
//                   <Avatar
//                     className="avatar"
//                     alt={userInfo?.twitterHandle}
//                     src={userInfo?.twitterPFPUrl}
//                     onClick={onAvatarClick}
//                   ></Avatar>
//                 </Tooltip>
//               </Hidden>
//             </Stack>
//           )}
//           <Box
//             sx={{
//               position: "absolute",
//               left: 0,
//               right: 0,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               // zIndex: "1"
//             }}
//           >
//             <HourglassBottomIcon sx={{ fontSize: "24px" }} />
//             <Typography variant="h5" component="span">
//               Open Ask
//             </Typography>
//           </Box>
//           {window.location.pathname !== "/" && (
//             <WalletCard accessToken={accessToken} setAccessError={setAccessError} />
//           )}
//         </Toolbar>
//       </AppBar>
//     </>
//   );
// };

// export { AppHeader };
