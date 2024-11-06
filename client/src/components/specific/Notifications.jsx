import { Avatar, Button, Dialog, DialogTitle, ListItem, Skeleton, Stack, Typography } from "@mui/material";
import React, { memo } from "react";
import { sampleNotification } from "../../constants/sampleData";
import { useAcceptFriendRequestMutation, useGetNotificationQuery } from "../../redux/api/api";
import { useErrors } from "../../hooks/hook";
import { useDispatch, useSelector } from "react-redux";
import { setIsNotification } from "../../redux/reducers/misc";
import toast from "react-hot-toast";

const Notifications = () => {
  const dispatch = useDispatch();
  const { isNotification } = useSelector((state) => state.misc);
  const { isLoading, data, error, isError } = useGetNotificationQuery();
  const [acceptRequest] = useAcceptFriendRequestMutation();
  const friendRequestHandler = async ({ _id, accept }) => {
    dispatch(setIsNotification(false));
    try {
      const res = await acceptRequest({ requestId: _id, accept });
      if (res.data?.success) {
        console.log("User Socket Here");
        toast.success(res?.data?.message);
      } else toast.error(res?.data?.error?.message || "Something went wrong");
    } catch (error) {
      toast.error("Something went wrong in frontend");
      console.log(error);
    }
  };
  const handleCloseNotification = () => dispatch(setIsNotification(false));
  useErrors([{ error, isError }]);
  console.log(data?.result);

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
