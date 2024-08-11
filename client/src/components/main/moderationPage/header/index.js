import "./index.css";

const ModerationHeader = ({
    title_text,
    qcnt
}) => {
    return (
        <div>
            <div className="space_between right_padding">
                <div className="bold_title">{title_text}</div>
            </div>
            <div className="space_between right_padding">
                <div id="question_count">{qcnt} questions</div>
            </div>
        </div>
    );
};

export default ModerationHeader;
