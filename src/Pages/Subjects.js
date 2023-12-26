// StudentInfo.js (or your component file)
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Subject = () => {
    const [subjectClassData, setSubjectClassData] = useState([]);

    useEffect(() => {
        axios.get('http://65.1.54.123:7000/api/student/subject-class')
            .then(response => setSubjectClassData(response.data))
            .catch(error => console.error('Error fetching data:', error.message));
    }, []);

    const handleUpdate = (subjectId, subjectName) => {
        const updateOne = axios.post(`http://65.1.54.123:7000/api/marks/subject_marks_update/${subjectId}/${subjectName}`);
        updateOne.then(response => {
            console.log(response.data);
            console.log(`Updating subject ${subjectId}: ${subjectName}`);
        }).catch(error => {
            console.error('Error updating data:', error.message);
        });
    };

    return (
        <div>
            <h2>Subject Class Data</h2>
            <table className='table table-bordered'>
                <thead>
                    <tr>
                        <th>Subject Id</th>
                        <th>Subject Name</th>
                        <th>Program</th>
                        <th>Batch</th>
                        <th>Update</th>
                    </tr>
                </thead>
                <tbody>
                    {subjectClassData.map(subject => (
                        <tr key={subject.subject_id}>
                            <td>{subject.subject_id}</td>
                            <td>{subject.subject_name}</td>
                            <td>{subject.program_id}</td>
                            <td>{subject.batch_id}</td>
                            <td>
                                <button onClick={() => handleUpdate(subject.subject_id, subject.subject_name)}>
                                    Update
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Subject;
