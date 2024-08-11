import "./index.css";
import userServices from "../../../services/userServices";
import { useState, useEffect } from "react";

const { getCurrentUser } = userServices;

const SideBarNav = ({ selected = "", handleQuestions, handleTags, handleModeration }) => {

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {;
        getCurrentUser().then((user) => setCurrentUser(user));
    }, []);

    return (
        <div id="sideBarNav" className="sideBarNav">
            <div
                id="menu_question"
                className={`menu_button ${
                    selected === "q" ? "menu_selected" : ""
                }`}
                onClick={() => {
                    handleQuestions();
                }}
            >
                Questions
            </div>
            <div
                id="menu_tag"
                className={`menu_button ${
                    selected === "t" ? "menu_selected" : ""
                }`}
                onClick={() => {
                    handleTags();
                }}
            >
                Tags
            </div>
            {
                currentUser && currentUser.roles && currentUser.roles.includes("moderator") &&
                <div
                    id="menu_moderation"
                    className={`menu_button ${
                        selected === "m" ? "menu_selected" : ""
                    }`} 
                    onClick={() => {
                        handleModeration();
                    }}  
                >
                    Moderator
                </div>
            }
        </div>
    );
};

export default SideBarNav;
