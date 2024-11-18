import { Avatar, Button, Dialog, DialogTitle, ListItem, Skeleton, Stack, Typography } from "@mui/material";
import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import { useAcceptFriendRequestMutation, useGetNotificationQuery } from "../../redux/api/api";
import { setIsNotification } from "../../redux/reducers/misc";

const Notifications = () => {
  const dispatch = useDispatch();
  const { isNotification } = useSelector((state) => state.misc);
  const { isLoading, data, error, isError } = useGetNotificationQuery();
  const [acceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation);
  const friendRequestHandler = async ({ _id, accept }) => {
    dispatch(setIsNotification(false));
    await acceptRequest("Accepting...", { requestId: _id, accept });
  };
  const handleCloseNotification = () => dispatch(setIsNotification(false));
  useErrors([{ error, isError }]);

  return (
    <>
      <Dialog
        open={isNotification}
        onClose={handleCloseNotification}
      >
        <Stack
          padding={{ xs: "1rem", sm: "2rem" }}
          maxWidth={"25rem"}
        >
          {isLoading ? (
            <Skeleton />
          ) : (
            <>
              <DialogTitle>Notifications</DialogTitle>
              {data?.result?.length > 0 ? (
                data?.result?.map((i) => (
                  <NotificationItem
                    key={i._id}
                    sender={i.sender}
                    _id={i._id}
                    handler={friendRequestHandler}
                  />
                ))
              ) : (
                <Typography textAlign={"center"}>0 Notifications</Typography>
              )}
            </>
          )}
        </Stack>
      </Dialog>
    </>
  );
};

const NotificationItem = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender;
  return (
    <>
      <ListItem>
        <Stack
          direction={"row"}
          alignItems={"center"}
          spacing={"1rem"}
          width={"100%"}
        >
          <Avatar />
          <Typography
            variant="body1"
            sx={{
              flexGlow: 1,
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: "100%",
            }}
          >
            {`${name} sent you a friend request.`}
          </Typography>
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
          >
            <Button onClick={() => handler({ _id, accept: true })}>Accept</Button>
            <Button
              color="error"
              onClick={() => handler({ _id, accept: false })}
            >
              Reject
            </Button>
          </Stack>
        </Stack>
      </ListItem>
    </>
  );
});
export default Notifications;
