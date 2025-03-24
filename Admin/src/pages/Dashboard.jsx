/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import Sidebar from "../common/Sidebar";
import Navbar from "../common/Navbar";
import Chart from "react-apexcharts";

export default function Dashboard({ setActivePage }) {
  setActivePage("dashboard");

  const cardsData = [
    {
      title: "Registered Schools",
      ico: "groups",
      counts: 12250,
      color: "#246dec",
    },
    
    {
      title: "Registered Users",
      ico: "groups",
      counts: 250,
      color: "#367952",
    },
  ];


  const areaChartOptions = {
    series: [
      {
        data: [10, 8, 6, 2, 8]
      }
    ],
    option: {
      chart: {
        type: 'bar',  // Correct placement
        height: 350,
        toolbar: {
          show: false
        },
      },
      colors: [
        "#246dec",
        "#cc3c43",
        "#367952",
        "#f5b74f",
        "#4f35a1"  
      ],
      plotOptions: {
        bar: {
          distributed: true,
          borderRadius: 4,
          borderRadiusApplication: 'end',
          horizontal: false,
          columnWidth: '60%',
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      xaxis: {
        categories: ["2023", "2022", "2021", "2020", "2019"],
      },
      yaxis: {
        title: {
          text: "Total Number of Schools Registered"
        }
      }
    }
  };
  
  const someChartOptions = {
    series: [
      {
        data: [10, 8, 6]
      }
    ],
    option: {
      chart: {
        type: 'bar',  // Correct placement
        height: 350,
        toolbar: {
          show: false
        },
      },
      colors: [
        "#246dec",
        "#cc3c43",
        "#367952"  
      ],
      plotOptions: {
        bar: {
          distributed: true,
          borderRadius: 4,
          borderRadiusApplication: 'end',
          horizontal: false,
          columnWidth: '60%',
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      xaxis: {
        categories: ["Admin", "Registrars", "Teachers"],
      },
      yaxis: {
        title: {
          text: "Total Number of Users Registered"
        }
      }
    }
  };
  
  return (
    <>
      {/* <div className="main-title">
        <p className="font-weight-bold">DASHBOARD</p>
      </div> */}
      {/* cards */}
      <div className="main-cards">
        {cardsData.map((item, index) => {
          return (
            <Card
              title={item.title}
              ico={item.ico}
              counts={item.counts}
              color={item.color}
              key={index}
            />
          );
        })}
      </div>

      <div className="charts">
        <div className="charts-card">
          <p className="chart-title">SCHOOLS REGISTERED</p>
          {/* <div id="bar-chart"></div> */}
          <Chart type="bar" height={areaChartOptions.option.height} options={areaChartOptions.option} series={areaChartOptions.series}/>
        </div>
        <div className="charts-card">
          <p className="chart-title">REGISTERED USERS</p>
          <Chart type="bar" height={someChartOptions.option.height} options={someChartOptions.option} series={someChartOptions.series}/>
        </div>
      </div>
    </>
  );
}

function Card({ counts, title, ico, color }) {
  return (
    <div
      className="card"
      style={color ? { borderLeft: "7px solid " + color } : null}
    >
      <div className="card-inner">
        <p className="text-primary">{title}</p>
        <span className="material-icons-outlined text-blue">{ico}</span>
      </div>
      <span className="text-primary font-weight-bold">{counts}</span>
    </div>
  );
}
