import { Add as AddIcon, Group as GroupIcon, Logout as LogoutIcon, Menu as MenuIcon, Notifications as NotificationsIcon, Search as SearchIcon } from "@mui/icons-material";
import { AppBar, Backdrop, Box, IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import axios from "axios";
import React, { lazy, Suspense, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { orange } from "../../constants/color";
import { server } from "../../constants/config";
import { userNotExists } from "../../redux/reducers/auth";
import { setIsMobile, setIsNotification, setIsSearch } from "../../redux/reducers/misc";

const Search = lazy(() => import("../specific/Search"));
const Notification = lazy(() => import("../specific/Notifications"));
const NewGroup = lazy(() => import("../specific/NewGroup"));

const Header = () => {
  const [isNewGroup, setIsNewGroup] = useState(false);

  const { isSearch, isNotification } = useSelector((state) => state.misc);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleMobile = () => dispatch(setIsMobile(true));
  const openSearch = () => dispatch(setIsSearch(true));
  const openNotification = () => dispatch(setIsNotification(true));
  const openNewGroup = () => {
    setIsNewGroup((prev) => !prev);
  };

  const navigateToGroup = () => navigate("/groups");
  const logoutHandler = async () => {
    try {
      const data = await axios.get(`${server}/users/logout`, { withCredentials: true });
      dispatch(userNotExists());
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Box
        sx={{ flexGrow: 1 }}
        height={"4rem"}
      >
        <AppBar
          position="static"
          sx={{ bgcolor: orange }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              Chit Chat
            </Typography>
            <Box sx={{ display: { xs: "block", sm: "none" } }}>
              <IconButton
                color="inherit"
                onClick={handleMobile}
              >
                <MenuIcon />
              </IconButton>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
              }}
            />
            <Box>
              <IconBtn
                title={"Search"}
                icon={<SearchIcon />}
                onClick={openSearch}
              />
              <IconBtn
                title={"New Group"}
                icon={<AddIcon />}
                onClick={openNewGroup}
              />
              <IconBtn
                title={"Manage Groups"}
                icon={<GroupIcon />}
                onClick={navigateToGroup}
              />
              <IconBtn
                title={"Notifications"}
                icon={<NotificationsIcon />}
                onClick={openNotification}
              />
              <IconBtn
                title={"Logout"}
                icon={<LogoutIcon />}
                onClick={logoutHandler}
              />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      {isSearch && (
        <Suspense fallback={<Backdrop open />}>
          <Search />
        </Suspense>
      )}
      {isNotification && (
        <Suspense fallback={<Backdrop open />}>
          <Notification />
        </Suspense>
      )}
      {isNewGroup && (
        <Suspense fallback={<Backdrop open />}>
          <NewGroup />
        </Suspense>
      )}
    </>
  );
};

const IconBtn = ({ title, icon, onClick }) => {
  return (
    <Tooltip title={title}>
      <IconButton
        color="inherit"
        size="large"
        onClick={onClick}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
};

export default Header;
