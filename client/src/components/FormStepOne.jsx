import { Box, Grid, TextField, Button } from "@mui/material";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";

const FormStepOne = ({ handleNext }) => {
    let { registerUser } = useContext(AuthContext);

    return (
        <Box
            component="form"
            onSubmit={(event) => registerUser(event, handleNext)}
            sx={{ mt: 3 }}
        >
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="firstName"
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        autoFocus
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="email"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        id="Email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        name="bio"
                        label="Bio"
                        type="bio"
                        id="bio"
                        autoComplete="bio"
                        placeholder="Bio (in max 200 characters)"
                        multiline
                        rows={4}
                        inputProps={{ maxLength: 200 }}
                    />
                </Grid>
            </Grid>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, fontSize: "16px" }}
            >
                Sign Up
            </Button>
        </Box>
    );
};

export default FormStepOne;
