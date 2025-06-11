/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "../CSS/overview.css";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Delete() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal1, setShowModal1] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [staffToToggle, setStaffToToggle] = useState(null);
  const [newStatus, setNewStatus] = useState(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found! User not authenticated.");
      return;
    }

    axios
      .get("http://localhost:8084/staff-view", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error("Error fetching staff:", err);
        if (err.response && err.response.status === 401) {
          alert("You are not authorized to view this data. Please log in.");
        }
      });
  };

  const toggleStaffStatus = (staffId, isActive, event) => {
    event.stopPropagation();
    setStaffToToggle(staffId);
    setNewStatus(!isActive);
    setShowModal1(true);
  };

  const confirmStatusToggle = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found! User not authenticated.");
      return;
    }

    axios
      .patch(
        `http://localhost:8084/toggle-staff-status/${staffToToggle}`,
        { isActive: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        fetchStaff();
        setShowModal1(false);
        setStaffToToggle(null);
        setNewStatus(null);
        alert(
          `Staff has been ${
            newStatus ? "activated" : "deactivated"
          } successfully.`
        );
      })
      .catch((err) => {
        console.error("Error updating staff status", err);
        alert("An error occurred while updating the staff status.");
      });
  };

  const cancelToggle = () => {
    setShowModal1(false);
    setStaffToToggle(null);
    setNewStatus(null);
  };

  const confirmDeletion = () => {
      const token = localStorage.getItem("token");
  
      if (!token) {
        console.error("No token found! User not authenticated.");
        return;
      }
  
      axios
        .delete(`http://localhost:8084/staff-delete/${staffToDelete}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          // Remove deleted student from data
          setData((prevData) =>
            prevData.filter((staff) => staff.staff_id !== staffToDelete)
          );
          setShowModal(false);
          setStaffToDelete(null);
          alert("Staff deleted successfully");
        })
        .catch((err) => {
          console.error("Error deleting staff:", err);
          alert("An error occurred while deleting the staff.");
        });
    };
  
    const cancelDeletion = () => {
      setShowModal(false);
      setStaffToDelete(null);
    };

    const deleteStaff = (staffId, event) => {
    event.stopPropagation();
    setStaffToDelete(staffId);
    setShowModal(true);
  };


  return (
    <>
      <p className="para">Staff List</p>
      <table id="table">
        <thead>
          <tr>
            <th>Staff ID</th>
            <th>First Name</th>
            <th>Middle Name</th>
            <th>Surname</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Address</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((staff, index) => (
              <tr key={index}>
                <td>{staff.staff_id}</td>
                <td>{staff.firstname}</td>
                <td>{staff.middlename}</td>
                <td>{staff.surname}</td>
                <td>{staff.phone}</td>
                <td style={{ textTransform: "none" }}>{staff.email}</td>
                <td>{staff.home_address}</td>
                <td>{staff.role}</td>
                <td>{staff.isActive ? "Active" : "Inactive"}</td>
                <td>
                  <button
                    className="update"
                    onClick={(event) =>
                      toggleStaffStatus(staff.staff_id, staff.isActive, event)
                    }
                  >
                    {staff.isActive ? "Deactivate" : "Activate"}
                  </button>

                  <button className="delete" onClick={(event) => deleteStaff(staff.staff_id, event)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10">No staff found for this school.</td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to delete this student? You will no longer see their data.</p>
            <div className="modal-buttons">
              <button onClick={confirmDeletion}>Yes, Delete</button>
              <button onClick={cancelDeletion}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showModal1 && (
        <div className="modal-overlay">
          <div className="modal">
            <p>
              Are you sure you want to {newStatus ? "activate" : "deactivate"}{" "}
              this staff member?
            </p>
            <div className="modal-buttons">
              <button onClick={confirmStatusToggle}>
                Yes, {newStatus ? "Activate" : "Deactivate"}
              </button>
              <button onClick={cancelToggle}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
