import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import StudentInfo from './Pages/StudentInfo';
import Subject from './Pages/Subjects'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  


  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<StudentInfo />} />
          <Route exact path="/update-subject-marks" element={<Subject />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
