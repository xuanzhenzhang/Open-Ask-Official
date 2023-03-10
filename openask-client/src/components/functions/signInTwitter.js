// import {
//   getAuth,
//   signInWithPopup,
//   signOut,
//   TwitterAuthProvider,
// } from "firebase/auth";
// import axios from "../../../node_modules/axios/index";
// import { useNavigate } from "../../../node_modules/react-router-dom/dist/index";

// const provider = new TwitterAuthProvider();
// const navigate = useNavigate();

// export const signInTwitter = async (reload) => {
//   const auth = getAuth();
//   signInWithPopup(auth, provider)
//     .then((result) => {
//       // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
//       // You can use these server side with your app's credentials to access the Twitter API.
//       const credential = TwitterAuthProvider.credentialFromResult(result);
//       const token = credential.accessToken;
//       const secret = credential.secret;

//       // The signed-in user info.
//       const user = result.user;
//       const bearer = user.accessToken;

//       setUserInfo({ userUid: user.uid, accessToken: bearer });

//       return addUser(bearer);
//     })
//     .then((response) => {
//       setUserInfo((prevState) => ({
//         ...prevState,
//         ...response.data,
//       }));
//       dispatch(setAccessErrorFalse());
//       navigate("/feed");
//       reload && window.location.reload();
//     })
//     .catch((error) => {
//       // Handle Errors here.
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       // The email of the user's account used.
//       const email = error.customData.email;
//       // The AuthCredential type that was used.
//       const credential = TwitterAuthProvider.credentialFromError(error);
//       // ...
//     });
// };

// // Add user to database function
// const addUser = async (accessToken) => {
//   try {
//     const user = await axios.post(
//       `https://us-central1-open-ask-dbbe2.cloudfunctions.net/api/login`,
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );
//     return user;
//   } catch (error) {
//     console.error(error);
//   }
// };
