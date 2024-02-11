
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import FileUpload from "./FileUpload";

import Photo from "./Photo";
function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/fileupload" element={<FileUpload/>}/>
        <Route path="/" element={<Photo/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
