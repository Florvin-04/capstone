import { useEffect } from "react";
import "./NotFound.scss";
import { Navigate, useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/products");
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="not-found-page">
      <p>404</p>
      <p>Page Not Found</p>
    </div>
  );
}

export default NotFound;
