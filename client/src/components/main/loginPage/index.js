import "./index.css";
import { useState } from "react";

const LoginPage = ({setContentSelector, userInfo, submitLogin, signupClick}) => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div id="loginPage" className="loginPage">
            <table>
                <tbody>

                    <tr>
                        <td>
                            <h3>Username:</h3>
                        </td>
                        <td>
                            <input 
                                id="usernameInput"
                                type="text" 
                                value={username} 
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                }}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h3>Password:</h3>
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
                    <tr>
                        <td>
                            <button
                                id="loginButton"
                                onClick={() => {
                                    submitLogin(userInfo, setContentSelector, username, password);
                                }}
                            >
                                Login
                            </button>
                        </td>
                        <td>
                            <button 
                                id="signupButton"
                                onClick={() => signupClick(setContentSelector)}
                            >
                                Sign Up
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default LoginPage;