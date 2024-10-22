import { useInputValidation } from "6pp";
import { Button, Dialog, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { sampleUsers } from "../../constants/sampleData";
import UserItem from "../shared/UserItem";

const NewGroup = () => {
  const [members, setMembers] = useState(sampleUsers);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const groupName = useInputValidation("");
  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) => (prev?.includes(id) ? prev.filter((currentElement) => currentElement !== id) : [...prev, id]));
  };
  const submitHandler = () => {};
  const closeHandler = () => {};
  return (
    <>
      <Dialog
        open
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
            {members?.map((i) => (
              <UserItem
                user={i}
                key={i._id}
                handler={selectMemberHandler}
                isAdded={selectedMembers?.includes(i._id)}
              />
            ))}
          </Stack>
          <Stack
            direction={"row"}
            justifyContent={"space-evenly"}
          >
            <Button
              variant="text"
              color="error"
              size="large"
            >
              Cancel
            </Button>
            <Button
              size="large"
              variant="contained"
              onClick={submitHandler}
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
