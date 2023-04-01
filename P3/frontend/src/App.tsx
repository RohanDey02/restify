import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import HomepageWrapper from './pages/Homepage';
import Login from './pages/Login';
import Property from './pages/Property';
import Register from './pages/Register';
import MyReservations from './pages/Reservations/MyReservations';

function App() {
	return <>
		<Router>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/home" element={<HomepageWrapper pageSize={10} />} />
				<Route path="/register" element={<Register />} />
				<Route path="/property" element={<Property />} />
				<Route path="/myreservations" element={<MyReservations />} />
			</Routes>
		</Router>
	</>
}

export default App;
