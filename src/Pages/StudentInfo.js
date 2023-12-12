import axios from "axios";
import React, { useEffect, useState } from "react";

const StudentInfo = () => {
  const [searchValues, setSearchValues] = useState({
    email: "",
    registration_number: "",
  });
  const [data, setData] = useState([]);
  const [marksData, setMarksData] = useState([]);
  const [batchData, setBatchData] = useState([]);
  const [subjectId, setsubjectId] = useState("");

  const fetchData = async () => {
    try {
      const resData = await axios.get(
        "http://65.1.54.123/api/marks/student-marks",
        {
          params: searchValues,
        }
      );
      setData(resData.data);
      setMarksData(resData.data.flattenedData);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setData("");
      setMarksData("");
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchValues]);

  const FetchBatchData = async () => {
    try {
      const batchData = await axios.get(
        `http://65.1.54.123/api/marks/getBatchName/${subjectId}`
      );
      const batch = batchData.data.subject;
      setBatchData(batch);
    } catch (error) {
      setBatchData("");
    }
  };

  useEffect(() => {
    if (marksData.length > 0) {
      setsubjectId(marksData[0].subject_id);
    }
  }, [data, marksData]);

  useEffect(() => {
    FetchBatchData();
  }, [subjectId]);

  const handleSearchChange = (field, value) => {
    setSearchValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const handleSearchClick = () => {
    fetchData();
  };

  const {
    name,
    email,
    registration_number,
    user_username,
    contact_number,
    date,
  } = data;

  return (
    <div className="container fount">
      <div
        className="row rounded"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(252, 252, 252), rgb(247, 229, 215)",
        }}
      >
        <div className="d-flex justify-content-between">
          <img
            style={{ width: "170px" }}
            src="https://res.cloudinary.com/dtgpxvmpl/image/upload/v1702100329/mitsde_logo_vmzo63.png"
          />
          {/* <h3 className="text-center pt-2">MITSDE</h3> */}
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-6 mt-2">
          <div className="card rounded">
            <h5 class="card-header">Search Assignment Marks</h5>
          </div>
          <div className="d-flex m-2 justify-content-between">
            <input
              type="text"
              id="email"
              placeholder="Email"
              className="form-control"
              value={searchValues.email}
              onChange={(e) => handleSearchChange("email", e.target.value)}
            />
          </div>
          <div className="d-flex m-2">
            <input
              type="text"
              id="registration_number"
              placeholder="registration_number"
              className="form-control"
              value={searchValues.registration_number}
              onChange={(e) =>
                handleSearchChange("registration_number", e.target.value)
              }
            />
          </div>
          <button
            className="btn btn-primary mb-3 mt-3"
            onClick={handleSearchClick}
          >
            Search
          </button>

          <div className="card rounded">
            <h5 class="card-header">Basic info of Student</h5>
            <div className="card-body text-black">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <strong className="start">Name:</strong>
                <div className="end">{name}</div>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <strong className="start">Email:</strong>
                <div className="end">{email}</div>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <strong className="start">Registration Number:</strong>
                <div className="end">{registration_number}</div>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <strong className="start">Username:</strong>
                <div className="end">{user_username}</div>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <strong className="start">Contact Number:</strong>
                <div className="end">{contact_number}</div>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <strong className="start">Date:</strong>
                <div className="end">{date}</div>
              </div>
              {batchData ? (
                <>
                  <div className="d-flex justify-content-between align-items-center">
                    <strong className="start">Batch:</strong>
                    <div className="end">{batchData.batch_name}</div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <strong className="start">Program:</strong>
                    <div className="end">{batchData.program_name}</div>
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        {marksData ? (
          <>
            <div className="col-md-6 mt-2">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Assig_No</th>
                    <th>Mark</th>
                    <th>Atps</th>
                    <th>updated</th>
                  </tr>
                </thead>
                <tbody>
                  {data.flattenedData ? (
                    data.flattenedData.map((item, rowIndex) => (
                      <>
                        <tr key={`subject-${rowIndex}`}>
                          <td>{item.subject_name}</td>
                          <td>{item.assignments[0].assignment}</td>
                          <td>
                            {item.assignments[0].mk !== null
                              ? item.assignments[0].mk
                              : "N/A"}
                          </td>
                          <td>{item.assignments[0].atmpt}</td>
                          <td>
                            {new Date(item.updatedAt).toLocaleDateString()}
                          </td>
                        </tr>
                        {item.assignments.slice(1).map((assignment, index) => (
                          <tr key={index}>
                            <td></td>
                            <td>{assignment.assignment}</td>
                            <td>
                              {assignment.mk !== null ? assignment.mk : "N/A"}
                            </td>
                            <td>{assignment.atmpt}</td>
                            <td>
                              {new Date(item.updatedAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8">No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default StudentInfo;
