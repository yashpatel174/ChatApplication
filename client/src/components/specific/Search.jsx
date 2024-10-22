import { useInputValidation } from "6pp";
import { Dialog, DialogTitle, InputAdornment, List, ListItem, ListItemText, Stack, TextField } from "@mui/material";
import React, { useState } from "react";
import { Search as SearchIcon } from "@mui/icons-material";
import UserItem from "../shared/UserItem";
import { sampleUsers } from "../../constants/sampleData";

const Search = () => {
  const [users, setUsers] = useState(sampleUsers);

  const search = useInputValidation("");
  const isLoadingSendFriendRequest = false;

  const addFriendHandler = (id) => {
    console.log(id);
  };

  return (
    <>
      <Dialog open>
        <Stack
          padding={"2rem"}
          direction={"column"}
          width={"25rem"}
        >
          <DialogTitle textAlign={"center"}>Find people</DialogTitle>
          <TextField
            label=""
            value={search.value}
            onChange={search.changeHandler}
            variant="outlined"
            size="small"
            InputProps={{
              startAndornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <List>
            {users?.map((i) => (
              <UserItem
                user={i}
                key={i._id}
                handler={addFriendHandler}
                handlerIsLoading={isLoadingSendFriendRequest}
              />
            ))}
          </List>
        </Stack>
      </Dialog>
    </>
  );
};

export default Search;
