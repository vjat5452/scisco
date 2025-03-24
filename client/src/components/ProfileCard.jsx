import {
    Box,
    Avatar,
    List,
    ListItem,
    ListItemText,
    Typography,
    Link,
} from "@mui/material";

const ProfileCard = ({ userData }) => {
    return (
        <Box
            m="5px"
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Avatar
                src="./hello.png"
                sx={{
                    width: "123px",
                    height: "123px",
                }}
            ></Avatar>

            <List>
                <ListItem>
                    <ListItemText
                        primary={
                            userData?.first_name + " " + userData?.last_name
                        }
                        primaryTypographyProps={{
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                        }}
                        secondary={userData?.user_name}
                        secondaryTypographyProps={{
                            fontSize: "1rem",
                            fontWeight: "semibold",
                        }}
                    />
                </ListItem>
                {userData && userData.bio != "" ? (
                    <ListItem>
                        <Typography variant="p">{userData?.bio}</Typography>
                    </ListItem>
                ) : null}
            </List>
        </Box>
    );
};

export default ProfileCard;
