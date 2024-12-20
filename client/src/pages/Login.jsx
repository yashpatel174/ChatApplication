import { useFileHandler, useInputValidation } from "6pp";
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import { Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import AppLayout from "../components/layout/AppLayout";
import { VisuallyHiddenInput } from "../components/styles/StyledComponents";
import { gradient } from "../constants/color";
import { server } from "../constants/config";
import { userExists } from "../redux/reducers/auth";
import { usernameValidator } from "../utils/validators";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const toggleLogin = (e) => setIsLogin((prev) => !prev);

  const name = useInputValidation("");
  const bio = useInputValidation("");
  const userName = useInputValidation("", usernameValidator);
  const password = useInputValidation("");

  const avatar = useFileHandler("single");
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Logging In...");
    setIsLoading(true);
    try {
      const config = { withCredentials: true, headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(`${server}/users/login`, { userName: userName.value, password: password.value }, config);
      dispatch(userExists(data.user));
      toast.success(data.message, { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.messge || "Something Went Wrong!", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Signing Up...");
    setIsLoading(true);
    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("userName", userName.value);
    formData.append("password", password.value);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    try {
      const { data } = await axios.post(`${server}/users/register`, formData, config);
      dispatch(userExists(data.user));
      toast.success(data.message, { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.messge || "Something Went Wrong!", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ backgroundImage: gradient }}>
      <Container
        component={"main"}
        maxWidth="xs"
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{ padding: 4, display: "flex", flexDirection: "column", alignItems: "center" }}
        >
          {isLogin ? (
            <>
              <Typography variant="h5">Login</Typography>
              <form
                style={{ width: "100%" }}
                onSubmit={handleLogin}
              >
                <TextField
                  required
                  fullWidth
                  label="Username"
                  margin="normal"
                  variant="outlined"
                  value={userName.value}
                  onChange={userName.changeHandler}
                />

                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  margin="normal"
                  variant="outlined"
                  value={password.value}
                  onChange={password.changeHandler}
                />
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isLoading}
                >
                  Login
                </Button>
                <Typography
                  textAlign="center"
                  m="1rem"
                >
                  OR
                </Typography>
                <Button
                  sx={{ marginTop: "1rem" }}
                  fullWidth
                  variant="text"
                  disabled={isLoading}
                  onClick={toggleLogin}
                >
                  SIGN UP INSTEAD
                </Button>
              </form>
              Home
            </>
          ) : (
            <>
              <Typography variant="h5">Sign Up</Typography>
              <form
                style={{ width: "100%" }}
                onSubmit={handleSignUp}
              >
                <Stack
                  position="relative"
                  width="10rem"
                  margin="auto"
                >
                  <Avatar
                    sx={{ width: "10rem", height: "10rem", objectFit: "contain" }}
                    src={avatar.preview}
                  />

                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: "0",
                      right: "0",
                      color: "white",
                      bgcolor: "rgba(0, 0, 0, 0.5)",
                      ":hover": {
                        bgcolor: "rgba(0, 0, 0, 0.7)",
                      },
                    }}
                    component="label"
                  >
                    <>
                      <CameraAltIcon />
                      <VisuallyHiddenInput
                        type="file"
                        onChange={avatar.changeHandler}
                      />
                    </>
                  </IconButton>
                </Stack>
                {avatar.error && (
                  <Typography
                    m="1rem"
                    width="fit-content"
                    display="block"
                    color="error"
                    variant="caption"
                  >
                    {avatar.error}
                  </Typography>
                )}
                <TextField
                  required
                  fullWidth
                  label="Name"
                  margin="normal"
                  variant="outlined"
                  value={name.value}
                  onChange={name.changeHandler}
                />
                <TextField
                  required
                  fullWidth
                  label="Bio"
                  margin="normal"
                  variant="outlined"
                  value={bio.value}
                  onChange={bio.changeHandler}
                />
                <TextField
                  required
                  fullWidth
                  label="Username"
                  margin="normal"
                  variant="outlined"
                  value={userName.value}
                  onChange={userName.changeHandler}
                />
                {userName.error && (
                  <Typography
                    color="error"
                    variant="caption"
                  >
                    {userName.error}
                  </Typography>
                )}
                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  margin="normal"
                  variant="outlined"
                  value={password.value}
                  onChange={password.changeHandler}
                />
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isLoading}
                >
                  SIGN UP
                </Button>
                <Typography
                  textAlign="center"
                  m="1rem"
                >
                  OR
                </Typography>
                <Button
                  sx={{ marginTop: "1rem" }}
                  fullWidth
                  variant="text"
                  onClick={toggleLogin}
                  disabled={isLoading}
                >
                  LOG IN INSTEAD
                </Button>
              </form>
            </>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default AppLayout()(Login);
