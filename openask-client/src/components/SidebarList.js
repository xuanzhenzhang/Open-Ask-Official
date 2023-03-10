import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { Box, Backdrop, Divider } from "@mui/material";
import AskQuestion from "./subcomponents/AskQuestion";
import { WalletCard } from "./WalletCard";
import LensCard from "./LensCard";
import { openAskLogo } from "./data/VectorSVGs";
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
  answersOutlined,
  answersFilled,
} from "./data/VectorSVGs";

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
    } else if (location.pathname === "/answers") {
      setSelectedIndex(3);
    } else if (location.pathname === "/transaction_history") {
      setSelectedIndex(4);
    } else if (
      location.pathname === `/sensei/${userInfo && userInfo?.profile.handle}`
    ) {
      setSelectedIndex(5);
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
      text: "Answers",
      link: "/answers",
      svg: selectedIndex === 3 ? answersFilled : answersOutlined,
    },
    {
      text: "Transactions",
      link: "/transaction_history",
      svg: selectedIndex === 4 ? transactionsFilled : transactionsOutlined,
    },
    {
      text: "Profile",
      // link: `/sensei/${userInfo && userInfo?.profile?.handle}`,
      link: `/sensei/${
        getProfileHandle()
          ? getProfileHandle()
          : userInfo && userInfo?.profile?.handle
      }`,
      svg: selectedIndex === 5 ? profileFilled : profileOutlined,
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
