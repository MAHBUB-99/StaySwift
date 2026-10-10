import { auth } from "@/auth";
import NavbarClient from "./navbar/NavbarClient";

// Reads the session on the server; the interactive parts live in NavbarClient.
const Navbar = async ({ minimal = false }) => {
  const session = await auth();
  const user = session?.user
    ? {
        name: session.user.name ?? "",
        email: session.user.email ?? "",
        image: session.user.image ?? null,
      }
    : null;

  return <NavbarClient user={user} minimal={minimal} />;
};

export default Navbar;
