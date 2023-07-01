"use client";

import { useEffect } from "react";
import { Chart } from "chart.js/auto";
import { createColors } from "@/lib/utils";
const RatingChart = ({ data }: { data: number[] }) => {
 useEffect(() => {
  const canvas = document.getElementById("myChart") as HTMLCanvasElement;
  var ctx = canvas.getContext("2d");
  var myChart = new Chart(ctx!, {
   type: "bar",
   options: {
    indexAxis: "y",
    maintainAspectRatio: false,
    plugins: {
     legend: {
      display: false,
     },
    },
    scales: {
     x: {
      grid: {
       display: false,
      },
      ticks: {
       callback: function (value: any) {
        if (value % 1 === 0) {
         return value.toString();
        }
        return "";
       },
      },
     },
     y: {
      grid: {
       display: false,
      },
      ticks: {
       font: {
        size: 20,
        weight: "bold",
       },
      },
     },
    },
   },
   data: {
    labels: ["10", "9", "8", "7", "6", "5", "4", "3", "2", "1", "0"],
    datasets: [
     {
      data: data,
      backgroundColor: createColors(),
     },
    ],
   },
  });
 }, []);

 return (
  <div className="w-full h-full flex mx-auto my-auto">
   <canvas id="myChart" className="h-full w-full"></canvas>
  </div>
 );
};

export default RatingChart;
