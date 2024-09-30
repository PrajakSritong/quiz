import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const getMonthlyData = (transactions) => {
  const currentDate = new Date();
  const lastMonthDate = new Date();
  lastMonthDate.setMonth(currentDate.getMonth() - 1);

  const monthlyData = {
    months: [lastMonthDate, currentDate],
    income: Array(2).fill(0),
    expense: Array(2).fill(0),
  };

  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);
    const monthIndex = transactionDate.getMonth() - lastMonthDate.getMonth();
    if (monthIndex >= 0 && monthIndex < 2) {
      if (transaction.type === "income") {
        monthlyData.income[monthIndex] += transaction.amount;
      } else if (transaction.type === "expense") {
        monthlyData.expense[monthIndex] += transaction.amount;
      }
    }
  });

  return monthlyData;
};

const IncomeExpenseChart = ({ transactions }) => {
  const monthlyData = getMonthlyData(transactions);

  const data = {
    labels: monthlyData.months.map((date) =>
      date.toLocaleString("default", { month: "long" })
    ),
    datasets: [
      {
        label: "Income",
        data: monthlyData.income,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Expenses",
        data: monthlyData.expense,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Income and Expenses Over the Last 2 Months",
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default IncomeExpenseChart;
