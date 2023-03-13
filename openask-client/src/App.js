import { useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

import { Routes, Route } from "react-router-dom";
import Sensei from "./components/Sensei";
import Feed from "./components/Feed";
import Sidebar from "./components/Sidebar";
import Questions from "./components/Questions";
import Answers from "./components/Answers";
import SenseiDetails from "./components/SenseiDetails";
import TransactionHistory from "./components/TransactionHistory";
import QuestionId from "./components/QuestionId";
import { useSelector } from "react-redux";

import "./css/app.css";
import AccessErrorLogin from "./components/subcomponents/AccessErrorLogin";

import { Avatar } from "@mui/material";

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const userInfo = useSelector((state) => state.userInfoSlice);

  // Open Sidebar
  const onAvatarClick = (e) => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <Container>
        {userInfo && userInfo.userUid && <AccessErrorLogin />}
        <Box
          className="user-avatar-container"
          sx={{ display: { xs: "flex", sm: "flex", md: "none" } }}
        >
          <Avatar
            className="user-avatar"
            sx={{ cursor: "pointer" }}
            src={userInfo && userInfo?.profile?.imageUrl}
            onClick={(event) => {
              event.stopPropagation();
              onAvatarClick();
            }}
          ></Avatar>
        </Box>
        <Sidebar
          onAvatarClick={onAvatarClick}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/feed" element={<Feed />} />
          <Route exact path="/sensei" element={<Sensei />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/answers" element={<Answers />} />
          <Route path="/sensei/:twitter" element={<SenseiDetails />} />
          <Route path="/transaction_history" element={<TransactionHistory />} />
          <Route path="/id/:id" element={<QuestionId />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
