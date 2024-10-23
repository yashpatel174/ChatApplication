import React, { lazy, memo, useEffect, useState, Suspense } from "react";
import { Box, IconButton, Grid, Tooltip, Drawer, Stack, Typography, TextField, Button, Backdrop } from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon, Done as DoneIcon, Edit as EditIcon, KeyboardBackspace as KeyboardBackspaceIcon, Menu as MenuIcon } from "@mui/icons-material";
import { gradient, matBlack } from "../constants/color";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "../components/styles/StyledComponents";
import AvatarCard from "../components/shared/AvatarCard";
import { sampleChats, sampleUsers } from "../constants/sampleData";
import UserItem from "../components/shared/UserItem";

const ConfirmDeleteComp = lazy(() => import("../components/dialogs/ConfirmDeleteComp"));
const AddMemberComp = lazy(() => import("../components/dialogs/AddMemberComp"));
const isAddMember = false;

const Groups = () => {
  const chatId = useSearchParams()[0].get("group");

  const [mobileMenu, setMobileMenu] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [groupName, setGroupName] = useState();
  const [updatedGroupNameValue, setUpdatedGroupNameValue] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

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

  const updateGroupName = () => {
    setIsEdit(false);
    console.log(updatedGroupNameValue);
  };

  const openDeleteHandler = () => {
    console.log("Delete Group");
    setConfirmDelete(true);
  };

  const closeDeleteHandler = () => {
    console.log("Delete close");
    setConfirmDelete(false);
  };

  const openAddMember = () => {
    console.log("Add Member");
  };

  const deleteHandler = () => {
    console.log("Delete Handler");
    closeDeleteHandler();
  };

  const removeMemberHandler = (id) => {
    console.log("removeMemberHandler", id);
  };

  useEffect(() => {
    if (chatId) {
      setGroupName(`Group Name ${chatId}`);
      setUpdatedGroupNameValue(`Group Name ${chatId}`);
    }

    return () => {
      setGroupName("");
      setUpdatedGroupNameValue("");
      setIsEdit(false);
    };
  }, [chatId]);

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

  const GroupName = (
    <>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"center"}
        spacing={"1rem"}
        padding={"1rem"}
      >
        {isEdit ? (
          <>
            <TextField
              value={updatedGroupNameValue}
              onChange={(e) => setUpdatedGroupNameValue(e.target.value)}
            />
            <IconButton onClick={updateGroupName}>
              <DoneIcon />
            </IconButton>
          </>
        ) : (
          <>
            <Typography variant="h4">{groupName}</Typography>
            <IconButton onClick={() => setIsEdit(true)}>
              <EditIcon />
            </IconButton>
          </>
        )}
      </Stack>
    </>
  );

  const ButtonGroup = (
    <Stack
      direction={{ sm: "row", xs: "column-reverse" }}
      spacing={"1rem"}
      padding={{
        xs: "0",
        sm: "1rem",
        md: "1rem 4rem",
      }}
    >
      <Button
        size="large"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={openDeleteHandler}
      >
        Delete Group
      </Button>
      <Button
        size="large"
        variant="contained"
        startIcon={<AddIcon />}
        onClick={openAddMember}
      >
        Add Member
      </Button>
    </Stack>
  );

  return (
    <>
      <Grid
        container
        height={"100vh"}
      >
        <Grid
          item
          sx={{ display: { xs: "none", sm: "block" }, backgroundImage: gradient }}
          sm={4}
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

          {groupName && (
            <>
              {GroupName}
              <Typography
                margin={"2rem"}
                alignSelf={"flex-start"}
                variant="body1"
              >
                Members
              </Typography>
              <Stack
                maxWidth={"45rem"}
                width={"100%"}
                boxSizing={"border-box"}
                padding={{
                  sm: "1rem",
                  xs: "0",
                  md: "1rem 4rem",
                }}
                spacing={"2rem"}
                height={"50vh"}
                overflow={"auto"}
              >
                {/* members */}
                {sampleUsers?.map((i) => (
                  <UserItem
                    key={i._id}
                    user={i}
                    isAdded
                    styling={{
                      boxShadow: "0 0 0.5rem rgba(0,0,0,0.2)",
                      padding: "1rem 2rem",
                      borderRadius: "1rem",
                    }}
                    handler={removeMemberHandler}
                  />
                ))}
              </Stack>
              {ButtonGroup}
            </>
          )}
        </Grid>

        {isAddMember && (
          <Suspense fallback={<Backdrop open />}>
            <AddMemberComp />
          </Suspense>
        )}

        {confirmDelete && (
          <Suspense fallback={<Backdrop open />}>
            <ConfirmDeleteComp
              open={confirmDelete}
              handleClose={closeDeleteHandler}
              deleteHandler={deleteHandler}
            />
          </Suspense>
        )}

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
    sx={{
      backgroundImage: gradient,
      height: "100vh",
      overflow: "auto",
    }}
    height={"100vh"}
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
        if (chatId === _id) e.preventDefault();
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
