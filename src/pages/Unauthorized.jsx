import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import unauthorizedImg from "../images/unauthorized.jpg";

const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);
  return (
    <div
      className="unauthorized"
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <img
        src={unauthorizedImg}
        style={{ width: "40%", height: "50%" }}
        alt=""
      />
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: "rgb(22, 30, 84)",
          fontWeight: "bolder",
          fontSize: "xxx-large"
        }}
      >
        We are Sorry...
      </Typography>
      <Typography
        variant="body1"
        gutterBottom
        sx={{
          color: "rgb(22, 30, 84)"
        }}
      >
        The page you are trying to access has restricted access.
      </Typography>
      <Typography
        variant="body1"
        gutterBottom
        sx={{
          color: "rgb(22, 30, 84)",
          marginBottom: "20px"
        }}
      >
        Please refer to your system administrator
      </Typography>
      <Button variant="contained" onClick={goBack}>
        {" "}
        Goback
      </Button>
    </div>
  );
};

export default Unauthorized;
