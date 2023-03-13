import React, { useState, useEffect } from "react";
import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import axios from "axios";
import { endpoint } from "../data/endpoint";

const FeedFilters = ({ questions, setQuestions }) => {
  const [lastClicked, setLastClicked] = useState("joined");

  const [questionsByPriceHigh, setQuestionsByPriceHigh] = useState();
  const [questionsByPriceLow, setQuestionsByPriceLow] = useState();

  const [filterName, setFilterName] = useState("Latest");
  const [sortJoined, setSortJoined] = useState(1);
  const [sortPrice, setSortPrice] = useState(1);

  //   Questions by Price
  useEffect(() => {
    let isMounted = true;
    const questionByPrice = async () => {
      try {
        const { data } = await axios
          .get(`${endpoint}/questions-by-price`)
          .catch((error) => {
            console.log(error);
          });

        const priceHigh = data?.filter((question) => {
          return question.answerId;
        });
        const priceLow = data
          ?.filter((question) => {
            return question.answerId;
          })
          .reverse();

        if (isMounted) {
          setQuestionsByPriceHigh(priceHigh);
          setQuestionsByPriceLow(priceLow);
        }
      } catch (error) {
        console.log(error);
      }
    };
    questionByPrice();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter Menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //   Sort by Joined
  const sortByJoined = () => {
    const newSortJoined = sortJoined === 1 ? -1 : 1;
    setSortJoined(newSortJoined);

    setQuestions(
      [...questions].sort((a, b) => {
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

  //   Sort by Price
  const sortByPrice = () => {
    const newSortPrice = sortPrice === 1 ? -1 : 1;
    setSortPrice(newSortPrice);

    if (sortPrice === 1) {
      setQuestions(questionsByPriceHigh);
      setFilterName("Price (High)");
    } else if (sortPrice === -1) {
      setQuestions(questionsByPriceLow);
      setFilterName("Price (Low)");
    }

    setLastClicked("price");
  };

  return (
    <Box className="feed-filter">
      <Typography>Feed</Typography>
      <Button
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        // endIcon={<KeyboardArrowDownIcon />}
        sx={{
          display: {
            xs: "inline-flex",
          },
        }}
      >
        {filterName}
      </Button>

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
        >
          {sortJoined === -1 ? "Earliest" : "Latest"}
        </MenuItem>

        <MenuItem
          selected={lastClicked === "price" ? true : false}
          onClick={sortByPrice}
        >
          Price ({sortPrice === -1 ? "Highest" : "Lowest"})
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default FeedFilters;
