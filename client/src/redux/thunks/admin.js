import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "../../constants/config";
import axios from "axios";
import { toast } from "react-hot-toast";

const adminLogin = createAsyncThunk("admin/login", async (secretKey) => {
  try {
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };
    const data = await axios.post(`${server}/admin/verify`, { secretKey }, config);
    return data.message;
  } catch (error) {
    throw error.response.data.message;
  }
});

const getAdmin = createAsyncThunk("admin/getAdmin", async () => {
  try {
    const data = await axios.get(`${server}/admin/`, { withCredentials: true });
    return data.result.admin;
  } catch (error) {
    throw error.response.data.message;
  }
});

const adminLogout = createAsyncThunk("admin/logout", async () => {
  try {
    const data = await axios.get(`${server}/admin/logout`, { withCredentials: true });
    return data.message;
  } catch (error) {
    throw error.response.data.message;
  }
});

export { adminLogin, getAdmin, adminLogout };
