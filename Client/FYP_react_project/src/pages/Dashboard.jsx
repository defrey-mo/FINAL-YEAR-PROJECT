/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Sidebar from "../common/Sidebar";
import Navbar from "../common/Navbar";
import Chart from "react-apexcharts";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Dashboard({ setActivePage }) {
  useEffect(() => {
    setActivePage("dashboard");
  }, [setActivePage]);

  const [studentCount, setStudentCount] = useState(null);
  const [conductCount, setConductCount] = useState(0);
  const [incidentCategories, setIncidentCategories] = useState([]);
  const [incidentCounts, setIncidentCounts] = useState([]);
  const [error, setError] = useState(null);
  const [negativeStudents, setNegativeStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    const fetchNegativeConductStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8084/students-with-negative-conduct", {
          headers: { Authorization: `Bearer ${token}` },
        });
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
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8084/students/count", {
          headers: { Authorization: `Bearer ${token}` },
        });
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
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
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
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const categories = response.data.map(item => item.nature_of_incident);
        const counts = response.data.map(item => item.incident_count);
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

  const filteredData = negativeStudents.filter((student) =>
    student.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_id.toString().includes(searchTerm)
  );

  const incidentChartOptions = {
    series: [
      {
        data: incidentCounts.length > 0 ? incidentCounts : [0],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        toolbar: { show: false },
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
      dataLabels: { enabled: false },
      legend: { show: false },
      xaxis: {
        categories: incidentCategories.length > 0 ? incidentCategories : ["No Data"],
      },
      yaxis: {
        title: { text: "Number of Reported Incidents" },
      },
    },
  };

  return (
    <>
      <div className="main-cards">
        {cardsData.map((item, index) => (
          <Card
            key={index}
            title={item.title}
            ico={item.ico}
            counts={item.counts}
            color={item.color}
            link={item.link}
          />
        ))}
      </div>

      <div className="charts">
        <div className="charts-card">
          <p className="chart-title">Reported Incidents</p>
          <Chart
            type="bar"
            height={incidentChartOptions.options.chart.height}
            options={incidentChartOptions.options}
            series={incidentChartOptions.series}
          />
        </div>

        <div className="charts-card">
          <div className="header-row">
            <p>Negative incidents</p>
            <div className="dashboard-search-wrapper">
              <input
                type="text"
                placeholder="Search..."
                className="search-box"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="search-icon-button">🔍</button>
            </div>
          </div>

          <div className="negative-table-container">
            <table className="negative-table">
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
                {filteredData.length > 0 ? (
                  filteredData.map((student, index) => (
                    <tr key={index}>
                      <td>{student.student_id}</td>
                      <td>{student.firstname} {student.middlename}</td>
                      <td>{student.type_of_conduct}</td>
                      <td>{student.nature_of_incident}</td>
                      <td>{student.action_taken}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No students found with negative conduct
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
