import { useContext, useEffect } from "react";
import { getAuth, signInWithPopup, TwitterAuthProvider } from "firebase/auth";
import AppContext from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { newUserInfo } from "../store/store";
import { setAccessErrorFalse } from "../store/store";
// var provider = new firebase.auth.TwitterAuthProvider();

const provider = new TwitterAuthProvider();

export const useTwitterSignIn = () => {
  const { userInfo, setUserInfo } = useContext(AppContext);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signInTwitter = async (reload) => {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = TwitterAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const secret = credential.secret;

        const user = result.user;
        const bearer = user.accessToken;

        setUserInfo({ userUid: user.uid, accessToken: bearer });

        return addUser(bearer);
      })
      .then((response) => {
        setUserInfo((prevState) => ({
          ...prevState,
          ...response.data,
        }));
        dispatch(setAccessErrorFalse());
        !reload && navigate("/");
        reload && window.location.reload();
      })
      .catch((error) => {
        console.log(error);
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = TwitterAuthProvider.credentialFromError(error);
      });
  };

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

  // Set userInfo to redux store
  useEffect(() => {
    dispatch(newUserInfo(userInfo));
  }, [userInfo]);

  return { signInTwitter };
};
