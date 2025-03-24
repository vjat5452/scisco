import { Box, Grid, TextField, Button } from "@mui/material";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const FormStepTwo = ({ handleNext }) => {
    let { user } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        let response = await fetch(
            `${import.meta.env.VITE_SERVER_ENDPOINT}users/profiles/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + user?.authTokens?.access,
                },
                body: JSON.stringify({
                    codeforces: formData.get("codeforces"),
                    codechef: formData.get("codechef"),
                    leetcode: formData.get("leetcode"),
                }),
            }
        );

        const data = await response.json();

        console.log(data);

        if (response.status === 201) {
            navigate("/dashboard");
        } else if (response.status === 401) {
            alert("You are not authorized to perform this action");
            navigate("/login");
        } else {
            alert("Something went wrong");
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        id="codeforces"
                        label="Codeforces"
                        name="codeforces"
                        autoComplete="codeforces"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        id="codechef"
                        label="Codechef"
                        name="codechef"
                        autoComplete="codechef"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        id="leetcode"
                        label="Leetcode"
                        name="leetcode"
                        autoComplete="leetcode"
                    />
                </Grid>
            </Grid>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, fontSize: "16px" }}
            >
                Add Profiles
            </Button>
        </Box>
    );
};

export default FormStepTwo;
