import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectRoute from "./components/auth/ProtectRoute";
import { LayoutLoader } from "./components/layout/Loaders";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Chat = lazy(() => import("./pages/Chat"));
const Groups = lazy(() => import("./pages/Groups"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
