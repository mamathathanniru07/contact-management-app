import {BrowserRouter, Route, Routes} from 'react-router-dom'
import './App.css';
import Customers from './pages/Customers';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route  path='/' element={<Customers/>}/>
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
