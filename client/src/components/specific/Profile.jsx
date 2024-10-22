import { CalendarMonth as CalendarIcon, Face as FaceIcon, AlternateEmail as UserNameIcon } from "@mui/icons-material";
import { Avatar, Stack, Typography } from "@mui/material";
import moment from "moment";
import React from "react";

const Profile = () => {
  return (
    <Stack
      spacing={"2rem"}
      direction={"column"}
      alignItems={"center"}
    >
      <Avatar sx={{ width: 200, height: 200, objectFit: "contain", marginBottom: "1rem", border: "5px solid white" }} />
      <ProfileCard
        heading={"Bio"}
        text={"I am a developer"}
      />
      <ProfileCard
        heading={"Username"}
        text={"hey_yash_patel"}
        Icon={<UserNameIcon />}
      />
      <ProfileCard
        heading={"Name"}
        text={"Yash Patel"}
        Icon={<FaceIcon />}
      />
      <ProfileCard
        heading={"Joined"}
        text={moment("2024-10-22T00:00:00.000Z").fromNow()}
        Icon={<CalendarIcon />}
      />
    </Stack>
  );
};
const ProfileCard = ({ text, Icon, heading }) => (
  <Stack
    direction={"row"}
    alignItems={"center"}
    spacing={"1rem"}
    color={"white"}
    textAlign={"center"}
  >
    {Icon && Icon}
    <Stack>
      <Typography variant="body1">{text}</Typography>
      <Typography
        color={"gray"}
        variant="caption"
      >
        {heading}
      </Typography>
    </Stack>
  </Stack>
);

export default Profile;
