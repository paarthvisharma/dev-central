import React from "react";
import { useState, useEffect } from "react";
import Header from "./header";
import Main from "./main";
import LoginPage from "./main/loginPage";
import SignupPage from "./main/signupPage";
import ProfilePage from "./main/profilePage";
import loginPage from "../utils/loginPage";
import tool from "../tool"

const { signupClick } = tool;

const {submitLogin} = loginPage;

export default function fakeStackOverflow() {

    const [search, setSearch] = useState("");
    const [mainTitle, setMainTitle] = useState("All Questions");
    const [currentUser, setCurrentUser] = useState(null);
    const userInfo = {
        getter: currentUser,
        setter: setCurrentUser
    }

    const [contentSelector, setContentSelector] = useState("mainContent");
    const [content, setContent] = useState(null);


    useEffect(() => {
        switch (contentSelector) {
            case "mainContent":
                setContent(<Main title={mainTitle} 
                    search={search} setQuesitonPage={setQuesitonPage} 
                    setContentSelector={setContentSelector}/>);
                break;
            case "loginContent":
                setContent(<LoginPage 
                                setContentSelector={setContentSelector} 
                                userInfo={userInfo}
                                submitLogin={submitLogin}
                                signupClick={signupClick}/>);
                break;
            case "signupContent":
                setContent(<SignupPage setContentSelector={setContentSelector}/>);
                break;
            case "profileContent":
                setContent(<ProfilePage/>);
                break;
            default:
                setContent(<Main title={mainTitle} 
                    search={search} setQuesitonPage={setQuesitonPage} 
                    setContentSelector={setContentSelector}/>);
        }
    }, [contentSelector, search]);


    const setQuesitonPage = (search = "", title = "All Questions") => {
        setSearch(search);
        setMainTitle(title);
    };

    return (
        <>
            <Header search={search} setQuesitonPage={setQuesitonPage} 
                    userInfo={userInfo} setContentSelector={setContentSelector}/>
            {content}
        </>
    );
}
