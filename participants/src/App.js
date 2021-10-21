import { Container } from 'react-bootstrap'
import { BrowserRouter } from 'react-router-dom'
import { AlertComponent } from './components/AlertComponent'
import { Header } from './components/Header'
import { Loader } from './components/Loader'
import { Routes } from "./Router"

function App() {
    return (
        <BrowserRouter>
            <Loader />
            <AlertComponent />
            <Header />
            <Routes />
        </BrowserRouter>
    )
}

export default App
