import { createFileRoute } from "@tanstack/react-router";
import PropelApp from "@/components/propel/PropelApp";

export const Route = createFileRoute("/")({
  component: PropelApp,
});
