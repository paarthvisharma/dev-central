import "./index.css";
import { useState, useEffect } from "react";
import userServices from "../../services/userServices";
import tool from "../../tool";

const { reloadWindow, loginClick } = tool;
const { logoutUser } = userServices;

const Header = ({ search, setQuesitonPage, userInfo, setContentSelector, usableReloadWindow=reloadWindow}) => {
    const [val, setVal] = useState(search);
    useEffect(() => {
        const loggedInUser = localStorage.getItem("currentUser");
        if (loggedInUser) {
            const foundUser = JSON.parse(loggedInUser);
            userInfo.setter(foundUser);
        }
    }, []);

    const titleClick = () => {
        setContentSelector("mainContent");
    };
    
    const logoutClick = async () => {
        try {
            let response = await logoutUser();
            if (response.success) {
                userInfo.setter(null);
                localStorage.removeItem("currentUser");
                setContentSelector("mainContent");
                usableReloadWindow();
            } else {
                throw new Error("An error occurred while logging out");
            }
        } catch (error) {
            window.alert(error.message);
        }
    };
    
    const profileButtonClick = async () => {
        setContentSelector("profileContent");
    };

    return (
        <div id="header" className="header">
            <div className="title" onClick={titleClick}>Fake Stack Overflow</div>
            <div className="rightAlignedComp">
                <input
                    id="searchBar"
                    placeholder="Search ..."
                    type="text"
                    value={val}
                    onChange={(e) => {
                        setVal(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            setQuesitonPage(val, "Search Results");
                        }
                    }}
                />
                {
                    userInfo.getter ? 
                        <div>
                            <button id="profileButton" className="profileButton" onClick={profileButtonClick}>
                                {userInfo.getter.first_name}
                            </button>
                            <button id="logoutButton" className="profileButton" onClick={logoutClick}>
                                Logout
                            </button>
                        </div>:
                        <button id="loginButton" className="profileButton" onClick={() => loginClick(setContentSelector)}>
                            Login
                        </button>
                        
                }
            </div>
        </div>
    );
};

export default Header;