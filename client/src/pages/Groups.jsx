import React, { memo, useState } from "react";
import { Box, IconButton, Grid, Tooltip, Drawer, Stack, Typography } from "@mui/material";
import { Group, KeyboardBackspace as KeyboardBackspaceIcon, Menu as MenuIcon } from "@mui/icons-material";
import { matBlack } from "../constants/color";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "../components/styles/StyledComponents";
import AvatarCard from "../components/shared/AvatarCard";
import { sampleChats } from "../constants/sampleData";

const Groups = () => {
  const chatId = useSearchParams()[0].get("group");
  console.log(chatId);

  const [mobileMenu, setMobileMenu] = useState(false);
  const navigate = useNavigate();
  const navigateBack = () => {
    navigate("/");
  };
  const handleMobile = () => {
    setMobileMenu((prev) => !prev);
  };
  const handleMobileClose = () => {
    setMobileMenu(false);
  };
  const IconBtns = (
    <>
      <Box
        sx={{
          display: {
            xs: "block",
            sm: "none",
            position: "fixed",
            right: "1rem",
            top: "1rem",
          },
        }}
      >
        <IconButton onClick={handleMobile}>
          <MenuIcon />
        </IconButton>
      </Box>

      <Tooltip title="back">
        <IconButton
          sx={{
            position: "absoulte",
            bgcolor: matBlack,
            color: "white",
            ":hover": {
              bgcolor: "rgba(0,0,0,0.7)",
            },
          }}
          onClick={navigateBack}
        >
          <KeyboardBackspaceIcon />
        </IconButton>
      </Tooltip>
    </>
  );
  return (
    <>
      <Grid
        container
        height={"100vh"}
      >
        <Grid
          item
          sx={{ display: { xs: "none", sm: "block" } }}
          sm={4}
          bgcolor={"bisque"}
          color="black"
        >
          <GroupsList
            myGroups={sampleChats}
            chatId={chatId}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={8}
          sx={{
            // display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            padding: "1rem 3rem",
          }}
        >
          {IconBtns}
        </Grid>
        <Drawer
          sx={{ display: { xs: "block", sm: "none" } }}
          open={mobileMenu}
          onClose={handleMobileClose}
        >
          <GroupsList
            w={"50vw"}
            myGroups={sampleChats}
            chatId={chatId}
          />
        </Drawer>
      </Grid>
    </>
  );
};

const GroupsList = ({ w = "100%", myGroups = [], chatId }) => (
  <Stack
    width={w}
    direction={"column"}
  >
    {myGroups.length > 0 ? (
      myGroups?.map((group) => (
        <GroupListItem
          group={group}
          chatId={chatId}
          key={group._id}
        />
      ))
    ) : (
      <Typography
        textAlign={"center"}
        padding="1rem"
      >
        No groups
      </Typography>
    )}
  </Stack>
);

const GroupListItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group;
  return (
    <Link
      to={`?group=${_id}`}
      onClick={(e) => {
        chatId === _id ? e.preventDefault() : "";
      }}
    >
      <Stack
        direction={"row"}
        spacing={"1rem"}
        alignItems={"center"}
      >
        <AvatarCard avatar={avatar} />
        <Typography>{name}</Typography>
      </Stack>
    </Link>
  );
});

export default Groups;
