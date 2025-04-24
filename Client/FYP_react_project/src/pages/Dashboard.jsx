/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from "react";
import Sidebar from "../common/Sidebar";
import Navbar from "../common/Navbar";
import Chart from "react-apexcharts";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Dashboard({ setActivePage }) {
  setActivePage("dashboard");

  const [studentCount, setStudentCount] = useState(null);
  const [conductCount, setConductCount] = useState(0);
  const [incidentCategories, setIncidentCategories] = useState([]);
  const [incidentCounts, setIncidentCounts] = useState([]);
  const [error, setError] = useState(null);
  const [negativeStudents, setNegativeStudents] = useState([]);

useEffect(() => {
  const fetchNegativeConductStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8084/students-with-negative-conduct", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Negative Conduct Students:", response.data);
      setNegativeStudents(response.data);
    } catch (error) {
      console.error("Failed to fetch students with negative conduct:", error);
    }
  };
  fetchNegativeConductStudents();
}, []);


  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        const token = localStorage.getItem("token"); // Get the JWT token from local storage
        const response = await axios.get("http://localhost:8084/students/count", {
          headers: {
            Authorization: `Bearer ${token}`, // Make sure "token" is the correct key where you store the JWT
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

  useEffect(() => {
    const fetchConductCount = async () => {
      try {
        const response = await axios.get("http://localhost:8084/conduct-details/count", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("Conduct Reported Count:", response.data);
        setConductCount(response.data.count);
      } catch (error) {
        console.error("Failed to fetch conduct report count:", error);
        setError("Failed to fetch conduct report count");
      }
    };
    fetchConductCount();
  }, []);

  useEffect(() => {
    const fetchIncidentCounts = async () => {
      try {
        const response = await axios.get("http://localhost:8084/conduct-details/nature-counts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("Incident Counts by Nature:", response.data);

        // Assuming response.data is an array like [{ nature_of_incident: 'Bullying', incident_count: 5 }, ...]
        const categories = response.data.map(item => item.nature_of_incident);
        const counts = response.data.map(item => item.incident_count);

        console.log("Categories:", categories);
        console.log("Counts:", counts);

        setIncidentCategories(categories);
        setIncidentCounts(counts);
      } catch (error) {
        console.error("Failed to fetch incident counts:", error);
        setError("Failed to fetch incident counts");
      }
    };
    fetchIncidentCounts();
  }, []);

  const cardsData = [
    {
      title: "Registered Students",
      ico: "groups",
      counts: studentCount,
      color: "#246dec",
      link: "/system/overview",
    },
    {
      title: "Reported Incidents",
      ico: "notifications",
      counts: conductCount,
      color: "#367952",
      link: "/system/incidents",
    },
  ];

  const incidentChartOptions = {
    series: [
      {
        data: incidentCounts.length > 0 ? incidentCounts : [0], 
      },
    ],
    option: {
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false,
        },
      },
      colors: ["#246dec", "#cc3c43", "#367952", "#f5b74f", "#4f35a1", "#cc3c43"],
      plotOptions: {
        bar: {
          distributed: true,
          borderRadius: 4,
          borderRadiusApplication: "end",
          horizontal: false,
          columnWidth: "60%",
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      xaxis: {
        categories: incidentCategories.length > 0 ? incidentCategories : ["No Data"], // Dynamic x-axis categories
      },
      yaxis: {
        title: {
          text: "Number of Reported Incidents",
        },
      },
    },
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

      <div className="charts">
        <div className="charts-card">
          <p className="chart-title">REPORTED INCIDENTS</p>
          <Chart type="bar" height={incidentChartOptions.option.height} options={incidentChartOptions.option} series={incidentChartOptions.series} />
        </div>
        <div className="charts-card">
          <p>Students with Negative incidents</p>
          <table>
  <thead>
    <tr>
      <th>Student ID</th>
      <th>Student Names</th>
      <th>Conduct Type</th>
      <th>Nature Of Incident</th>
      <th>Action taken</th>
    </tr>
  </thead>
  <tbody>
    {negativeStudents.length === 0 ? (
      <tr>
        <td colSpan="5" style={{ textAlign: "center" }}>No students found with negative conduct</td>
      </tr>
    ) : (
      negativeStudents.map((student, index) => (
        <tr key={index}>
          <td>{student.student_id}</td>
          <td>{student.firstname} {student.middlename}</td>
          <td>{student.type_of_conduct}</td>
          <td>{student.nature_of_incident}</td>
          <td>{student.action_taken}</td>
        </tr>
      ))
    )}
  </tbody>
</table>
        </div>
      </div>
    </>
  );
}

function Card({ counts, title, ico, color, link }) {
  return (
    <Link to={link} style={{ textDecoration: "none" }}>
      <div className="card" style={color ? { borderLeft: "7px solid " + color } : null}>
        <div className="card-inner">
          <p className="text-primary">{title}</p>
          <span className="material-icons-outlined text-blue">{ico}</span>
        </div>
        <span className="counts">{counts}</span>
      </div>
    </Link>
  );
}
