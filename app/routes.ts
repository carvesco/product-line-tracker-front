import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("login/login.tsx"),
  route("tracker", "tracker/tracker.tsx"),
  route("submission", "submission/submission.tsx"),
] satisfies RouteConfig;
