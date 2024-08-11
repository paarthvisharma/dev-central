import { REACT_APP_API_URL, api } from "./config";

const ANSWER_API_URL = `${REACT_APP_API_URL}/answer`;

// To add answer
const addAnswer = async (qid, ans) => {
    const data = { qid: qid, ans: ans };
    const res = await api.post(`${ANSWER_API_URL}/addAnswer`, data);

    return res.data;
};

const upVote = async (aid) => {
    const response = await api.post(`${ANSWER_API_URL}/upVote`, {"aid": aid});
    console.log("Status code is:", response.status);
    if (response.status === 201 && response.data) {
        return response.data;
    } else if (response.status === 200) {
        return "You have already voted on this answer.";
    } else {
        throw new Error(response.data);
    }

};

const downVote = async (aid) => {
    const response = await api.post(`${ANSWER_API_URL}/downVote`, {"aid": aid});
    if (response.status === 201 && response.data) {
        return response.data;
    } else if (response.status === 200) {
        return "You have already voted on this answer.";
    } else {
        throw new Error(response.data);
    }
};

const deleteAnswer = async ({aid, qid}) => {
    const response = await api.post(`${ANSWER_API_URL}/deleteAnswer`, {"aid": aid, "qid": qid});
    if (response.status === 200) {
        return "Successfully deleted answer";
    } else {
        throw new Error(response.data);
    }
};

export { addAnswer, upVote, downVote, deleteAnswer };
