
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import FileUpload from "./FileUpload";
import Process from "./Process";
function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/fileupload" element={<FileUpload/>}/>
        <Route path="/process" element={<Process/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
