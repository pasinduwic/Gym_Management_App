import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Area,
  PieChart,
  Pie
} from "recharts";

const ChartComp = ({ data, color1, color2, type }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      {type === "Composed" ? (
        <ComposedChart
          data={data}
          margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
        >
          <XAxis
            dataKey="month"
            tickFormatter={(label) => {
              switch (label) {
                case 1:
                  return "Jan";

                case 2:
                  return "Feb";

                case 3:
                  return "Mar";

                case 4:
                  return "Apr";

                case 5:
                  return "May";

                case 6:
                  return "Jun";

                case 7:
                  return "Jul";

                case 8:
                  return "Aug";

                case 9:
                  return "Sep";

                case 10:
                  return "Oct";

                case 11:
                  return "Nov";

                case 12:
                  return "Dec";

                default:
                  return "undefined";
              }
            }}
          />
          <YAxis tickFormatter={(label) => `${label / 1000}k`} />
          <Tooltip />
          <Legend />
          <CartesianGrid strokeDasharray="3 3" />
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color1} stopOpacity={0.8} />
              <stop offset="95%" stopColor={color1} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Bar dataKey="amount" barSize={20} fill={color2} />
          {/* <Area
            type="monotone"
            dataKey="otAmount"
            fill="url(#colorUv)"
            stroke={color1}
          /> */}
        </ComposedChart>
      ) : type === "pie" ? (
        <PieChart>
          <Pie
            data={data}
            dataKey="otAmount"
            nameKey="month"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill={color1}
            label={(value) => {
              let monthNew = "";
              switch (value.month) {
                case 1:
                  monthNew = "Jan";
                  break;
                case 2:
                  monthNew = "Feb";
                  break;

                case 3:
                  monthNew = "Mar";
                  break;

                case 4:
                  monthNew = "Apr";
                  break;

                case 5:
                  monthNew = "May";
                  break;

                case 6:
                  monthNew = "Jun";
                  break;

                case 7:
                  monthNew = "Jul";
                  break;

                case 8:
                  monthNew = "Aug";
                  break;

                case 9:
                  monthNew = "Sep";
                  break;

                case 10:
                  monthNew = "Oct";
                  break;

                case 11:
                  monthNew = "Nov";
                  break;

                case 12:
                  monthNew = "Dec";
                  break;

                default:
                  monthNew = "undefined";
              }

              const RADIAN = Math.PI / 180;
              // eslint-disable-next-line
              const radius =
                25 +
                value.innerRadius +
                (value.outerRadius - value.innerRadius);
              // eslint-disable-next-line
              const x = value.cx + radius * Math.cos(-value.midAngle * RADIAN);
              // eslint-disable-next-line
              const y = value.cy + radius * Math.sin(-value.midAngle * RADIAN);
              return value.otAmount !== 0 ? (
                <text
                  x={x}
                  y={y}
                  fill={color1}
                  textAnchor={x > value.cx ? "start" : "end"}
                  dominantBaseline="central"
                >
                  {monthNew} ({value.otAmount})
                </text>
              ) : (
                0
              );
            }}
          />
        </PieChart>
      ) : (
        <></>
      )}
    </ResponsiveContainer>
  );
};

export default ChartComp;
