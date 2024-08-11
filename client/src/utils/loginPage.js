import userServices from "../services/userServices";

const { loginUser } = userServices;

const submitLogin = async (userInfo, setContentSelector, username, password) => {
    try {
        let response = await loginUser({username: username, password: password});
        if (response.status === 401) {
            alert("Invalid username or password");
            return;
        }
        userInfo.setter(response);
        setContentSelector('mainContent');
    } catch (error) {
        throw new Error(error);
    }  
};

export default {submitLogin};