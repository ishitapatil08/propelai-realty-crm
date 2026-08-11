import { redirect } from "next/navigation";

export default function LandingPage() {
  // Directly redirect to the login page
  redirect("/login");
}
