import { createLazyFileRoute } from "@tanstack/react-router";
import Uploads from "../pages/Uploads/Uploads";

export const Route = createLazyFileRoute("/uploads")({
  component: () => <Uploads />,
});
