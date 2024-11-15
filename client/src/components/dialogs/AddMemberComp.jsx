import { Button, Dialog, DialogTitle, Skeleton, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import { useAddGroupMemberMutation, useAvailableFriendsQuery } from "../../redux/api/api";
import { setIsAddMember } from "../../redux/reducers/misc";
import UserItem from "../shared/UserItem";

const AddMemberComp = ({ chatId }) => {
  const dispatch = useDispatch();
  const [selectedMembers, setSelectedMembers] = useState([]);

  const { isAddMember } = useSelector((state) => state.misc);

  const [addMember, isLoadingAddMember] = useAsyncMutation(useAddGroupMemberMutation);
  const { isLoading, data, isError, error } = useAvailableFriendsQuery(chatId);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) => (prev?.includes(id) ? prev.filter((currentElement) => currentElement !== id) : [...prev, id]));
  };

  const addMemberSubmitHandler = () => {
    addMember("Adding Members...", { members: selectedMembers, chatId });
    closeHandler();
  };

  const closeHandler = () => dispatch(setIsAddMember(false));

  useErrors([{ isError, error }]);
  return (
    <>
      <Dialog
        open={isAddMember}
        onClose={closeHandler}
      >
        <Stack
          p={"2rem"}
          width={"20rem"}
          spacing={"2rem"}
        >
          <DialogTitle textAlign={"center"}>Add Member</DialogTitle>
          <Stack spacing={"1rem"}>
            {isLoading ? (
              <Skeleton />
            ) : data.result.length > 0 ? (
              data.result?.map((i) => (
                <UserItem
                  key={i._id}
                  user={i}
                  handler={selectMemberHandler}
                  isAdded={selectedMembers?.includes(i._id)}
                />
              ))
            ) : (
              <Typography textAlign={"center"}>No Friends</Typography>
            )}
          </Stack>
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-evenly"}
          >
            <Button
              onClick={closeHandler}
              color="error"
            >
              Cancel
            </Button>
            <Button
              onClick={addMemberSubmitHandler}
              variant="contained"
              disabled={isLoadingAddMember}
            >
              Submit Changes
            </Button>
          </Stack>
        </Stack>
      </Dialog>
    </>
  );
};

export default AddMemberComp;
