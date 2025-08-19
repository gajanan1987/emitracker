// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// const COLORS = ["#4CAF50", "#FF5722"]; // Paid = green, Unpaid = red

// const EmiChart = ({ paid, total }) => {
//   const unpaid = total - paid;

//   const data = [
//     { name: "Paid EMI", value: paid },
//     { name: "Unpaid EMI", value: unpaid },
//   ];

//   return (
//     <div style={{ width: 600, height: 300 }}>
//       <ResponsiveContainer>
//         <PieChart>
//           <Pie
//             data={data}
//             cx="50%"
//             cy="50%"
//             innerRadius={80}
//             outerRadius={120}
//             dataKey="value"
//             label={({ name, percent }) =>
//               `${name} ${(percent * 100).toFixed(0)}%`
//             }
//           >
//             {data.map((entry, index) => (
//               <Cell
//                 key={`cell-${index}`}
//                 fill={COLORS[index % COLORS.length]}
//               />
//             ))}
//           </Pie>
//           <Tooltip formatter={(value) => value.toLocaleString("en-IN")} />
//           <Legend />
//         </PieChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default EmiChart;

// import React from "react";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// const COLORS = ["#4CAF50", "#FF5722"]; // Paid = green, Unpaid = red

// const EmiChart = ({ paid, total }) => {
//   const unpaid = total - paid;

//   const data = [
//     { name: "Paid EMI", value: paid },
//     { name: "Remaining EMI", value: unpaid },
//   ];

//   return (
//     <div style={{ width: "100%", height: 320 }}>
//       <ResponsiveContainer>
//         <PieChart>
//           <Pie
//             data={data}
//             cx="50%"
//             cy="50%"
//             innerRadius={80}
//             outerRadius={120}
//             dataKey="value"
//             label={({ name, value }) => `${name}: ${value}`}
//           >
//             {data.map((entry, index) => (
//               <Cell
//                 key={`cell-${index}`}
//                 fill={COLORS[index % COLORS.length]}
//               />
//             ))}
//           </Pie>
//           <Tooltip formatter={(value) => value.toLocaleString("en-IN")} />
//           <Legend />
//         </PieChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default EmiChart;

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#4CAF50", "#FF5722"]; // Paid = green, Remaining = red

const EmiChart = ({ paid, total }) => {
  const unpaid = total - paid;

  const data = [
    { name: "Paid EMI", value: paid },
    { name: "Remaining EMI", value: unpaid },
  ];

  return (
    <div className="chart">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={65}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => value.toLocaleString("en-IN")} />
          {/* <Legend /> */}
        </PieChart>
      </ResponsiveContainer>

      {/* Centered Label */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "18px",
          fontWeight: "bold",
          color: "#333",
        }}
      >
        {paid} / {total}
      </div>
    </div>
  );
};

export default EmiChart;
