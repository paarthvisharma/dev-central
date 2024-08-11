import { REACT_APP_API_URL, api } from "./config";

const USER_API_URL = `${REACT_APP_API_URL}/user`;

const signUpUser = async (user) => {
    try {
        const res = await api.post(`${USER_API_URL}/signUp`, user);
        if (res.status === 200 && res.data) {
            return res;
        } else {
            throw new Error(res.data.message);
        }
    } catch (error) {
        return error.response;
    }
};

const loginUser = async (userCredentials) => {
    try{
        const res = await api.post(`${USER_API_URL}/login`, userCredentials);
        if (res.data) {
            console.log(res.data);
            localStorage.setItem('currentUser', JSON.stringify(res.data))
            return res.data;
        } else {
            throw new Error(res.data.message);
        }
    }
    catch (error) {
        return error.response;
    }
};

const logoutUser = async () => {
    const res = await api.post(`${USER_API_URL}/logout`);
    if (res.status < 200 || res.status >= 300) {
        throw new Error("Error logging out user...");
    }
    return res.data;
};

const getCurrentUser = async () => {
    const res = await api.get(`${USER_API_URL}/getCurrentUser`);
    if (res.status === 200 && res.data != "Login First") {
        return res.data;
    } else {
        return null;
    }
};

const modifyUser = async (user) => {
    const res = await api.put(`${USER_API_URL}/modifyUser`, user);
    if (res.status < 200 || res.status >= 300) {
        throw new Error("Error logging out user...");
    }
    return res.data;
};

export default { signUpUser, loginUser, logoutUser, getCurrentUser, modifyUser };