import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { useContext, useEffect, useState } from "react";
import { Stepper, useTheme, Step, StepLabel } from "@mui/material";
import { colorTokens } from "../theme";
import FormStepOne from "./FormStepOne";
import FormStepTwo from "./FormStepTwo";
import Copyright from "./Copyright";
import { Link } from "react-router-dom";

const handleSteps = (step, handleNext) => {
    switch (step) {
        case 0:
            return <FormStepOne handleNext={handleNext} />;
        case 1:
            return <FormStepTwo />;
        default:
            throw new Error("Unknown step");
    }
};

const RegisterPage = () => {
    const [activeStep, setActiveStep] = useState(0);

    const theme = useTheme();
    const colors = colorTokens(theme.palette.mode);

    function handleNext() {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }

    return (
        <Box
            sx={{
                backgroundColor: "#ffffff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100vw",
            }}
        >
            <Box
                sx={{
                    marginTop: 8,
                    width: "50vw",
                    minWidth: "300px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>

                <Stepper
                    activeStep={activeStep}
                    sx={{ width: "100%", mt: 3 }}
                    alternativeLabel
                >
                    <Step>
                        <StepLabel>Basic Details</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Coding Profiles</StepLabel>
                    </Step>
                </Stepper>

                {handleSteps(activeStep, handleNext)}
            </Box>
            <Grid container justifyContent="center">
                <Grid item>
                    <Link to="/login">
                        <Typography
                            sx={{ textDecoration: "underline", color: "black" }}
                            component="span"
                            variant="body2"
                        >
                            Already have an account? Sign in
                        </Typography>
                    </Link>
                </Grid>
            </Grid>
            <Copyright sx={{ mt: 5 }} />
        </Box>
    );
};

export default RegisterPage;
