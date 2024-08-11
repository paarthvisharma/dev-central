import "./index.css";
import { useState } from "react";
import userServices from "../../../services/userServices";

const { signUpUser } = userServices;

const SignupPage = ({setContentSelector}) => {

    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");


    const submitSignup = async () => {
        try {
            let alertMessage = "";
            if (username.length === 0 || username.length > 30) {
                alertMessage += "Username must be between 1 and 30 characters\n";
            }
            if (firstName.length === 0 || firstName.length > 30) {
                alertMessage += "First Name must is mandatory\n";
            }
            if (lastName.length === 0 || lastName.length > 30) {
                alertMessage += "Last Name must is mandatory\n";
            }
            if (password.length === 0 || password.length > 30) {
                alertMessage += "Password must be between 1 and 30 characters\n";
            }
            if (alertMessage.length > 0) {
                alert(alertMessage);
                setUsername("");
                setFirstName("");
                setLastName("");
                setPassword("");
                return;
            }
            let response = await signUpUser(
                    {
                        username: username, 
                        first_name: firstName,
                        last_name: lastName,
                        password: password
                    }
                );
            if (response.status === 200) {
                setContentSelector('loginContent');
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.log(error);
        } 
    };

    return (
        <div id="signupPage" className="signupPage">
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
                            <h3>First Name:</h3>
                        </td>
                        <td>
                            <input 
                                id="fistNameInput"
                                type="text" 
                                value={firstName} 
                                onChange={(e) => {
                                    setFirstName(e.target.value);
                                }}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h3>Last Name:</h3>
                        </td>
                        <td>
                            <input 
                                id="lastNameInput"
                                type="text" 
                                value={lastName} 
                                onChange={(e) => {
                                    setLastName(e.target.value);
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
                </tbody>
            </table>
            <button id="signupButton" onClick={submitSignup}>Sign Up</button>

        </div>
    );
}

export default SignupPage;