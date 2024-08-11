import "./index.css";

const Tag = ({ t, clickTag }) => {
    return (
        <div
            className="tagNode"
            onClick={() => {
                clickTag(t.name);
            }}
        >
            <div className="tagName">{t.name}</div>
            <div id="questionCount">{t.qcnt} questions</div>
        </div>
    );
};

export default Tag;
