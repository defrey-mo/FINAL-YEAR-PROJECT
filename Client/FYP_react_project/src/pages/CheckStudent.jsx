
import React from "react";
import "../CSS/check.css";


export default function CheckStudent({ setActivePage }) {
  setActivePage("check-student");

  return (
    <>
      <div className="checking">
        <h1 className="checkin">Check Student</h1>
        <form>
        <span>
            <label htmlFor="firstname">Student Number</label>
            <input type="text" name="first-name" id="first-name" />
          </span>
          <span>
            <label htmlFor="firstname">First Name</label>
            <input type="text" name="first-name" id="first-name" />
          </span>
          <span>
            <label htmlFor="firstname">Middle Name</label>
            <input type="text" name="first-name" id="first-name" />
          </span>
          <span>
            <label htmlFor="firstname">Surname</label>
            <input type="text" name="first-name" id="first-name" />
          </span>
          <button>Submit</button>
        </form>
      </div>
    </>
  );
}
