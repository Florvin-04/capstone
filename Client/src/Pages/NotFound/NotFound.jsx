import React from "react";
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/products");
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return <div>NotFound</div>;
}

export default NotFound;
