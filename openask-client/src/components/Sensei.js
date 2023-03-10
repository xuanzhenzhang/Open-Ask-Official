import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import {
  Autocomplete,
  TextField,
  Menu,
  MenuItem,
  Avatar,
  Backdrop,
} from "@mui/material";
import { getUsers } from "./functions/getUsers";
import Loader from "./subcomponents/Loader";
import QuestionHeader from "./subcomponents/card/QuestionHeader";
import SenseiBody from "./subcomponents/SenseiBody";
import AskQuestion from "./subcomponents/AskQuestion";

const Sensei = ({ userInfo, accessToken, setAccessError }) => {
  const [loading, setLoading] = useState(false);
  const [filteredSensei, setFilteredSensei] = useState();
  const [autocompleteSensei, setAutocompleteSensei] = useState([]);

  const [lastClicked, setLastClicked] = useState("Latest");
  const [filterName, setFilterName] = useState("Latest");
  const [searchTerm, setSearchterm] = useState();

  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [askedSensei, setAskedSensei] = useState();

  const [sortAlphabetical, setSortAlphabetical] = useState(1);
  const [sortFollowers, setSortFollowers] = useState(-1);
  const [sortJoined, setSortJoined] = useState(-1);
  const [sortAnswered, setSortAnswered] = useState(-1);

  const navigate = useNavigate();

  // Get all users
  useEffect(() => {
    setLoading(true);
    getUsers().then((users) => {
      const modifiedUsers = users.map((user) => {
        if (user?.profile?.imageUrl?.startsWith("ipfs")) {
          return {
            ...user,
            profile: {
              ...user.profile,
              imageUrl: `https://ipfs.io/ipfs/${
                user.profile.imageUrl.split("/")[2]
              }`,
            },
          };
        } else {
          return user;
        }
      });
      setFilteredSensei(modifiedUsers);
      setAutocompleteSensei(modifiedUsers);
      setLoading(false);
    });
  }, []);

  // Click ask question
  const onAskQuestion = (senseiDisplayName) => {
    setAskedSensei(senseiDisplayName);
    setOpenBackdrop(!open);
  };

  // Navigate to sensei details page
  const onSenseiClick = (twitter) => {
    navigate(`/sensei/${twitter}`);
  };

  // Close backdrop
  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };

  // Sorting Features
  // Sort senseis by date joined Open Ask
  const sortByJoined = () => {
    const newSortJoined = sortJoined === 1 ? -1 : 1;
    setSortJoined(newSortJoined);

    setFilteredSensei(
      [...filteredSensei].sort((a, b) => {
        if (sortJoined === 1) {
          setFilterName("Earliest");
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
        if (sortJoined === -1) {
          setFilterName("Latest");
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return 0;
      })
    );
    setLastClicked("joined");
  };

  // Sort senseis alphabetically
  const sortByAlphabetical = () => {
    const newSortAlphabetical = sortAlphabetical === 1 ? -1 : 1;
    setSortAlphabetical(newSortAlphabetical);

    setFilteredSensei(
      [...filteredSensei].sort((a, b) => {
        if (
          a.profile.displayName.toLowerCase() >
          b.profile.displayName.toLowerCase()
        ) {
          setFilterName("Alphabetical (Z-A)");
          return sortAlphabetical;
        }
        if (
          a.profile.displayName.toLowerCase() <
          b.profile.displayName.toLowerCase()
        ) {
          setFilterName("Alphabetical (A-Z)");
          return -sortAlphabetical;
        }
        return 0;
      })
    );
    setLastClicked("alphabetical");
  };

  // Sort senseis by twitter followers
  const sortByFollowers = () => {
    const newSortFollowers = sortFollowers === 1 ? -1 : 1;
    setSortFollowers(newSortFollowers);

    setFilteredSensei(
      [...filteredSensei].sort((a, b) => {
        if (a.profile.followers_count > b.profile.followers_count) {
          setFilterName("Followers (High)");
          return sortFollowers;
        }
        if (a.profile.followers_count < b.profile.followers_count) {
          setFilterName("Followers (Low)");
          return -sortFollowers;
        }
        return 0;
      })
    );
    setLastClicked("followers");
  };

  // Sort senseis by questions answered
  const sortByAnswered = () => {
    const newSortAnswered = sortAnswered === 1 ? -1 : 1;
    setSortAnswered(newSortAnswered);

    setFilteredSensei(
      [...filteredSensei].sort((a, b) => {
        if (a.questionsFor.length > b.questionsFor.length) {
          setFilterName("Answered (High)");
          return sortAnswered;
        }
        if (a.questionsFor.length < b.questionsFor.length) {
          setFilterName("Answered (Low)");
          return -sortAnswered;
        }
        return 0;
      })
    );
    setLastClicked("answered");
  };

  // Search Term Input
  useEffect(() => {
    if (searchTerm !== undefined || "") {
      setFilteredSensei(
        autocompleteSensei?.filter((profile) =>
          profile?.profile.displayName
            ?.toLowerCase()
            .includes(searchTerm?.toLowerCase())
        )
      );
    }
  }, [searchTerm]);

  // Filter Menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Container
        className="main-container"
        sx={{
          width: { md: `calc(100% - 300px)` },
          mr: { md: `276px` },
          mt: "24px",
        }}
      >
        {loading ? (
          <Loader />
        ) : (
          <>
            <Box className="filter-btn">
              <Autocomplete
                className="sensei-autocomplete"
                disablePortal
                options={autocompleteSensei}
                getOptionLabel={(option) => option.profile.displayName}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Avatar
                      sx={{ mr: "8px" }}
                      alt={option.profile.handle}
                      src={option.profile.imageUrl}
                    />
                    {option.profile.displayName}
                  </Box>
                )}
                onInputChange={(event, input) => {
                  setSearchterm(input);
                }}
                sx={{ flexGrow: "1", minWidth: "200px", borderRadius: "15px" }}
                renderInput={(params) => {
                  const displayName = params?.inputProps?.value;
                  const sensei = filteredSensei?.find(
                    (sensei) => sensei?.profile.displayName === displayName
                  );
                  return (
                    <TextField
                      className="sensei-autocomplete-text"
                      {...params}
                      label={
                        <>
                          <Box className="sensei-autocomplete-input">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M17.6327 14.2518L16.0191 12.6361C15.6794 12.296 15.1698 12.296 14.8301 12.6361C14.4904 12.9763 14.4904 13.4865 14.8301 13.8266L16.4437 15.4423C16.6985 15.6974 16.6985 16.1225 16.4437 16.3776C16.1889 16.6327 15.7643 16.6327 15.5095 16.3776L12.9617 13.8266C13.1316 13.6565 13.3014 13.5715 13.4713 13.4014C14.7452 12.1259 15.5095 10.3402 15.5095 8.5545C15.5095 6.68375 14.8301 4.98307 13.4713 3.70756C10.7537 0.986476 6.42246 0.986476 3.70484 3.70756C0.98722 6.42865 0.98722 10.7654 3.70484 13.4865C4.97873 14.762 6.76217 15.5273 8.54561 15.5273C9.56472 15.5273 10.5838 15.2722 11.4331 14.847L14.2356 17.6531C14.6603 18.0783 15.3397 18.3334 15.9341 18.3334C16.5286 18.3334 17.1231 18.0783 17.6327 17.6531C18.5668 16.6327 18.5668 15.1021 17.6327 14.2518ZM4.8938 12.1259C2.85559 10.0851 2.85559 6.76879 4.8938 4.81301C5.91291 3.7926 7.1868 3.28239 8.54561 3.28239C9.90442 3.28239 11.1783 3.7926 12.1974 4.81301C13.2165 5.83341 13.7261 7.10892 13.7261 8.46947C13.7261 9.83001 13.2165 11.1906 12.1974 12.1259C11.1783 13.0613 9.90442 13.6565 8.54561 13.6565C7.1868 13.6565 5.82798 13.1463 4.8938 12.1259Z"
                                fill="#AAAAAA"
                              />
                            </svg>
                            Search sensei
                          </Box>
                        </>
                      }
                      onSelect={(e) => setSearchterm(e.target.value)}
                      value={searchTerm}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: sensei && (
                          <Avatar
                            className="autocomplete-avatar"
                            sx={{ mr: "5px" }}
                            alt={sensei?.profile.handle}
                            src={sensei?.profile.imageUrl}
                          />
                        ),
                      }}
                    />
                  );
                }}
              />
              <button
                // aria-controls={open ? "basic-menu" : undefined}
                // aria-haspopup="true"
                // aria-expanded={open ? "true" : undefined}
                className="sensei-filter"
                onClick={handleClick}
                // endIcon={<KeyboardArrowDownIcon />}
                // sx={{
                //   display: {
                //     xs: "inline-flex",
                //     sm: "inline-flex",
                //     md: "inline-flex",
                //   },
                //   minWidth: "190px",
                // }}
              >
                {filterName}
              </button>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem
                  selected={lastClicked === "joined" ? true : false}
                  onClick={sortByJoined}
                  sx={{
                    background: "#FDFDFD",
                    borderBottom: "1px solid #e8e8e8",
                  }}
                >
                  {sortJoined === -1 ? "Earliest" : "Latest"}
                </MenuItem>

                <MenuItem
                  selected={lastClicked === "alphabetical" ? true : false}
                  onClick={sortByAlphabetical}
                  sx={{
                    background: "#FDFDFD",
                    borderBottom: "1px solid #e8e8e8",
                  }}
                >
                  Alphabetical ({sortAlphabetical === -1 ? "A-Z" : "Z-A"})
                </MenuItem>

                <MenuItem
                  selected={lastClicked === "followers" ? true : false}
                  onClick={sortByFollowers}
                  sx={{
                    background: "#FDFDFD",
                    borderBottom: "1px solid #e8e8e8",
                  }}
                >
                  Followers ({sortFollowers === -1 ? "Low" : "High"})
                </MenuItem>

                <MenuItem
                  selected={lastClicked === "answered" ? true : false}
                  onClick={sortByAnswered}
                  sx={{
                    background: "#FDFDFD",
                    borderBottom: "1px solid #e8e8e8",
                  }}
                >
                  Answered ({sortAnswered === -1 ? "Low" : "High"})
                </MenuItem>
              </Menu>
            </Box>
            <Box
              className="content-container"
              sx={{ height: "calc(100vh - 104.5px)" }}
            >
              <Grid>
                {filteredSensei?.map((profile, index) => {
                  const isSameUser = profile.userId === userInfo.userUid;
                  return (
                    <Card
                      onClick={() => onSenseiClick(profile.profile.handle)}
                      className="sensei-card"
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: "0px",
                        backgroundColor: "#FDFDFD",
                        cursor: "pointer",
                        hover: { backgroundColor: "#f2f2f2" },
                      }}
                      key={index}
                    >
                      <QuestionHeader
                        twitterPfp={profile.profile.imageUrl}
                        twitterHandle={profile.profile.handle}
                        twitterDisplayName={profile.profile.displayName}
                        onAskQuestion={onAskQuestion}
                        senseiDisplayName={profile.profile.displayName}
                        askSensei={
                          profile &&
                          userInfo &&
                          profile?.profile?.displayName !==
                            userInfo?.profile?.displayName
                        }
                      />
                      <SenseiBody
                        followers={profile.profile.followers_count.toLocaleString()}
                        questionsAsked={profile?.questionsFor?.length}
                        twitterDescription={profile.profile.bio}
                      />
                    </Card>
                  );
                })}
              </Grid>
            </Box>
          </>
        )}

        <Backdrop className="ask-question-backdrop" open={openBackdrop}>
          <AskQuestion
            userInfo={userInfo}
            accessToken={accessToken}
            setAccessError={setAccessError}
            handleCloseBackdrop={handleCloseBackdrop}
            askedSensei={askedSensei}
          />
        </Backdrop>
      </Container>
    </>
  );
};

export default Sensei;
