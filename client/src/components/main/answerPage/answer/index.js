import tool from "../../../../tool";
import "./index.css";
import { upVote, downVote, deleteAnswer } from "../../../../services/answerService";
import { useState } from "react";

const { handleHyperlink } = tool;

// Component for the Answer Page
const Answer = ({ text, ansBy, meta, ans_votes, aid, currentUser, qid }) => {

    const [upVoteCount, setUpVoteCount] = useState(ans_votes);
    const [removeComponent, setRemoveComponent] = useState(false);

    const deleteCurrentAnswer = async () => {
        const response = await deleteAnswer({"qid": qid, "aid": aid});
        if (response) {
            setRemoveComponent(true);
            alert(response);
        }
    };

    const makeUpVote = async (aid) => {
        if (!currentUser) {
            alert("Please login to vote");
            return;
        }
        let response = await upVote(aid);
        if (typeof response === "string") {
            alert(response);
        } else {
            setUpVoteCount(response.ans_votes);
        }
    };

    const makeDownVote = async (aid) => {
        if (!currentUser) {
            alert("Please login to vote");
            return;
        }
        let response = await downVote(aid);
        if (typeof response === "string") {
            alert(response);
        } else {
            setUpVoteCount(response.ans_votes);
        }
    };
    

    return (
            <div className={removeComponent ? "hidden" : "answer right_padding"}>
                <div className="answer_votes">
                    {upVoteCount} votes
                    <div>
                        <button className="vote_button" onClick={() => makeUpVote(aid)}> UpVote </button>
                        <button className="vote_button" onClick={() => makeDownVote(aid)}> DownVote </button>
                    </div>
                </div>
                <div id="answerText" className="answerText">
                    {handleHyperlink(text)}
                </div>
                <div className="answerAuthor">
                    <div className="answer_author">{ansBy}</div>
                    <div className="answer_question_meta">{meta}</div>
                </div>
                {
                    currentUser && currentUser.roles && currentUser.roles.includes("moderator") &&
                    <button className="delete_button" onClick={deleteCurrentAnswer}>
                        Delete Answer
                    </button>
                }
            </div>
    );
};

export default Answer;
