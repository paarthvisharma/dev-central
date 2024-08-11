import "../input/index.css";

const Textarea = ({
    title,
    mandatory = true,
    hint,
    id,
    val,
    setState,
    err,
}) => {
    return (
        <>
            <div className="input_title">
                {title}
                {mandatory ? "*" : ""}
            </div>
            {hint && <div className="input_hint">{hint}</div>}
            <textarea
                id={id}
                className="input_input"
                type="text"
                value={val}
                onInput={(e) => {
                    setState(e.target.value);
                }}
            />
            {err && <div className="input_error">{err}</div>}
        </>
    );
};

export default Textarea;
