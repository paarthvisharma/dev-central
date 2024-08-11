import "./index.css";
import { useState, useEffect } from "react";
import userServices from "../../../services/userServices";

const { modifyUser, getCurrentUser } = userServices;

const ProfilePage = () => {
    const [username, setUsername] = useState("");
    const [first_name, setFirst_name] = useState("");
    const [last_name, setLast_name] = useState("");
    const [password, setPassword] = useState("");
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            let user = await getCurrentUser();
            setUsername(user.username);
            setFirst_name(user.first_name);
            setLast_name(user.last_name);
            setRoles(user.roles);
        }
        fetchUser();
    }, []);

    const submiChanges = async () => {
        await modifyUser({
            username: username,
            first_name: first_name,
            last_name: last_name,
            password: password,
            roles: ['user']
        });
        setPassword("");
    };

    return(
        <div className="profilePage">
            <h1>Profile Page</h1>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <h3>Username:</h3>
                        </td>
                        <td>
                            <div id="username">{username}</div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h3>First Name:</h3>
                        </td>
                        <td>
                            <div id="first_name">{first_name}</div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h3>Last Name:</h3>
                        </td>
                        <td>
                            <div id="last_name">{last_name}</div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h3>Roles:</h3>
                        </td>
                        <td>
                            <div id="roles">
                                {roles.join(", ")}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h3>New Password:</h3>
                        </td>
                        <td>
                            <input 
                                id="passwordInput"
                                type="password" 
                                value={password} 
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
            <button id="modifyButton" onClick={submiChanges}>Save</button>
        </div>
    );
};

export default ProfilePage;