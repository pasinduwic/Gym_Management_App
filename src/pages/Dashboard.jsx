import DashboardCards from "../components/DashboardCards";
import GroupsIcon from "@mui/icons-material/Groups";
import DomainAddIcon from "@mui/icons-material/DomainAdd";

import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  addAlertDetails,
  addSessionUser,
  addModalTogal,
} from "../redux/features/StatusVar";
import { useDispatch } from "react-redux";
import moment from "moment";
import ChartComp from "../components/Chart";
import { useSelector } from "react-redux";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import UpdateCard from "../components/UpdateCard";
import GymImage from "../images/gym.jpg";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [clientCount, setClientCount] = useState(undefined);
  const [paymentList, setPaymentList] = useState(undefined);
  const [graphdata, setGraphData] = useState(undefined);
  const sessionUser = useSelector((state) => state.statusVar.value.sessionUser);
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();

  //fetching table data
  useEffect(() => {
    // console.log("sessionUsernew");
    // console.log(sessionUser);
    const controller = new AbortController();
    const getData = async () => {
      try {
        const responce = await axiosPrivate.get("/api/client", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${sessionUser?.accessToken}`,
          },
          withCredentials: true,
          signal: controller.signal,
        });
        // console.log(responce.data);
        if (responce.data.error === "Invalid!") {
          dispatch(addSessionUser({ type: "remove", payload: sessionUser }));
          return navigate("/", { state: { from: location }, replace: true });
        }
        if (responce.data.error) {
          dispatch(
            addAlertDetails({
              status: true,
              type: "error",
              message: responce.data.error,
            })
          );
          if (responce.data.error === "No clients available!") {
            setClientCount(0);
            setPaymentList([]);
          }
        } else {
          setClientCount(responce.data.length);
          const pList = responce.data.filter((client) =>
            moment(new Date()).isAfter(moment(client.nextPaymentDate))
          );

          // console.log("responce.data");
          // console.log(responce.data);
          setPaymentList(pList);
        }

        // console.log(clientCount);
        //fetching grap data
        const responcePayment = await axiosPrivate.get("/api/payment", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${sessionUser.accessToken}`,
          },
          withCredentials: true,
          signal: controller.signal,
        });
        // console.log(responcePayment.data)
        if (responcePayment.data.error === "Invalid!") {
          dispatch(addSessionUser({ type: "remove", payload: sessionUser }));
          return navigate("/", { state: { from: location }, replace: true });
        }

        if (responcePayment.data.error) {
          dispatch(
            addAlertDetails({
              status: true,
              type: "error",
              message: "failed to load graph data!",
            })
          );
        } else {
          let data = [
            {
              month: 1,
              amount: 0,
              otAmount: 0,
            },
            {
              month: 2,
              amount: 0,
              otAmount: 0,
            },
            {
              month: 3,
              amount: 0,
              otAmount: 0,
            },
            {
              month: 4,
              amount: 0,
              otAmount: 0,
            },
            {
              month: 5,
              amount: 0,
              otAmount: 0,
            },
            {
              month: 6,
              amount: 0,
              otAmount: 0,
            },
            {
              month: 7,
              amount: 0,
              otAmount: 0,
            },
            {
              month: 8,
              amount: 0,
              otAmount: 0,
            },
            {
              month: 9,
              amount: 0,
              otAmount: 0,
            },
            {
              month: 10,
              amount: 0,
              otAmount: 0,
            },
            {
              month: 11,
              amount: 0,
              otAmount: 0,
            },
            {
              month: 12,
              amount: 0,
              otAmount: 0,
            },
          ];

          responcePayment.data.map((pay) => {
            data.map((d) => {
              if (d.month === moment(pay.date).month() + 1) {
                d.amount += pay.amount;
              }
            });
          });

          setGraphData(data);
        }
      } catch (e) {
        dispatch(
          addAlertDetails({
            status: true,
            type: "error",
            message: "failed to load data!",
          })
        );
      }
    };
    getData();
    return () => controller.abort();
  }, []);
  return (
    <div className="dashboard page-container">
      <div className="page-header">
        <h3>Dasboard</h3>
      </div>

      <div className="page-content dashboard-content">
        <div className="dashboard-upper">
          <Paper
            elevation={2}
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <div className="cards">
              <Card className="card-container">
                <img
                  src={GymImage}
                  alt="pic"
                  style={{ width: "inherit", maxHeight: "inherit" }}
                />
              </Card>
              <DashboardCards
                value={clientCount}
                name={"Total Members"}
                image={<GroupsIcon color="success" fontSize="large" />}
              />
              {/* <DashboardCards
                value={deptCount}
                name={"Total Departments"}
                image={
                  <DomainAddIcon
                    sx={{ color: "rgb(22, 30, 84)" }}
                    fontSize="large"
                  />
                }
              /> */}
            </div>
            <div className="graphs">
              <ChartComp
                data={graphdata}
                color1="rgb(253, 47, 47)"
                color2="rgb(22, 30, 84)"
                type="Composed"
              />
              {/* <ChartComp
              data={graphdata}
              color1="#82ca9d"
              color2="#413ea0"
              type="pie"
            /> */}
            </div>
          </Paper>
        </div>

        <div className="dashboard-lower">
          <div className="shortcut-container">
            <Card className="short-cuts">
              <CardHeader title="Shortcuts" />
              <CardContent>
                <Box className="shortcut-box">
                  <Paper elevation={3} className="shortcut-paper">
                    <IconButton
                      onClick={() => {
                        dispatch(addModalTogal(true));
                        navigate("/home/client");
                      }}
                      sx={{ border: "1px solid gray" }}
                      size="small"
                    >
                      {" "}
                      <Add />
                    </IconButton>
                    <Typography variant="caption" display="block">
                      Add Client
                    </Typography>
                  </Paper>
                  <Paper elevation={3} className="shortcut-paper">
                    <IconButton
                      onClick={() => {
                        dispatch(addModalTogal(true));
                        navigate("/home/payment");
                      }}
                      sx={{ border: "1px solid gray" }}
                      size="small"
                    >
                      {" "}
                      <Add />
                    </IconButton>
                    <Typography variant="caption" display="block">
                      Add Payment
                    </Typography>
                  </Paper>
                </Box>
              </CardContent>
            </Card>
          </div>
          <div className="updates">
            <Card sx={{ height: "98%" }}>
              <CardHeader title="Updates" />
              <CardContent>
                <Box sx={{ overflow: "scroll" }}>
                  <div className="update-cards">
                    {/* <UpdateCard
                      value={attendanceCount}
                      name={"Presence Today"}
                      func={presenceToday}
                    /> */}
                    <UpdateCard
                      value={paymentList?.length}
                      name={"Paymet(s) due on Today"}
                      // viewList={leaveData}
                      // func={leaveToday
                    />
                  </div>

                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{ textAlign: "left", margin: "0 0 10px 18px" }}
                  >
                    {paymentList?.length === 0
                      ? "No Payments due Today"
                      : "Payment Due List"}
                  </Typography>

                  <List>
                    {paymentList?.map((client) => (
                      <>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar alt="Remy Sharp" src={undefined} />
                          </ListItemAvatar>
                          <ListItemText
                            primary={client.firstName + " " + client.lastName}
                            secondary={
                              "Due date : " +
                              moment(client.nextPaymentDate).format(
                                "YYYY-MM-DD"
                              )
                            }
                          />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                      </>
                    ))}
                  </List>
                </Box>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
