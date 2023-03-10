import React from "react";
import { NavLink } from "react-router-dom";


class Navbar extends React.Component {
  render() {
    return (
<div className="ui three menu">
  <NavLink to="/current" className="item" target="_self">
    Current Tournaments
  </NavLink>
  <NavLink to="/past" className="item" target="_self">
    Past Tournaments
  </NavLink>
  <NavLink to="/upcoming" className="item" target="_self">
    Upcoming Tournaments
  </NavLink>
</div>
  )}
};

export default Navbar;