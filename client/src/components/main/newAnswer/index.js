import "./index.css";
import { useState, useEffect } from "react";
import Form from "../baseComponents/form";
import Input from "../baseComponents/input";
import Textarea from "../baseComponents/textarea";
import tool from "../../../tool";
import { addAnswer } from "../../../services/answerService";
import userServices from "../../../services/userServices";

const { getCurrentUser } = userServices;
const { validateHyperlink } = tool;

const NewAnswer = ({ qid, handleAnswer, setContentSelector }) => {
    const [usrn, setUsrn] = useState("");
    const [text, setText] = useState("");
    const [usrnErr, setUsrnErr] = useState("");
    const [textErr, setTextErr] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            let user = await getCurrentUser();
            if (!user) {
                setContentSelector("loginContent");
                return;
            }
            // setLoggedInUser(user);
            setUsrn(user.username);
        };
        fetchUser();
    }, []);

    const postAnswer = async () => {
        let isValid = true;

        if (!usrn) {
            setUsrnErr("Username cannot be empty");
            isValid = false;
        }

        if (!text) {
            setTextErr("Answer text cannot be empty");
            isValid = false;
        }

        // Hyperlink validation
        if (!validateHyperlink(text)) {
            setTextErr("Invalid hyperlink format.");
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        const answer = {
            text: text,
            ans_by: usrn,
            ans_date_time: new Date(),
        };

        const res = await addAnswer(qid, answer);
        if (res && res._id) {
            handleAnswer(qid);
        }
    };
    return (
        <Form>
            <Input
                title={"Username"}
                id={"answerUsernameInput"}
                val={usrn}
                setState={() => {}}
                err={usrnErr}
            />
            <Textarea
                title={"Answer Text"}
                id={"answerTextInput"}
                val={text}
                setState={setText}
                err={textErr}
            />
            <div className="btn_indicator_container">
                <button
                    className="form_postBtn"
                    onClick={() => {
                        postAnswer();
                    }}
                >
                    Post Answer
                </button>
                <div className="mandatory_indicator">
                    * indicates mandatory fields
                </div>
            </div>
        </Form>
    );
};

export default NewAnswer;
