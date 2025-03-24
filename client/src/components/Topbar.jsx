import {
    Box,
    IconButton,
    useTheme,
    InputBase,
    Button,
    Typography,
} from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, colorTokens } from "../theme";
import AuthContext from "../context/AuthContext";

import {
    LightModeOutlined,
    DarkModeOutlined,
    NotificationsOutlined,
    SettingsOutlined,
    PersonOutlined,
    Search,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

const Topbar = () => {
    const theme = useTheme();
    const colors = colorTokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    const navigate = useNavigate();

    let { user, logoutUser } = useContext(AuthContext);

    return (
        <Box display="flex" justifyContent="space-between" p={2}>
            {/* Search bar */}
            <Box display="flex" borderRadius="3px">
                <Typography
                    component="h2"
                    sx={{ fontSize: "24px", fontWeight: 600 }}
                >
                    Scisco
                </Typography>
            </Box>

            {/* Icons  */}
            <Box display="flex">
                {user ? (
                    <Button
                        variant="contained"
                        sx={{ fontSize: "13px" }}
                        onClick={logoutUser}
                    >
                        Logout
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        sx={{ fontSize: "13px" }}
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default Topbar;
