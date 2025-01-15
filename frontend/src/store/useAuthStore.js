import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  //variables
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  //functions
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error checking auth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Signed up successfully");
      get().connectSocket();
    } catch (error) {
      toast.error("Error. Could not sign up.");
      console.log("Error signing up", error);
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
      //   set({ isLoggingIn: false });
    } catch (error) {
      toast.error("Error. Could not login.");
      console.log("Error logging in", error);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.post("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
      // set({ isUpdatingProfile: false });
    } catch (error) {
      toast.error("Error. Could not update profile.");
      console.log("Error updating profile", error);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error("Error. Could not logout out.");
    }
  },
  connectSocket: async () => {
    /*
        1. Get authorised user
        2. If authorised user found then create socket for that user by passing its user id as query
        3. Connect to socket and set that socket
        4. Listen for online users and add to online users array
        */
    const { authUser } = get();
    if (!authUser || get().socket?.connected) {
      return;
    }
    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();
    set({ socket: socket });
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: async () => {
    if (get.socket?.connected) {
      get().socket.disconnect();
    }
  },
}));
