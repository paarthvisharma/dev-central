import "./index.css";

const OrderButton = ({ message, setQuestionOrder }) => {
    return (
        <button
            className="btn"
            onClick={() => {
                setQuestionOrder(message);
            }}
        >
            {message}
        </button>
    );
};

export default OrderButton;
