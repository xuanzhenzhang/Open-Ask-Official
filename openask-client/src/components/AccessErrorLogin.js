import React from "react";
import {
  Backdrop,
  Card,
  CardContent,
  Button,
  Typography,
  Box,
} from "@mui/material";
import TwitterButton from "./subcomponents/buttons/TwitterButton";

const AccessErrorLogin = ({ signInTwitter, accessError }) => {
  return (
    <>
      <Backdrop sx={{ zIndex: "5000" }} open={accessError}>
        <Card className="access-error-container">
          <CardContent>
            <Box className="access-error-logo">
              <svg
                width="130"
                height="52"
                viewBox="0 0 200 52"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M26.1044 24.0501C26.1044 16.7349 20.2923 11.2735 13.0271 11.2735C5.81211 11.2735 0 16.7349 0 24.0501C0 31.3653 5.81211 36.7766 13.0271 36.7766C20.2923 36.7766 26.1044 31.3653 26.1044 24.0501ZM7.41545 24.0501C7.41545 20.0919 9.97077 17.3862 13.0271 17.3862C16.1336 17.3862 18.6889 20.0919 18.6889 24.0501C18.6889 27.9582 16.1336 30.6639 13.0271 30.6639C9.97077 30.6639 7.41545 27.9582 7.41545 24.0501Z"
                  fill="#111111"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M42.3575 36.7766C49.6227 36.7766 54.4828 31.3653 54.4828 24.0501C54.4828 16.7349 49.1216 11.2735 41.8565 11.2735C39.702 11.2735 37.798 12.1253 36.7458 13.3779V11.6242H29.3304V52H36.7458V34.7223C37.8982 35.8747 40.8544 36.7766 42.3575 36.7766ZM41.3554 16.8852C44.4619 16.8852 47.0172 20.0919 47.0172 24.0501C47.0172 27.9582 44.4619 31.1649 41.3554 31.1649C39.4014 31.1649 37.6477 29.8121 36.5955 27.7578C36.0945 26.7056 35.7938 25.453 35.7938 24.0501C35.7938 22.6973 36.1446 21.2944 36.5955 20.2923C37.5976 18.2881 39.4515 16.8852 41.3554 16.8852Z"
                  fill="#111111"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M69.9844 30.6639C67.5292 30.6639 64.5731 28.6096 64.5731 25.7036H82.2098V24.0501C82.2098 16.6347 77.3497 11.2735 69.5334 11.2735C61.7171 11.2735 56.9071 16.7349 56.9071 24.0501C56.9071 31.3653 61.8674 36.7766 69.9844 36.7766C75.6461 36.7766 78.7025 34.8727 80.7067 32.167L75.7464 27.6075C74.594 29.7119 72.3894 30.6639 69.9844 30.6639ZM69.5334 17.3862C72.3393 17.3862 74.0428 18.6388 74.4436 20.9937H64.7234C65.1743 18.8392 66.8278 17.3862 69.5334 17.3862Z"
                  fill="#111111"
                />
                <path
                  d="M96.8596 16.8351C99.7657 16.8351 100.768 18.4885 100.768 22.2463V36.3758H108.183V22.2463C108.183 14.6305 105.728 11.2735 98.7636 11.2735C96.6091 11.2735 94.0037 12.1253 92.0997 13.9791V11.6242H84.6843V36.3758H92.0997V22.2463C92.0997 18.4885 93.8534 16.8351 96.8596 16.8351Z"
                  fill="#111111"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M112.211 15.7829L117.722 18.9395C118.825 17.737 119.877 17.3361 122.031 17.3361C124.136 17.3361 125.539 18.5386 125.539 20.3925H121.681C114.866 20.3925 110.658 23.8998 110.658 29.1107C110.658 33.7203 113.263 36.7265 120.027 36.7265C122.332 36.7265 124.386 35.8246 125.539 34.6221V36.3758H132.954V19.0898C132.954 15.2818 129.948 11.2234 122.532 11.2234C118.674 11.2234 114.967 12.6764 112.211 15.7829ZM118.073 29.261C117.772 27.357 119.225 26.0042 121.18 26.0042H125.539V28.2088C125.539 29.3111 124.436 31.1649 121.18 31.1649C119.476 31.1649 118.274 30.6138 118.073 29.261Z"
                  fill="#111111"
                />
                <path
                  d="M147.661 21.6711C145.412 21.0598 143.596 20.5662 143.596 19.4405C143.596 17.8372 145.199 17.5365 146.001 17.5365C147.554 17.5365 149.808 18.8894 151.111 20.5929L155.921 15.7829C153.065 12.8768 149.508 11.2735 146.001 11.2735C142.944 11.2735 136.831 13.2777 136.831 19.1399C136.831 24.0501 141.441 25.7036 145.399 26.9061C145.606 26.9652 145.907 27.0166 146.251 27.0755C147.655 27.316 149.79 27.6816 149.307 29.2109C149.057 29.9624 147.654 30.6639 146.001 30.5136C144.347 30.3633 142.343 29.0605 140.94 27.357L136.08 32.2171C138.886 35.023 142.443 36.7766 146.001 36.7766C151.612 36.7766 156.122 33.9207 156.122 28.81C156.122 23.9702 151.319 22.6651 147.661 21.6711Z"
                  fill="#111111"
                />
                <path
                  d="M167.615 26.2046L175.632 36.3758H184.951C182.812 33.7176 180.189 30.5005 177.638 27.3721C177.332 26.9968 177.027 26.6227 176.724 26.251C175.411 24.6404 174.136 23.0748 172.976 21.6451L184.951 11.6242L176.724 8.77801L166.763 17.8372V0H159.298V36.3758H166.763V26.9061C166.873 26.8142 166.99 26.7223 167.104 26.633"
                  fill="#111111"
                />
                <path
                  d="M167.615 26.2046C167.488 26.3315 167.301 26.4786 167.104 26.633Z"
                  fill="#111111"
                />
                <circle cx="194.542" cy="31.6797" r="5" fill="#111111" />
                <rect
                  x="111"
                  y="44"
                  width="88.5424"
                  height="8"
                  fill="url(#paint0_linear_5_107)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_5_107"
                    x1="112.466"
                    y1="44.5957"
                    x2="125.716"
                    y2="79.7613"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#62C6FF" />
                    <stop offset="1" stopColor="#207CE8" />
                    <stop offset="1" stopColor="#2271CE" />
                  </linearGradient>
                </defs>
              </svg>
            </Box>
          </CardContent>
          <CardContent>
            <Typography className="access-error-text">
              You have been signed out. <br />
              Please sign in again to continue.
            </Typography>
          </CardContent>
          <CardContent>
            <Box className="access-error-btn">
              <TwitterButton signInTwitter={signInTwitter} />
            </Box>
          </CardContent>
        </Card>
      </Backdrop>
    </>
  );
};

export default AccessErrorLogin;
