import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../AppContext/AppContext";
import axios from "axios";

const Header = () => {
  const { loggedInName, loggedInID, isAutorize } = useGlobalContext();
  const navigate = useNavigate();
  // const [isAutorize, setIsAuthorize] = useState(false);

  // axios.defaults.withCredentials = true;
  // useEffect(() => {
  //   axios.get("http://localhost:8081").then((response) => {
  //     if (response.data.Status === "success") {
  //       console.log(response);
  //       setIsAuthorize(true);
  //     } else {
  //       setIsAuthorize(false);
  //     }
  //   });
  // }, []);

  // axios.defaults.withCredentials = true;
  function handleLogout() {
    axios
      .get("http://localhost:8081/logout")
      .then((response) => {
        if (response.data.Status === "success") {
          localStorage.removeItem("reciept_items");
          window.location.reload();
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <>
      <div>Header</div>
      {isAutorize ? (
        <div>
          <p>
            {loggedInName.first_name} {loggedInName.last_name} {loggedInID}
          </p>

          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button
          onClick={() => {
            navigate("/login");
          }}
        >
          Login
        </button>
      )}
    </>
  );
};

export default Header;
