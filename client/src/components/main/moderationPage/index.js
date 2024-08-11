import "./index.css";
import ModerationHeader from "./header";
import Question from "../questionPage/question";
import { useEffect, useState } from "react";
import { resolveReportedPost, getReportedPosts } from "../../../services/reportService";

const ModerationPage = ({
    clickTag, handleAnswer
}) => {
    const [qlist, setQlist] = useState([]);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            let res = await getReportedPosts();
            setQlist(res || []);
        };

        fetchData().catch((e) => console.log(e));
    }, [reload]);

    const resolveQuestion = async (qid) => {
        const response = await resolveReportedPost(qid);
        if (response) {
            alert(response);
            setReload(!reload);
        }
    };

    return (
        <>
            <ModerationHeader
                title_text="Moderation Page"
                qcnt={qlist.length}
            />
            <div id="question_list" className="question_list">
                {qlist.map((q, idx) => (
                    <div key={idx}>
                        <Question
                            q={q}
                            clickTag={clickTag}
                            handleAnswer={handleAnswer}
                        />
                        <button className="resolved_button" onClick={() => resolveQuestion(q._id)}>
                            Resolve
                        </button>
                    </div>
                ))}
            </div>
            {!qlist.length && (
                <div className="bold_title right_padding">
                    No new Questions reported 
                </div>
            )}
        </>
    );
};

export default ModerationPage;
