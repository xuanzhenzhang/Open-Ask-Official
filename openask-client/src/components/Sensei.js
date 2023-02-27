import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import {
  CardHeader,
  Autocomplete,
  TextField,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { getUsers } from "./functions/getUsers";
import Loader from "./Loader";
import { display } from "@mui/system";
import QuestionHeader from "./subcomponents/QuestionHeader";
import SenseiBody from "./subcomponents/SenseiBody";

const Sensei = ({ userInfo }) => {
  const [loading, setLoading] = useState(false);
  const [filteredSensei, setFilteredSensei] = useState();
  const [autocompleteSensei, setAutocompleteSensei] = useState([]);

  const [lastClicked, setLastClicked] = useState("Latest");
  const [searchTerm, setSearchterm] = useState();

  const [sortAlphabetical, setSortAlphabetical] = useState(1);
  const [sortFollowers, setSortFollowers] = useState(-1);
  const [sortJoined, setSortJoined] = useState(-1);
  const [sortAnswered, setSortAnswered] = useState(-1);

  const navigate = useNavigate();

  // Get all users
  useEffect(() => {
    setLoading(true);
    getUsers().then((response) => {
      setFilteredSensei(response);
      setAutocompleteSensei(response);
      setLoading(false);
    });
  }, []);

  // Navigate to question ask page
  const onAskQuestion = (displayName) => {
    navigate("/sensei/ask", {
      state: {
        displayName: displayName,
      },
    });
  };

  // Navigate to sensei details page
  const onLearnMore = (twitter) => {
    navigate(`/sensei/${twitter}`);
  };

  // Sorting Features
  // Sort sensei latest
  const sortByLatest = () => {
    setFilteredSensei(
      [...filteredSensei].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      })
    );
    setLastClicked("Latest");
  };

  // Sort sensei earliest
  const sortByEarliest = () => {
    setFilteredSensei(
      [...filteredSensei].sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt);
      })
    );
    setLastClicked("Earliest");
  };
  // Sort senseis alphabetically a-z
  const sortByAlphabeticalAZ = () => {
    setFilteredSensei(
      [...filteredSensei].sort((a, b) => {
        return a.twitterDisplayName
          .toLowerCase()
          .localeCompare(b.twitterDisplayName.toLowerCase());
      })
    );
    setLastClicked("Alphabetical (A-Z)");
  };
  // Sort senseis alphabetically z-a
  const sortByAlphabeticalZA = () => {
    setFilteredSensei(
      [...filteredSensei].sort((a, b) => {
        return b.twitterDisplayName
          .toLowerCase()
          .localeCompare(a.twitterDisplayName.toLowerCase());
      })
    );
    setLastClicked("Alphabetical (Z-A)");
  };

  // Sort senseis by twitter followers high
  const sortByFollowersHigh = () => {
    setFilteredSensei(
      [...filteredSensei].sort((a, b) => {
        return (
          b.publicMetrics.followers_count - a.publicMetrics.followers_count
        );
      })
    );
    setLastClicked("Followers (High)");
  };

  // Sort senseis by twitter followers low
  const sortByFollowersLow = () => {
    setFilteredSensei(
      [...filteredSensei].sort((a, b) => {
        return (
          a.publicMetrics.followers_count - b.publicMetrics.followers_count
        );
      })
    );
    setLastClicked("Followers (Low)");
  };
  // Sort senseis by questions answered high
  const sortByAnsweredHigh = () => {
    setFilteredSensei(
      [...filteredSensei].sort((a, b) => {
        return b.questionsFor.length - a.questionsFor.length;
      })
    );
    setLastClicked("Answered (High)");
  };
  // Sort senseis by questions answered low
  const sortByAnsweredLow = () => {
    setFilteredSensei(
      [...filteredSensei].sort((a, b) => {
        return a.questionsFor.length - b.questionsFor.length;
      })
    );
    setLastClicked("Answered (Low)");
  };

  // Search Term Input
  useEffect(() => {
    if (searchTerm !== undefined || "") {
      setFilteredSensei(
        autocompleteSensei?.filter((profile) =>
          profile?.twitterDisplayName
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
                getOptionLabel={(option) => option.twitterDisplayName}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Avatar
                      sx={{ mr: "8px" }}
                      alt={option.twitterHandle}
                      src={option.twitterPFPUrl}
                    />
                    {option.twitterDisplayName}
                  </Box>
                )}
                onInputChange={(event, input) => {
                  setSearchterm(input);
                }}
                sx={{ flexGrow: "1", minWidth: "200px", borderRadius: "15px" }}
                renderInput={(params) => {
                  const displayName = params?.inputProps?.value;
                  const sensei = filteredSensei?.find(
                    (profile) => profile?.twitterDisplayName === displayName
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
                            alt={sensei?.twitterHandle}
                            src={sensei?.twitterPFPUrl}
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
                {lastClicked}
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
                  selected={lastClicked === "Latest" ? true : false}
                  onClick={sortByLatest}
                  sx={{
                    background: "#FDFDFD",
                    borderBottom: "1px solid #e8e8e8",
                  }}
                >
                  Latest
                </MenuItem>
                <MenuItem
                  selected={lastClicked === "Earliest" ? true : false}
                  onClick={sortByEarliest}
                  sx={{
                    background: "#FDFDFD",
                    borderBottom: "1px solid #e8e8e8",
                  }}
                >
                  Earliest
                </MenuItem>
                <MenuItem
                  selected={lastClicked === "Alphabetical (A-Z)" ? true : false}
                  onClick={sortByAlphabeticalAZ}
                  sx={{
                    background: "#FDFDFD",
                    borderBottom: "1px solid #e8e8e8",
                  }}
                >
                  Alphabetical (A-Z)
                </MenuItem>
                <MenuItem
                  selected={lastClicked === "Alphabetical (Z-A)" ? true : false}
                  onClick={sortByAlphabeticalZA}
                  sx={{
                    background: "#FDFDFD",
                    borderBottom: "1px solid #e8e8e8",
                  }}
                >
                  Alphabetical (Z-A)
                </MenuItem>
                <MenuItem
                  selected={lastClicked === "Followers (High)" ? true : false}
                  onClick={sortByFollowersHigh}
                  sx={{
                    background: "#FDFDFD",
                    borderBottom: "1px solid #e8e8e8",
                  }}
                >
                  Followers (High)
                </MenuItem>
                <MenuItem
                  selected={lastClicked === "Followers (Low)" ? true : false}
                  onClick={sortByFollowersLow}
                  sx={{
                    background: "#FDFDFD",
                    borderBottom: "1px solid #e8e8e8",
                  }}
                >
                  Followers (Low)
                </MenuItem>
                <MenuItem
                  selected={lastClicked === "Answered (High)" ? true : false}
                  onClick={sortByAnsweredHigh}
                  sx={{
                    background: "#FDFDFD",
                    borderBottom: "1px solid #e8e8e8",
                  }}
                >
                  Answered (High)
                </MenuItem>
                <MenuItem
                  selected={lastClicked === "Answered (Low)" ? true : false}
                  onClick={sortByAnsweredLow}
                  sx={{
                    background: "#FDFDFD",
                    borderBottom: "1px solid #e8e8e8",
                  }}
                >
                  Answered (Low)
                </MenuItem>
              </Menu>
            </Box>
            <Box
              className="content-container"
              sx={{ height: "calc(100vh - 104.5px)" }}
            >
              <Grid>
                {filteredSensei?.map((profile, index) => (
                  <Grid
                    item
                    key={index}
                    // sx={{
                    //   boxshadow: "0px 2px 1px -1px rgb(100 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
                    // }}
                  >
                    <Card
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
                        twitterPfp={profile.twitterPFPUrl}
                        twitterHandle={profile.twitterHandle}
                        twitterDisplayName={profile.twitterDisplayName}
                        askSensei
                      />
                      <SenseiBody
                        followers={profile.publicMetrics.followers_count.toLocaleString()}
                        questionsAsked={profile?.questionsFor?.length}
                        twitterDescription={profile.twitterDescription}
                      />
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </>
        )}
      </Container>
    </>
  );
};

export default Sensei;
