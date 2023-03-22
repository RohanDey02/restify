import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import HomepageWrapper from './pages/Homepage';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
	return <>
		<Router>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/home" element={<HomepageWrapper pageSize={10} />} />
				<Route path="/register" element={<Register />} />
			</Routes>
		</Router>
	</>
}

export default App;
