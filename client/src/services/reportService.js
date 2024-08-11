import { REACT_APP_API_URL, api } from "./config";

const REPORT_API_URL = `${REACT_APP_API_URL}/reportedPost`;

const getReportedPosts = async () => {
    const res = await api.get(`${REPORT_API_URL}/getReportedPosts`);
    if (res.status === 200 && res.data) {
        return res.data;
    } else {
        throw new Error(res.data.message);
    }
};

const resolveReportedPost = async (qid) => {
    const res = await api.post(`${REPORT_API_URL}/deleteReportedPost`, {"qid": qid});
    if (res.status === 200) {
        return res.data.message;
    } else {
        throw new Error(res.data.message);
    }
};

const reportPost = async (qid) => {
    const res = await api.post(`${REPORT_API_URL}/reportPost`, {"qid": qid});
    if (res.status === 200) {
        if (res.data.message) {
            return res.data.message;
        } else {
            return "Successfully reported post";
        }
    } else {
        throw new Error(res.data.message);
    }
};

export { getReportedPosts, resolveReportedPost, reportPost };