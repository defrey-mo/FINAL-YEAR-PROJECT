import React from "react";
import Sidebar from "../common/Sidebar";
import Navbar from "../common/Navbar";
import Chart from "react-apexcharts";

export default function Dashboard({ setActivePage }) {
  setActivePage("dashboard");

  const cardsData = [
    {
      title: "Registered Students",
      ico: "groups",
      counts: 12250,
      color: "#246dec",
    },
    // {
    //   title: "New Students Registered",
    //   ico: "groups",
    //   counts: 250,
    //   color: "#f5b74f",
    // },
    {
      title: "Reported Cases",
      ico: "notifications",
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
          text: "Total Number of Students Registered"
        }
      }
    }
  };

  const someChartOptions = {
    series: [
      {
        data: [10, 8, 6, 2, 8, 7]
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
        "#4f35a1",
        "#cc3c43"  
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
        categories: ["Bullying", "Disruptive Behaviour", "Cheating", "Inciting Strike", "Respectfullness", "Leadership"],
      },
      yaxis: {
        title: {
          text: "Total Number of Registered Cases"
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
      <div class="main-cards">
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

      <div class="charts">
        <div class="charts-card">
          <p class="chart-title">STUDENTS REGISTERED</p>
          <Chart type="bar" height={areaChartOptions.option.height} options={areaChartOptions.option} series={areaChartOptions.series}/>
        </div>
        <div className="charts-card">
          <p className="chart-title">REPORTED CASES</p>
        <Chart type="bar" height={someChartOptions.option.height} options={someChartOptions.option} series={someChartOptions.series}/>
       </div>
      </div>
    </>
  );
}

function Card({ counts, title, ico, color }) {
  return (
    <div
      class="card"
      style={color ? { borderLeft: "7px solid " + color } : null}
    >
      <div class="card-inner">
        <p class="text-primary">{title}</p>
        <span class="material-icons-outlined text-blue">{ico}</span>
      </div>
      <span class="text-primary font-weight-bold">{counts}</span>
    </div>
  );
}
