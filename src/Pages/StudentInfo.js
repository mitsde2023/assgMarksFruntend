import axios from "axios";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import Pass from "./Pass";
const StudentInfo = () => {
  const [searchValues, setSearchValues] = useState({
    // email: '',
    registration_number: "",
  });
  const [data, setData] = useState([]);
  const [marksData, setMarksData] = useState([]);
  const [batchData, setBatchData] = useState([]);
  const [subjectId, setsubjectId] = useState("");
  const [loading, setLoading] = useState("");
  const [verificationNumber, setVerificationNumber] = useState('');
  const [showDownloadButton, setShowDownloadButton] = useState(false);
  const [dwn, setDwn] = useState(false)

  const handlePassword = (val) => {
    setVerificationNumber(val);
    setShowDownloadButton(val === Pass);
  };

  const handeldownloadMarks = () => {
    setDwn(true)
  }
  const handelfalseMarks = () => {
    setDwn(false)
  }

  useEffect(() => {
    const fetchData = async () => {
      if (
        searchValues.registration_number.length >= 2 &&
        searchValues.registration_number.length <= 14
      ) {
        try {
          const resData = await axios.get(
            "http://65.1.54.123:7000/api/marks/student-marks",
            {
              params: searchValues,
            }
          );
          if (resData) {
            setData(resData.data);
            setMarksData(resData.data.flattenedData);
            toast.success(`Student Data successfully..!`, {
              autoClose: 1100,
            });
          }
        } catch (error) {
          setMarksData("");
          // console.log(error.response.data.message)
        }
      } else {
        setMarksData("");
      }
    };
    fetchData();
    if (searchValues.registration_number.length > 0) {
      setLoading(
        `Enter Correct registration_number Student Not present with ${searchValues.registration_number} `
      );
    } else {
      setLoading(``);
    }
  }, [searchValues]);

  useEffect(() => {
    if (marksData.length > 0) {
      setsubjectId(marksData[0].subject_id);
    }
  }, [data, marksData]);

  useEffect(() => {
    const FetchBatchData = async () => {
      if (subjectId >= 1) {
        try {
          const batchData = await axios.get(
            `http://65.1.54.123:7000/api/marks/getBatchName/${subjectId}`
          );
          const batch = batchData.data.subject;
          setBatchData(batch);
        } catch (error) {
          setBatchData("");
        }
      }
    };
    FetchBatchData();
  }, [marksData, subjectId]);

  const handleSearchChange = (field, value) => {
    setSearchValues((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-GB');



  const { name, email, registration_number, contact_number } = data;

  const downloadMarks = () => {
    const basicData = [
      {
        RegistrationNumber: data.registration_number,
      },
    ];
    const excelData = prepareDataForExcelSing(data);

    // Use the spread operator to combine basicData and excelData
    const ws = XLSX.utils.json_to_sheet([...basicData, ...excelData]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${registration_number}_marks_data.xlsx`);
  };

  const prepareDataForExcelSing = (data) => {
    return data.flattenedData.map((item, index) => ({
      Subject: item.subject_name,
      "Assignment 1": item.assignments[0].mk !== null ? item.assignments[0].mk : "N/A",
      Atps1: item.assignments[0].atmpt,
      "Assignment 2": item.assignments[1].mk !== null ? item.assignments[1].mk : "N/A",
      Atps2: item.assignments[1].atmpt,
      Total: item.assignments.reduce(
        (acc, assignment) => acc + (Number(assignment.mk) || 0),
        0
      ),
      "Updated ": new Date(item.updatedAt).toLocaleDateString(),
    }));
  };


  const prepareDataForExcel = (data) => {
    return data.map((item) => ({
      RegistrationNumber: item.registration_number || "N/A",
      Subject: item.subject_name || "N/A",
      "Assignment 1": item.assignments[0]?.mk || "N/A",
      Atps1: item.assignments[0]?.atmpt || "N/A",
      "Assignment 2": item.assignments[1]?.mk || "N/A",
      Atps2: item.assignments[1]?.atmpt || "N/A",
      Total: item.assignments.reduce(
        (acc, assignment) => acc + (Number(assignment.mk) || 0),
        0
      ),
      Updated: new Date(item.updatedAt).toLocaleDateString() || "N/A",
    }));
  };

  const downloadAllStudentsMarks = async () => {
    try {
      // Fetch FlattenedDataModel data
      const marksResponse = await axios.get(
        "http://65.1.54.123:7000/api/marks/getAllFlattenedData",
        { responseType: "json" }
      );
      const marksData = marksResponse.data;

      // Fetch All_Students data
      const studentsResponse = await axios.get(
        "http://65.1.54.123:7000/api/student/getAllStudents",
        { responseType: "json" }
      );
      const studentsData = studentsResponse.data;

      // Combine data based on user_id
      const combinedData = marksData.map((marksItem) => {
        const matchingStudent = studentsData.find(
          (student) => student.user_id === marksItem.user_id
        );

        return {
          ...marksItem,
          registration_number: matchingStudent
            ? matchingStudent.registration_number
            : "N/A",
        };
      });

      console.log("Combined Data:", combinedData);

      // Prepare data for Excel
      const excelData = prepareDataForExcel(combinedData);

      // Create and download Excel file
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      const fileName = `${formattedDate}_all_Student_marks_data.xlsx`;

      // Use XLSX.write to create an array buffer
      const arrayBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

      // Convert array buffer to Blob
      const blob = new Blob([arrayBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Create a download link
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      alert('File Download Successfully ..!')
      setDwn(false)

    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div className="container fount" style={{ minHeight: "90vh" }}>
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
            alt="logo"
          />
          {!marksData ? <><div className="col-md-2 mt-1">
            <button className="btn btn-primary mt-1" onClick={handeldownloadMarks}>Downloads</button>
          </div></> : <></>}
        </div>
      </div>

      <div className="row p-1 border mt-1">

        {!dwn && (<>
          <div className="col-md-4 mt-1">
            <strong className="p-1">Search Assignment Marks</strong>
            <div className="d-flex m-1">
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

          </div>  </>)}


        {dwn && (
          <>
            {!marksData ? (
              <>
                {" "}
                <div className="col-md-12 mt-1">
                  <strong className="p-1">For download all students Assignment Marks enter your password provided from admin</strong>
                  <div className="d-flex m-1">
                    <input
                      type="password"
                      placeholder="password"
                      className="form-control"
                      value={verificationNumber}
                      onChange={(e) => handlePassword(e.target.value)}
                    />

                    {/* Conditionally render the Download button */}
                    {showDownloadButton && (
                      <>
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={downloadAllStudentsMarks}
                        >
                          Download
                        </button>
                      </>

                    )}

                  </div>
                  {!showDownloadButton && (
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={handelfalseMarks}
                    >
                      i don't know password contact Admin
                    </button>

                  )}


                </div>
              </>
            ) : (
              <></>
            )}

          </>
        )}


        {/* {!marksData ? <><div className="col-md-2 mt-1">
          <button className="btn btn-primary mt-1" onClick={handeldownloadMarks}>Downloads</button>
        </div></> : <></>} */}
        {marksData ? (
          <>
            <div className="col-md-4 mt-1">
              <div className="card rounded">
                <div className="card-body text-black">
                  <div className="d-flex justify-content-between align-items-center">
                    <strong className="start">Name:</strong>
                    <div className="end">{name}</div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <strong className="start">Email:</strong>
                    <div className="end">{email}</div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <strong className="start">Registration Number:</strong>
                    <div className="end">{registration_number}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 mt-1">
              <div className="card rounded">
                <div className="card-body text-black">
                  <div className="d-flex justify-content-between align-items-center">
                    <strong className="start">Contact Number:</strong>
                    <div className="end">{contact_number}</div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <strong className="start">Batch:</strong>
                    <div className="end">{batchData.batch_name}</div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <strong className="start">Program:</strong>
                    <div className="end">{batchData.program_name}</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}

        <div className="col-md-1 mt-2">
          {marksData ? (
            <>
              <div
                className="btn-group btn-group-sm"
                role="group"
                aria-label="Small button group"
              >
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={downloadMarks}
                >
                  Download
                </button>
              </div>
            </>
          ) : (
            <> </>
          )}
        </div>
      </div>



      {marksData ? (
        <>
          <div className="row mb-2">
            <div className="col-md-12 mt-1">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Assig-1</th>
                    {/* <th>Mark</th> */}
                    <th>Atps</th>
                    {/* <th>updated 1</th> */}
                    <th>Assig-2</th>
                    {/* <th>Mark</th> */}
                    <th>Atps</th>
                    <th>Total</th>
                    <th>updated </th>
                  </tr>
                </thead>
                <tbody>
                  {data.flattenedData ? (
                    data.flattenedData.map((item, rowIndex) => {
                      let totalMk = 0;
                      return (
                        <tr key={`subject-${rowIndex}`}>
                          <td>{item.subject_name}</td>
                          {item.assignments.map((assignment, index) => {
                            totalMk +=
                              Number(assignment.mk) !== null
                                ? Number(assignment.mk)
                                : 0;
                            return (
                              <React.Fragment key={index}>
                                {/* <td>{assignment.assignment}</td> */}
                                <td>
                                  {assignment.mk !== null
                                    ? assignment.mk
                                    : "N/A"}
                                </td>
                                <td>{assignment.atmpt}</td>
                              </React.Fragment>
                            );
                          })}

                          <td>{totalMk}</td>
                          <td>
                            {new Date(item.updatedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8">{`No data available for ${searchValues}`}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="row">
            <div className="col-md-4"></div>
            <div className="col-md-4 mt-2">
              <h6 className="text-danger p-2 rounded">{loading}</h6>
            </div>
            <div className="col-md-4"></div>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentInfo;
