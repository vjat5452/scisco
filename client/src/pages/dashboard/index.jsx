import Topbar from "../../components/Topbar";

import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";

import { Box, Grid, Paper, Typography, Link } from "@mui/material";
import ProfileCard from "../../components/ProfileCard";
import Submissions from "../../components/Submissions";

import CodeforcesLogo from "../../assets/codeforces.svg";
import CodechefLogo from "../../assets/codechef.svg";
import LeetcodeLogo from "../../assets/leetcode.svg";

const Dashboard = () => {
    let { user } = useContext(AuthContext);
    let [codeforcesData, setCodeforcesData] = useState(null);
    let [codechefData, setCodechefData] = useState(null);
    let [leetcodeData, setLeetcodeData] = useState(null);

    let [userData, setUserData] = useState(null);
    let [profiles, setProfiles] = useState(null);

    useEffect(() => {
        getUserData();
    }, []);

    useEffect(() => {
        if (profiles) {
            getCodeforcesData();
            getCodechefData();
            getLeetcodeData();
        }
    }, [profiles]);

    let getUserData = async () => {
        let response = await fetch(
            `${import.meta.env.VITE_SERVER_ENDPOINT}users?user_name=${
                user.user_name
            }`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        let data = await response.json();

        if (response.status === 200) {
            // console.log(data);
            setProfiles(data.profiles);
            setUserData(data.user);
        } else if (response.statusText == "Unauthorized") {
            logoutUser();
        }
    };

    let getCodeforcesData = async () => {
        let response = await fetch(
            `${import.meta.env.VITE_SERVER_ENDPOINT}api/codeforces/${
                profiles.codeforces
            }`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const data = await response.json();

        if (response.status === 200) {
            if (data.status === 200) {
                setCodeforcesData(data);
            } else {
                alert("User not found");
            }
        } else {
            alert("Something went wrong");
        }
    };

    let getCodechefData = async () => {
        let response = await fetch(
            `${import.meta.env.VITE_SERVER_ENDPOINT}api/codechef/${
                profiles.codechef
            }`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const data = await response.json();

        if (response.status === 200) {
            setCodechefData(data);
            // console.log(data.submissions);
        } else {
            alert("Something went wrong");
        }
    };

    let getLeetcodeData = async () => {
        let response = await fetch(
            `${import.meta.env.VITE_SERVER_ENDPOINT}api/leetcode/${
                profiles.leetcode
            }`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const data = await response.json();

        if (response.status === 200) {
            setLeetcodeData(data);
        } else {
            alert("Something went wrong");
        }
    };

    return (
        <>
            <main className="content">
                <Topbar />
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    m="20px"
                >
                    <Grid container rowSpacing={1} width="90vw" mb="5vh">
                        <Grid
                            item
                            xs={12}
                            md={12}
                            padding={1}
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <Paper
                                elevation={2}
                                sx={{
                                    padding: "15px",
                                    width: "100%",
                                }}
                            >
                                <ProfileCard userData={userData} />
                            </Paper>
                        </Grid>

                        {codeforcesData &&
                        profiles &&
                        profiles.codeforces != "" ? (
                            <Grid item xs={12} md={4} padding={1}>
                                <Paper
                                    elevation={2}
                                    sx={{
                                        padding: "15px",
                                        position: "relative",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "start",
                                        gap: "6px",
                                        fontSize: "1rem",
                                        backgroundColor: "#F3F4F6",
                                        color: "#4B5563",
                                        borderRadius: "0.375rem",
                                        overflow: "hidden",
                                        transition: "all",
                                    }}
                                >
                                    <img
                                        src={CodeforcesLogo}
                                        alt="CodeforcesLogo"
                                        style={{
                                            position: "absolute",
                                            bottom: "0",
                                            right: "0",
                                            width: "5em",
                                            height: "5rem",
                                            opacity: "0.1",
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <img
                                            src={CodeforcesLogo}
                                            width="20px"
                                            height="20px"
                                        ></img>
                                        <Link
                                            underline="hover"
                                            href={
                                                "https://codeforces.com/profile/" +
                                                profiles?.codeforces
                                            }
                                            target="_blank"
                                            sx={{
                                                fontSize: "16px",
                                                marginLeft: "8px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            {profiles?.codeforces}
                                        </Link>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: "16px",
                                            }}
                                        >
                                            Rating: {codeforcesData?.rating}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: "16px",
                                            }}
                                        >
                                            Highest Rating:{" "}
                                            {codeforcesData?.maxRating}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: "16px",
                                                textTransform: "capitalize",
                                            }}
                                        >
                                            Rank: {codeforcesData?.rank}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: "16px",
                                                textTransform: "capitalize",
                                            }}
                                        >
                                            MaxRank: {codeforcesData?.maxRank}
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                        ) : null}

                        {codechefData &&
                        profiles &&
                        profiles.codeforces != "" ? (
                            <Grid item xs={12} md={4} padding={1}>
                                <Paper
                                    elevation={2}
                                    sx={{
                                        padding: "15px",
                                        position: "relative",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "start",
                                        gap: "6px",
                                        fontSize: "1rem",
                                        backgroundColor: "#F3F4F6",
                                        color: "#4B5563",
                                        borderRadius: "0.375rem",
                                        overflow: "hidden",
                                        transition: "all",
                                    }}
                                >
                                    <img
                                        src={CodechefLogo}
                                        alt="CodechefLogo"
                                        style={{
                                            position: "absolute",
                                            bottom: "0",
                                            right: "0",
                                            width: "5em",
                                            height: "5rem",
                                            opacity: "0.1",
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <img
                                            src={CodechefLogo}
                                            width="20px"
                                            height="20px"
                                        ></img>
                                        <Link
                                            underline="hover"
                                            href={
                                                "https://www.codechef.com/users/" +
                                                profiles?.codechef
                                            }
                                            target="_blank"
                                            sx={{
                                                fontSize: "16px",
                                                marginLeft: "8px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            {profiles?.codechef}
                                        </Link>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: "16px",
                                            }}
                                        >
                                            Rating: {codechefData?.Rating}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: "16px",
                                            }}
                                        >
                                            Highest Rating:{" "}
                                            {codechefData["Highest Rating"]}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: "16px",
                                            }}
                                        >
                                            Global Rank:{" "}
                                            {codechefData["Global Rank"]}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: "16px",
                                            }}
                                        >
                                            Country Rank:{" "}
                                            {codechefData["Country Rank"]}
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                        ) : null}

                        {leetcodeData && profiles && profiles.leetcode != "" ? (
                            <Grid item xs={12} md={4} padding={1}>
                                <Paper
                                    elevation={2}
                                    sx={{
                                        padding: "15px",
                                        position: "relative",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "start",
                                        gap: "6px",
                                        fontSize: "1rem",
                                        backgroundColor: "#F3F4F6",
                                        color: "#4B5563",
                                        borderRadius: "0.375rem",
                                        overflow: "hidden",
                                        transition: "all",
                                    }}
                                >
                                    <img
                                        src={LeetcodeLogo}
                                        alt="LeetcodeLogo"
                                        style={{
                                            position: "absolute",
                                            bottom: "0",
                                            right: "0",
                                            width: "5em",
                                            height: "5rem",
                                            opacity: "0.1",
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <img
                                            src={LeetcodeLogo}
                                            width="20px"
                                            height="20px"
                                        ></img>
                                        <Link
                                            underline="hover"
                                            href={
                                                "https://leetcode.com/" +
                                                profiles?.leetcode
                                            }
                                            target="_blank"
                                            sx={{
                                                fontSize: "16px",
                                                marginLeft: "8px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            {profiles?.leetcode}
                                        </Link>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: "16px",
                                            }}
                                        >
                                            Ranking: {leetcodeData?.Ranking}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: "16px",
                                            }}
                                        >
                                            Accepted Submissions:{" "}
                                            {
                                                leetcodeData[
                                                    "Accepted Submissions"
                                                ]
                                            }
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: "16px",
                                            }}
                                        >
                                            Total Submissions:{" "}
                                            {leetcodeData["Total Submissions"]}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                fontSize: "16px",
                                            }}
                                        >
                                            Accuracy: {leetcodeData?.Accuracy} %
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                        ) : null}

                        <Grid item xs={12} md={12} padding={1} mt={2}>
                            <Typography
                                variant="h2"
                                mb="10px"
                                sx={{
                                    fontWeight: "600",
                                    fontSize: 20,
                                    textAlign: "center",
                                }}
                            >
                                Recent Submissions
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6} padding={1}>
                            {codeforcesData ? (
                                <Box>
                                    <Typography
                                        variant="h3"
                                        mb="10px"
                                        sx={{
                                            fontWeight: "600",
                                            fontSize: 16,
                                            textAlign: "center",
                                        }}
                                    >
                                        Codeforces Submissions
                                    </Typography>
                                    <Submissions
                                        submissions={
                                            codeforcesData?.submissions
                                        }
                                    />
                                </Box>
                            ) : null}
                        </Grid>
                        <Grid item xs={12} md={6} padding={1}>
                            {codechefData ? (
                                <Box>
                                    <Typography
                                        variant="h3"
                                        mb="10px"
                                        sx={{
                                            fontWeight: "600",
                                            fontSize: 16,
                                            textAlign: "center",
                                        }}
                                    >
                                        Codechef Submissions
                                    </Typography>
                                    <Submissions
                                        submissions={codechefData?.submissions}
                                    />
                                </Box>
                            ) : null}
                        </Grid>
                    </Grid>
                </Box>
            </main>
        </>
    );
};

export default Dashboard;
