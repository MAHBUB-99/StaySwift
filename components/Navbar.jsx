import { auth } from "@/auth";
import Image from "next/image";
import Link from "next/link";
import Logout from "./auth/Logout";

const Navbar = async ({ sideMenu }) => {
  const session = await auth();
  return (
    <nav>
      <Link href="/">
        <span
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#000",
            letterSpacing: "1px",
            fontFamily: "Georgia",
            display: "inline-block",
            lineHeight: "1.2",
          }}
        >
          Stay Swift
        </span>
      </Link>

      <ul>
        <li>
          <Link href="#">Recommended Places</Link>
        </li>

        <li>
          <Link href="#">About Us</Link>
        </li>

        <li>
          <Link href="#">Contact us</Link>
        </li>

        {sideMenu && (
          <>
            <li>
              <Link href="/bookings">Bookings</Link>
            </li>

            <li>
              {session?.user ? (
                <div>
                  <span className="mx-1">{session?.user?.name}</span>
                  <span>| </span>
                  <Logout />
                </div>
              ) : (
                <Link href="/login" className="login">
                  Login
                </Link>
              )}
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
