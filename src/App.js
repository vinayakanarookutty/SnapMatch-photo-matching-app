
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import FileUpload from "./FileUpload";
import Process from "./Process";
import Photo from "./Photo";
function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/fileupload" element={<FileUpload/>}/>
        <Route path="/photo" element={<Photo/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
