import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";
const Navbar = () => {
  const { user, username } = useContext(UserContext);
  return (
    <>
      <nav className="navbar">
        <ul>
          <li>
            <Link href="/">
              <button className="btn-logo">Brag</button>
            </Link>
          </li>
          {/* user signed in and has username */}
          {username && (
            <>
              <li className="push-left">
                <Link href="/admin">
                  <button className="btn-blue">Write Posts</button>
                </Link>
              </li>
              <li>
                <Link href={`/${username}`}>
                  <img src={user?.photoURL} />
                </Link>
              </li>
            </>
          )}
          {/* user is not signed in or has username */}
          {!username && (
            <li className="push-left">
              <Link href="/enter">
                <button className="btn-blue">Log In</button>
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
