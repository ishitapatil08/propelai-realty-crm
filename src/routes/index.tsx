import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../lib/auth";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: RootRedirect,
});

function RootRedirect() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate({ to: "/login" });
    } else if (currentUser.role === "super_admin") {
      navigate({ to: "/super-admin" });
    } else if (currentUser.role === "tenant_admin") {
      navigate({ to: "/tenant-admin" });
    } else {
      navigate({ to: "/staff" });
    }
  }, [currentUser, navigate]);

  return null;
}
