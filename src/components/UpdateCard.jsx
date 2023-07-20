import { Visibility } from "@mui/icons-material";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popover,
  Skeleton,
  Tooltip,
  Typography
} from "@mui/material";
import moment from "moment";
import { useState } from "react";

const UpdateCard = ({ value, name, viewList = undefined, func }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div className="update-card-container" style={{ width: "100%" }}>
      <Card className="update-card">
        <Box
          sx={{
            display: "flex",
            // flexDirection: "column",
            width: "100%",
            // height: "100%",
            justifyContent: "center",
            padding: "10px 0 6px 0"
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              // flexDirection: "column",
              gap: "10px",
              justifyContent: "space-between",
              alignItems: "center"
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
          {/* <Box
            sx={{
              display: "flex",
              // flexDirection: "column",
              gap: "2px",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Tooltip title="Refresh">
              <IconButton sx={{ width: "40px", height: "40px" }} onClick={func}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            {viewList?.length !== 0 && viewList && (
              <Tooltip title="View List">
                <IconButton
                  onClick={handleClick}
                  sx={{ width: "40px", height: "40px" }}
                >
                  <Visibility />
                </IconButton>
              </Tooltip>
            )}
          </Box> */}
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center"
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center"
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
      </Card>
    </div>
  );
};

export default UpdateCard;
