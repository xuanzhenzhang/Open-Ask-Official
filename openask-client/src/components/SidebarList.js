import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import { Button, Backdrop, Badge } from "@mui/material";
import { Box } from "@mui/material";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import TwitterIcon from "@mui/icons-material/Twitter";
import AskQuestion from "./AskQuestion";
import { WalletCard } from "./WalletCard";
import LensCard from "./LensCard";
import { openAskLogo } from "./subcomponents/VectorSVGs";
import {
  homeFilled,
  homeOutlined,
  senseiFilled,
  senseiOutlined,
  questionsFilled,
  questionsOutlined,
  transactionsFilled,
  transactionsOutlined,
  profileFilled,
  profileOutlined,
} from "./subcomponents/VectorSVGs";

import { useNavigate, useParams } from "react-router-dom";
import axios, * as others from "axios";

const SidebarList = ({
  userInfo,
  accessToken,
  setAccessError,
  setMobileOpen,
  mobileOpen,
}) => {
  const [open, setOpen] = useState(false);

  const [hidden, setHidden] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [waitingQuestionsCount, setWaitingQuestionsCount] = useState();

  const navigate = useNavigate();
  const getProfileHandle = () => {
    return localStorage.getItem("profileHandle");
  };

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/feed") {
      setSelectedIndex(0);
    } else if (location.pathname === "/sensei") {
      setSelectedIndex(1);
    } else if (location.pathname === "/questions") {
      setSelectedIndex(2);
    } else if (location.pathname === "/transaction_history") {
      setSelectedIndex(3);
    } else if (
      location.pathname === `/sensei/${userInfo && userInfo?.profile.handle}`
    ) {
      setSelectedIndex(4);
    }
  }, [location]);

  const sidebarItems = [
    {
      text: "Home",
      link: "/feed",
      svg: selectedIndex === 0 ? homeFilled : homeOutlined,
    },
    {
      text: "Sensei",
      link: "/sensei",
      svg: selectedIndex === 1 ? senseiFilled : senseiOutlined,
    },
    {
      text: "Questions",
      link: "/questions",
      svg: selectedIndex === 2 ? questionsFilled : questionsOutlined,
    },
    {
      text: "Transactions",
      link: "/transaction_history",
      svg: selectedIndex === 3 ? transactionsFilled : transactionsOutlined,
    },
    {
      text: "Profile",
      // link: `/sensei/${userInfo && userInfo?.profile?.handle}`,
      link: `/sensei/${getProfileHandle() ? getProfileHandle() : (userInfo && userInfo?.profile?.handle)}`,
      svg: selectedIndex === 4 ? profileFilled : profileOutlined,
    },
  ];

  // Find waiting questions count
  useEffect(() => {
    const getQuestionsFor = async () => {
      if (userInfo) {
        try {
          const { data } = await axios.get(
            `https://us-central1-open-ask-dbbe2.cloudfunctions.net/api/questions-for/${userInfo.userUid}`
          );
          const waiting = data.filter((question) => {
            return !question.answerId;
          });
          // Set waiting questions count
          setWaitingQuestionsCount(waiting.length);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log("No ID");
      }
    };

    getQuestionsFor();
  }, [userInfo]);

  // Hide ask button
  useEffect(() => {
    if (window.location.pathname.startsWith("/sensei")) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  }, [window.location.pathname]);

  // Navigate to page and highlight current page
  const onItemClick = (link, index) => {
    // let updatedLink = link;
    // if (index == 4) {
    //   updatedLink = `/sensei/${getProfileHandle()}`;
    // }
    navigate(link);
    setSelectedIndex(index);
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };
  // Click ask question
  const onAskQuestion = () => {
    setOpen(!open);
  };

  // Navigate to ask page
  const onBtnClick = () => {
    setSelectedIndex(null);
    navigate("/sensei/ask");
  };

  const onProfileClick = () => {
    navigate(`/sensei/${userInfo.profile.handle}`);
  };

  const onAvatarLogin = () => {
    setOpen(!open);
  };

  const handleCloseBackdrop = () => {
    setOpen(false);
  };

  return (
    <>
      <Box className="sidebar-list-container">
        <Box className="sidebar-logo">{openAskLogo}</Box>

        <Divider variant="middle" />
        <Box sx={{ mt: "12px", mb: "12px" }}>
          {sidebarItems.map((item, index) => (
            <ul className="sidebar-list" key={index}>
              <li
                className={`sidebar-item ${
                  selectedIndex === index ? "sidebar-selected-item" : ""
                }`}
                onClick={() => onItemClick(item.link, index)}
              >
                {item.svg} {item.text}
              </li>
            </ul>
          ))}
        </Box>
        <Box className="ask-btn-container">
          {!hidden && (
            <button className="ask-btn" onClick={onAskQuestion} size="large">
              Ask Question
            </button>
          )}
          <WalletCard
            accessToken={accessToken}
            setAccessError={setAccessError}
          />
          <LensCard accessToken={accessToken} setAccessError={setAccessError} />
        </Box>
        <Divider variant="middle" />
        <Box className="sidebar-footer">
          <Typography>Terms of Service, Privacy Policy</Typography>
          <Typography>
            <span>&#169;</span> 2023 Boba Labs
          </Typography>
        </Box>
      </Box>

      <Backdrop className="ask-question-backdrop" open={open}>
        <AskQuestion
          userInfo={userInfo}
          accessToken={accessToken}
          setAccessError={setAccessError}
          handleCloseBackdrop={handleCloseBackdrop}
        />
      </Backdrop>
    </>
  );
};

export default SidebarList;
