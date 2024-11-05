import { useInputValidation } from "6pp";
import { Button, Dialog, DialogTitle, Skeleton, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import { useAvailableFriendsQuery, useNewGroupMutation } from "../../redux/api/api";
import { setIsNewGroup } from "../../redux/reducers/misc";
import UserItem from "../shared/UserItem";

const NewGroup = () => {
  const { isNewGroup } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const [selectedMembers, setSelectedMembers] = useState([]);

  const { isError, isLoading, error, data } = useAvailableFriendsQuery();
  const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation);

  const errors = [{ isError, error }];

  useErrors(errors);

  const groupName = useInputValidation("");
  const closeHandler = () => dispatch(setIsNewGroup(false));
  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) => (prev?.includes(id) ? prev.filter((currentElement) => currentElement !== id) : [...prev, id]));
  };
  const submitHandler = () => {
    if (!groupName.value) return toast.error("Group name is required");
    if (selectedMembers?.length < 2) return toast.error("Please select at least 2 members");
    newGroup("Creating New Group...", { name: groupName.value, members: selectedMembers });
    closeHandler();
  };
  return (
    <>
      <Dialog
        open={isNewGroup}
        onClose={closeHandler}
      >
        <Stack
          padding={{ xs: "1rem", sm: "3rem" }}
          width={"25rem"}
          spacing={"2rem"}
        >
          <DialogTitle
            textAlign={"center"}
            variant="h4"
          >
            New Group
          </DialogTitle>
          <TextField
            label={"Group Name"}
            value={groupName.value}
            onChange={groupName.changeHandler}
          />
          <Typography variant="body1">Members</Typography>
          <Stack>
            {isLoading ? (
              <Skeleton />
            ) : (
              data?.result?.map((i) => (
                <UserItem
                  user={i}
                  key={i._id}
                  handler={selectMemberHandler}
                  isAdded={selectedMembers?.includes(i._id)}
                />
              ))
            )}
          </Stack>
          <Stack
            direction={"row"}
            justifyContent={"space-evenly"}
          >
            <Button
              variant="text"
              color="error"
              size="large"
              onClick={closeHandler}
            >
              Cancel
            </Button>
            <Button
              size="large"
              variant="contained"
              onClick={submitHandler}
              disabled={isLoadingNewGroup}
            >
              Create
            </Button>
          </Stack>
        </Stack>
      </Dialog>
    </>
  );
};

export default NewGroup;
