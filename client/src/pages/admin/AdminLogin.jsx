import React from "react";
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import { Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import { gradient } from "../../constants/color";
import { useInputValidation } from "6pp";
import { Navigate } from "react-router-dom";

const AdminLogin = () => {
  const secretKey = useInputValidation("");
  const isAdmin = true;

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("submitHandler");
  };

  if (isAdmin) return <Navigate to="/admin/dashboard" />;
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
          <Typography variant="h5">Admin Login</Typography>
          <form
            style={{ width: "100%" }}
            onSubmit={submitHandler}
          >
            <TextField
              required
              fullWidth
              label="Secret key"
              type="password"
              margin="normal"
              variant="outlined"
              value={secretKey.value}
              onChange={secretKey.changeHandler}
            />
            <Button
              sx={{
                marginTop: "1rem",
              }}
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
            >
              Login
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default AdminLogin;
