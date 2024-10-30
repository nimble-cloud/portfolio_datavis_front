import { createLazyFileRoute } from "@tanstack/react-router";
import Reports from "../pages/Reports/Reports";

export const Route = createLazyFileRoute("/reports")({
  component: () => <Reports />,
});
