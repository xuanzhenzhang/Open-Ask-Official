import { useEffect, useState, useContext } from "react";
import AppContext from "./components/context/AppContext";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

import { Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import { AppHeader } from "./components/AppHeader";
import Sensei from "./components/Sensei";
import Feed from "./components/Feed";
import Sidebar from "./components/Sidebar";
import Questions from "./components/Questions";
import SenseiDetails from "./components/SenseiDetails";
import TransactionHistory from "./components/TransactionHistory";
import QuestionId from "./components/QuestionId";
import { useNavigate } from "react-router-dom";
import reloadPage from "./components/functions/reloadPage";
import Testing from "./components/Testing";

import {
  getAuth,
  signInWithPopup,
  signOut,
  TwitterAuthProvider,
} from "firebase/auth";
import "./css/app.css";
import AnswerQuestion from "./components/AnswerQuestion";
import AccessErrorLogin from "./components/AccessErrorLogin";

import axios, * as others from "axios";
import { Avatar } from "@mui/material";

const provider = new TwitterAuthProvider();

// var provider = new firebase.auth.TwitterAuthProvider();

function App() {
  // const [loginUser, setLoginUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [accessError, setAccessError] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);

  const { userInfo, setUserInfo } = useContext(AppContext);
  const { accessToken } = userInfo;

  const signInTwitter = async (reload) => {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
        // You can use these server side with your app's credentials to access the Twitter API.
        const credential = TwitterAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const secret = credential.secret;

        // The signed-in user info.
        const user = result.user;
        const bearer = user.accessToken;

        setUserInfo({ userUid: user.uid, accessToken: bearer });

        return addUser(bearer);
      })
      .then((response) => {
        console.log(response.data);
        setUserInfo((prevState) => ({
          ...prevState,
          ...response.data,
        }));
        setAccessError(false);
        navigate("/feed");
        reload && reloadPage();
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = TwitterAuthProvider.credentialFromError(error);
        // ...
      });
  };

  // Open Sidebar
  const onAvatarClick = (e) => {
    setMobileOpen(!mobileOpen);
  };

  // Sign in as guest
  const navigate = useNavigate();

  const signInGuest = () => {
    navigate("/feed");
  };

  // Add user to database function
  const addUser = async (accessToken) => {
    try {
      const user = await axios.post(
        `https://us-central1-open-ask-dbbe2.cloudfunctions.net/api/login`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return user;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(userInfo);
  }, []);

  return (
    <>
      <Container>
        {userInfo.userUid && (
          <AccessErrorLogin
            signInTwitter={signInTwitter}
            accessError={accessError}
          />
        )}
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
        {window.location.pathname !== "/" && (
          <Sidebar
            userInfo={userInfo}
            accessToken={accessToken}
            setAccessError={setAccessError}
            onAvatarClick={onAvatarClick}
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
            signInTwitter={signInTwitter}
          />
        )}
        <Routes>
          <Route
            path="/"
            element={
              <LoginPage
                signInTwitter={signInTwitter}
                signInGuest={signInGuest}
              />
            }
          />
          <Route
            path="/feed"
            element={
              <Feed
                userInfo={userInfo}
                accessToken={accessToken}
                setAccessError={setAccessError}
              />
            }
          />
          {/* <Route
            path="/sensei/ask"
            element={
              <AskPage
                userInfo={userInfo}
                accessToken={accessToken}
                setAccessError={setAccessError}
              />
            }
          /> */}
          <Route
            exact
            path="/sensei"
            element={
              <Sensei
                userInfo={userInfo}
                accessToken={accessToken}
                setAccessError={setAccessError}
              />
            }
          />
          <Route
            path="/questions"
            element={
              <Questions
                userInfo={userInfo}
                accessToken={accessToken}
                setAccessError={setAccessError}
              />
            }
          />
          <Route
            path="/sensei/:twitter"
            element={
              <SenseiDetails
                userInfo={userInfo}
                accessToken={accessToken}
                setAccessError={setAccessError}
              />
            }
          />
          <Route path="/transaction_history" element={<TransactionHistory />} />
          <Route
            path="/id/:id"
            element={
              <QuestionId
                accessToken={accessToken}
                setAccessError={setAccessError}
              />
            }
          />
          {/* <Route path="/testing" element={<Testing />} /> */}
        </Routes>
      </Container>
    </>
  );
}

export default App;
