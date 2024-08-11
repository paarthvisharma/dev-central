import { useEffect, useState } from "react";
import tool from "../../../tool";
import Answer from "./answer";
import AnswerHeader from "./header";
import "./index.css";
import QuestionBody from "./questionBody";
import { getQuestionById, deleteQuestion } from "../../../services/questionService";
import userServices from "../../../services/userServices";
import { reportPost } from "../../../services/reportService";

const { getCurrentUser } = userServices;
const { getMetaData, reloadWindow } = tool;

// Component for the Answers page
const AnswerPage = ({ qid, handleNewQuestion, handleNewAnswer, usableReloadWindow=reloadWindow }) => {
    const [question, setQuestion] = useState({});
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            let res = await getQuestionById(qid);
            setQuestion(res || {});
        };
        fetchData().catch((e) => console.log(e));
    }, [qid]);


    useEffect(() => {;
        getCurrentUser().then((user) => setCurrentUser(user));
    }, []);

    const reportCurrentQuestion = async () => {
        const response = await reportPost(qid);
        if (response) {
            alert(response);
        }
    };

    const deleteCurrentQuestion = async () => {
        const response = await deleteQuestion(qid);
        if (response) {
            alert(response);
            usableReloadWindow();
        }
    };

    return (
        <>
            <AnswerHeader
                ansCount={
                    question && question.answers && question.answers.length
                }
                title={question && question.title}
                handleNewQuestion={handleNewQuestion}
            />
            {
                currentUser && currentUser.roles && currentUser.roles.includes("moderator") &&
                <button id="delete_question" className="delete_button" onClick={deleteCurrentQuestion}>
                    Delete Question
                </button>
            }
            {
                currentUser && currentUser.roles && currentUser.roles.includes("user") &&
                <button id="report_question" className="delete_button" onClick={reportCurrentQuestion}>
                    Report Question
                </button>
            }
            <QuestionBody
                views={question && question.views}
                text={question && question.text}
                askby={question && question.asked_by}
                meta={question && getMetaData(new Date(question.ask_date_time))}
            />
            {question &&
                question.answers &&
                question.answers.map((a, idx) => (
                    <div key={idx}>
                        <Answer
                            text={a.text}
                            ansBy={a.ans_by}
                            meta={getMetaData(new Date(a.ans_date_time))}
                            ans_votes={a.ans_votes}
                            aid  = {a._id}
                            currentUser = {currentUser}
                            qid = {qid}
                        />
                    </div>
                ))}
            <button
                className="bluebtn ansButton"
                onClick={() => {
                    handleNewAnswer();
                }}
            >
                Answer Question
            </button>
        </>
    );
};

export default AnswerPage;
