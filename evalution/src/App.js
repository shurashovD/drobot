import React from 'react'
import { BrowserRouter } from "react-router-dom"
import { Alert } from "./compenets/Alert"
import { Routes } from "./Routes"

function App() {
  return (
    <BrowserRouter>
        <Alert />
        <Routes />
    </BrowserRouter>
  );
}

export default App;
