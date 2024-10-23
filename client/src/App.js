import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectRoute from "./components/auth/ProtectRoute";
import { LayoutLoader } from "./components/layout/Loaders";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Chat = lazy(() => import("./pages/Chat"));
const Groups = lazy(() => import("./pages/Groups"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const ChatManagement = lazy(() => import("./pages/admin/ChatManagement"));
const MessageManagement = lazy(() => import("./pages/admin/MessageManagement"));

const App = () => {
  let user = true;
  return (
    <div>
      <Router>
        <Suspense
          fallback={
            <div>
              <LayoutLoader />
            </div>
          }
        >
          <Routes>
            <Route element={<ProtectRoute user={user} />}>
              <Route
                path="/"
                element={<Home />}
              />
              <Route
                path="/chat/:chatId"
                element={<Chat />}
              />
              <Route
                path="/groups"
                element={<Groups />}
              />
            </Route>
            <Route
              path="/login"
              element={
                <ProtectRoute
                  user={!user}
                  redirect="/"
                >
                  <Login />
                </ProtectRoute>
              }
            />
            <Route
              path="/admin"
              element={<AdminLogin />}
            />
            <Route
              path="/admin/dashboard"
              element={<Dashboard />}
            />
            <Route
              path="/admin/user"
              element={<UserManagement />}
            />
            <Route
              path="/admin/chat"
              element={<ChatManagement />}
            />
            <Route
              path="/admin/messages"
              element={<MessageManagement />}
            />
            <Route
              path="*"
              element={<NotFound />}
            />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
};

export default App;
