import React, { useRef } from "react";
import "./OrdersNavStatus.scss";
import { NavLink } from "react-router-dom";
function OrdersNavStatus() {
  const containerRef = useRef(null);

  const handleClick = (event) => {
    // Get the container width
    const containerWidth = containerRef.current.clientWidth;

    // Get the link element that was clicked
    const link = event.target;

    // Calculate the left offset needed to center the link in the container
    const linkWidth = link.clientWidth;
    const centerOffset = (containerWidth - linkWidth) / 2;

    // Calculate the target scroll position
    const targetScrollLeft = link.offsetLeft - centerOffset;

    // Scroll to the target position with smooth behavior
    containerRef.current.scroll({
      left: targetScrollLeft,
      behavior: "smooth",
    });
  };
  return (
    <div
      className="orders__wrapper"
      ref={containerRef}
    >
      <nav className="orders__navigation">
        <ul className="orders__navigation--container">
          <li className="orders__navigations--list">
            <NavLink
              to="."
              end
            >
              All
            </NavLink>
          </li>
          <li className="orders__navigations--list">
            <NavLink
              onClick={handleClick}
              to="pending"
            >
              Pending
            </NavLink>
          </li>
          <li className="orders__navigations--list">
            <NavLink
              onClick={handleClick}
              to="to-ship"
            >
              To Ship
            </NavLink>
          </li>
          <li className="orders__navigations--list">
            <NavLink
              onClick={handleClick}
              to="to-receive"
            >
              To Receive
            </NavLink>
          </li>
          <li className="orders__navigations--list">
            <NavLink
              onClick={handleClick}
              to="completed"
            >
              Completed
            </NavLink>
          </li>
          <li className="orders__navigations--list">
            <NavLink
              onClick={handleClick}
              to="cancelled"
            >
              Cancelled
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default OrdersNavStatus;
