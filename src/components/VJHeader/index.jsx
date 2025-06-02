import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/images/logo/vj-logo.png";
import "./VJHeader.css";

export const VJHeader = () => {
  return (
    <>
      <header className="header">
        <div className="container">
          <div className="header-container d-flex align-items-center justify-content-between">
            <Link to={"/"} className="ratio ratio-21x9 vj-logo">
              <img
                src={logo}
                alt="Vivek Jariwala."
                width={"100%"}
                height={"100%"}
              />
            </Link>
            <nav className="d-flex gap-5 nav">
              <NavLink className={"h4"} to={"/"}>
                Home
              </NavLink>
              <NavLink className={"h4"} to={"/about"}>
                About
              </NavLink>
              <NavLink className={"h4"} to={"/contact"}>
                Contact
              </NavLink>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};
