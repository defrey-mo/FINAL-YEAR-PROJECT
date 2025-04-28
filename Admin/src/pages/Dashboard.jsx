/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Sidebar from "../common/Sidebar";
import Navbar from "../common/Navbar";
import Chart from "react-apexcharts";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Dashboard({ setActivePage }) {
  setActivePage("dashboard");

  const [schoolCount, setSchoolCount] = useState(null);
  const [staffCount, setStaffCount] = useState(null);
  const [error, setError] = useState(null);
  const [staffRoles, setStaffRoles] = useState([]);
  const [staffCounts, setStaffCounts] = useState([]);
  const [schoolTypes, setSchoolTypes] = useState([]);
  const [schoolCounts, setSchoolCounts] = useState([]);



  useEffect(() => {
    const fetchSchoolCount = async () => {
      try {
        const response = await axios.get("http://localhost:8084/schools/count");
        console.log("School Count Response:", response.data); 
        setSchoolCount(response.data.count); 
      } catch (error) {
        console.error("Failed to fetch school count:", error); 
        setError("Failed to fetch school count");
      }
    };
    fetchSchoolCount();
  }, []);

  useEffect(() => {
    const fetchStaffCount = async () => {
      try {
        const response = await axios.get("http://localhost:8084/staff/count");
        console.log("Staff Count Response:", response.data); 
        setStaffCount(response.data.count); 
      } catch (error) {
        console.error("Failed to fetch school count:", error); 
        setError("Failed to fetch school count");
      }
    };
    fetchStaffCount();
  }, []);

  useEffect(() => {
    const fetchStaffRoleCounts = async () => {
      try {
        const response = await axios.get("http://localhost:8084/staff/role-counts"); 
        console.log("Staff Role Counts Response:", response.data);
  
        const roles = response.data.map(item => item.role);
        const counts = response.data.map(item => item.count);
  
        setStaffRoles(roles);
        setStaffCounts(counts);
      } catch (error) {
        console.error("Failed to fetch staff role counts:", error);
        setError("Failed to fetch staff role counts");
      }
    };
  
    fetchStaffRoleCounts();
  }, []);
  

  useEffect(() => {
    const fetchSchoolTypeCounts = async () => {
      try {
        const response = await axios.get("http://localhost:8084/schools/type-counts");
        console.log("School Type Counts Response:", response.data);
  
        const types = response.data.map(item => `${item.school_type} - ${item.school_system}`);
        const counts = response.data.map(item => item.count);
  
        setSchoolTypes(types);
        setSchoolCounts(counts);
      } catch (error) {
        console.error("Failed to fetch school type counts:", error);
        setError("Failed to fetch school type counts");
      }
    };
  
    fetchSchoolTypeCounts();
  }, []);
  
  
  const cardsData = [
    {
      title: "Registered Schools",
      ico: "groups",
      counts: schoolCount,
      color: "#246dec",
    },
    
    {
      title: "Registered Users",
      ico: "groups",
      counts: staffCount,
      color: "#367952",
    },
  ];


  const areaChartOptions = {
    series: [
      {
        data: schoolCounts
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
        categories: schoolTypes
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
        data: staffCounts
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
        "#4c49ea" // add more if needed
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
        categories: staffRoles
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
