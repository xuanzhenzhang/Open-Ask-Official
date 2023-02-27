import AdapterDateFns from "@mui/lab/AdapterDateFns";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import { AppHeader } from "./AppHeader";
import TopBar from "./TopBar";

import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import DateRangePicker from "@mui/lab/DateRangePicker";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { Formik, Form, Field } from "formik";
import { addDays, format, parse } from "date-fns";
import querystring from "query-string";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Skeleton from "@mui/material/Skeleton";
import { WalletCard } from "./WalletCard";

// const BASE_URL = "https://travel-mini-app.web.app";

// const SkeletonCard = () => (
//   <Card>
//     <CardContent>
//       <Skeleton variant='rectangular' height={118} />
//       <Skeleton />
//       <Skeleton width='60%' />
//     </CardContent>
//   </Card>
// );

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

const HomePage = (props) => {
  const { loginUser } = props;
  const loginUserData = loginUser.providerData[0];

  const navigate = useNavigate();

  const onAskQuestion = () => {
    navigate("/sensei/ask");
  };

  const profiles = [
    {
      name: "Saul Goodman",
      image:
        "https://www.careeraddict.com/uploads/article/60648/choosing-career-types-of-lawyers.jpg",
      description: "Call me for breaking bad quotes",
    },
    {
      name: "Travis Howard",
      image:
        "https://familydoctor.org/wp-content/uploads/2018/02/41808433_l.jpg",
      description: "Brought the dead back alive",
    },
    {
      name: "Lizz Frederick",
      image:
        "https://www.todaynftnews.com/wp-content/uploads/2022/08/Azuki-an-anime-styled-NFT-collection-that-surpassed-giants-like-BAYC-CryptoPunks.jpg",
      description: "NFT founder. Hodl.",
    },
  ];

  return (
    <>
      <Container>
        <TopBar />
        <Stack direction="column" spacing={2} justifyContent="center">
          {profiles.map((profile) => (
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                sx={{ height: 140 }}
                image={profile.image}
                title={profile.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {profile.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {profile.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={onAskQuestion}>
                  Ask
                </Button>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          ))}
        </Stack>
      </Container>
    </>
  );
};
export { HomePage };
