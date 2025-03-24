import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Copyright = (props) => {
    return (
        <Typography variant="body2" align="center" {...props}>
            {"Copyright © "}
            <Link to="/">
                <Typography
                    sx={{
                        textDecoration: "underline",
                        color: "black",
                    }}
                    color="text.secondary"
                    component="span"
                    variant="body2"
                >
                    Scisco
                </Typography>
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
};

export default Copyright;
