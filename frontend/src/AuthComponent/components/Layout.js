import { Outlet } from "react-router-dom"
import { Link } from 'react-router-dom';
import { useContext } from "react";
import { ButtonContext } from "./LoginContext";


const Layout = () => {
    const { buttonState, setButtonState } = useContext(ButtonContext);

    const handleLogout = () => {
        setButtonState(false);
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
    };

    return (

        <div>
            {buttonState ? (
                <div className="mt-3 mx-4">
                    <button className="btn btn-light btn-lg" onClick={handleLogout}>Logout</button>
                    <Link to='/basket'><button className="btn btn-light btn-lg mx-2">Basket</button></Link>
                    <Link to='/orders'><button className="btn btn-light btn-lg">My orders</button></Link>
                    <Link to='/'><button className="btn btn-light btn-lg mx-2">Home</button></Link>
                </div>
            ) : (
                <div className="mt-3 mx-4">
                    <Link to='/login'><button className="btn btn-light btn-lg" href="#"
                        data-abc="true">Login</button></Link>
                    <Link to='/'><button className="btn btn-light btn-lg mx-2">Home</button></Link>
                </div>
            )}
            <Outlet />
        </div>


    )
}

export default Layout