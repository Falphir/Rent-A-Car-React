import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/pages/Home';
import './App.css';
import 'antd/dist/antd.css';
import Dashboard from './components/pages/Dashboard';
import CarDetails from './components/pages/CarDetails';
import Cars from './components/Tables/cars/Cars';
import CarsForm from './components/pages/AddCar';
import Login from './components/pages/Login';
import Users from './components/Tables/users/Users';
import Reserves from './components/Tables/reserves/Reserves';
import ReservesForm from './components/pages/AddReserve';
import AllCarsList from './components/Cards/allCarsList/Cars';
import SearchCarsList from './components/Cards/searchCarsList/Cars';
import Register from './components/pages/Register';
import AdminRegister from './components/pages/AdminRegister';
import DashboardEditor from './components/pages/DashboardEditor';
import MyReserves from './components/pages/MyReservesPage';


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' exact element={<Home />} />
        <Route path='/login' exact element={<Login />}></Route>
        <Route path='/register' exact element={<Register />}></Route>
        <Route path='/admin/register' exact element={<AdminRegister />}></Route> 
        <Route path='/dashboard' exact element={<Dashboard />} />
        <Route path='/dashboardeditor' exact element={<DashboardEditor />} /> 
        {/* <Route path='/cars' exact element={<Cars />}></Route> */}
        <Route path='/cars/:carId' exact element={<CarDetails />}></Route>
        <Route path='/cars/search/:description' exact element={<SearchCarsList />}></Route>
        {/* <Route path='/users' exact element={<Users />}></Route> */}
        <Route path='/carsform' exact element={<CarsForm></CarsForm>}></Route>
        <Route path='/reserves' exact element={<Reserves></Reserves>}></Route>
        <Route path='/myreserves' exact element={<MyReserves></MyReserves>}></Route> 
        <Route path='/reserves/:carId' exact element={<ReservesForm></ReservesForm>}></Route> 
        <Route path='/carList' exact element={<AllCarsList></AllCarsList>}></Route> 
        {/* <Route path='/myfavorites' exact element={<MyFavorites></MyFavorites>}></Route>  */}
        {/* <Route path='/favorites/:carId' exact element={<FavoritesForm></FavoritesForm>}></Route> */}
      </Routes>
    </>
  );
}

export default App;
