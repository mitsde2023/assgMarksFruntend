import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import StudentInfo from './Pages/StudentInfo';
import Subject from './Pages/Subjects'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<StudentInfo />} />
          <Route exact path="/update-subject-marks" element={<Subject />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
