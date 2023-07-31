import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popover,
  Skeleton,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useState } from "react";

const DashboardCard = ({ value, name, image, viewList = undefined }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  console.log("value");
  console.log(value);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div className="card-container">
      <Card className="dashbodar-card">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "60%",
            justifyContent: "space-between",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {value !== undefined ? (
              <Typography variant="h5"> {value} </Typography>
            ) : (
              <Skeleton variant="circular" width={34} height={34} />
            )}
            <Typography variant="body2" color="text.secondary">
              {name}
            </Typography>
          </CardContent>
          {viewList?.length !== 0 && viewList && (
            <Typography
              variant="caption"
              color="text.secondary"
              onClick={handleClick}
              style={{
                cursor: "pointer",
              }}
            >
              View List
            </Typography>
          )}
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <Box sx={{ padding: "10px 20px", maxHeight: "300px" }}>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ textAlign: "center", margin: "0 0 10px 18px" }}
              >
                On leave list
              </Typography>
              <List>
                {viewList?.map((leave) => (
                  <>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar alt="Remy Sharp" src={leave.employee.photo} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          leave.employee.first_name +
                          " " +
                          leave.employee.last_name
                        }
                        secondary={
                          "Back on:  " +
                          moment(leave.endDate)
                            .add(1, "days")
                            .format("YYYY-MM-DD")
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </>
                ))}
              </List>
            </Box>
          </Popover>
        </Box>
        {image}
      </Card>
    </div>
  );
};

export default DashboardCard;
