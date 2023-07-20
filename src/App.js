import { Routes, Route } from "react-router-dom";
import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";
import Login from "./components/Login";
import RequireAuth from "./components/RequireAuth";
import Dashboard from "./pages/Dashboard";
import Coach from "./pages/Coach";
import Unauthorized from "./pages/Unauthorized";

import PersistLogin from "./components/loginComp/PersistLogin";
import Client from "./pages/Client";
import Payment from "./pages/Payments";

export default function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
            <Route path="/home" element={<Home />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="coach" element={<Coach />} />
              <Route path="client" element={<Client />} />

              <Route element={<RequireAuth allowedRoles={[2000]} />}>
                <Route path="payment" element={<Payment />} />
              </Route>
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Login />} />
      </Routes>
    </div>
  );
}
