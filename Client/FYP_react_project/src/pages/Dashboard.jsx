/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Sidebar from "../common/Sidebar";
import Navbar from "../common/Navbar";
import Chart from "react-apexcharts";
import axios from 'axios';
import { Link } from "react-router-dom";

export default function Dashboard({ setActivePage }) {
  setActivePage("dashboard");

  const [studentCount, setStudentCount] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        const token = localStorage.getItem("token"); // Get the JWT token from local storage
        const response = await axios.get("http://localhost:8084/students/count", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Make sure "token" is the correct key where you store the JWT
          },
        });

        console.log("Student Count Response:", response.data);  // Log the response to verify structure

        setStudentCount(response.data.count);
      } catch (error) {
        console.error("Failed to fetch student count:", error);
        setError("Failed to fetch student count");
      }
    };
  
    fetchStudentCount();
  }, []);
  

  const cardsData = [
    {
      title: "Registered Students",
      ico: "groups",
      counts:  studentCount,
      color: "#246dec",
      link: "/system/overview"
    },
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
        type: 'bar', 
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
        type: 'bar', 
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
          text: "Total Number of Reported Incidents/Cases"
        }
      }
    }
  };
  
  return (
    <>
      <div className="main-cards">
        {cardsData.map((item, index) => {
          return (
            <Card
              title={item.title}
              ico={item.ico}
              counts={item.counts}
              color={item.color}
              link={item.link}
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

function Card({ counts, title, ico, color, link }) {
  return (
    <Link to={link} style={{ textDecoration: 'none' }}>
      <div
      class="card"
      style={color ? { borderLeft: "7px solid " + color } : null}
    >
      <div className="card-inner">
        <p class="text-primary">{title}</p>
        <span class="material-icons-outlined text-blue">{ico}</span>
      </div>
      <span className="counts">{counts}</span>
    </div>
    </Link>
  );
}
