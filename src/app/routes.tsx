import { createBrowserRouter } from "react-router";
import { Root } from "./pages/Root";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Reviews } from "./pages/Reviews";
import { ReviewDetail } from "./pages/ReviewDetail";
import { Collaborations } from "./pages/Collaborations";
import { CollaborationDetail } from "./pages/CollaborationDetail";
import { Videos } from "./pages/Videos";
import { Contact } from "./pages/Contact";
import { Login } from "./pages/Login";
import { Admin } from "./pages/Admin";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "reviews", Component: Reviews },
      { path: "reviews/:id", Component: ReviewDetail },
      { path: "collaborations", Component: Collaborations },
      { path: "collaborations/:id", Component: CollaborationDetail },
      { path: "videos", Component: Videos },
      { path: "contact", Component: Contact },
      { path: "*", Component: NotFound },
    ],
  },
  { path: "/login", Component: Login },
  { path: "/admin", Component: Admin },
]);