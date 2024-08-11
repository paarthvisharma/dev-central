const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
];

const getMetaData = (date) => {
    const now = new Date();
    const diffs = Math.floor(Math.abs(now - date) / 1000);

    if (diffs < 60) {
        return diffs + " seconds ago";
    } else if (diffs < 60 * 60) {
        return Math.floor(diffs / 60) + " minutes ago";
    } else if (diffs < 60 * 60 * 24) {
        let h = Math.floor(diffs / 3600);
        return h + " hours ago";
    } else if (diffs < 60 * 60 * 24 * 365) {
        return (
            months[date.getMonth()] +
            " " +
            getDateHelper(date) +
            " at " +
            date.toTimeString().slice(0, 8)
        );
    } else {
        return (
            months[date.getMonth()] +
            " " +
            getDateHelper(date) +
            ", " +
            date.getFullYear() +
            " at " +
            date.toTimeString().slice(0, 8)
        );
    }
};

const getDateHelper = (date) => {
    let day = date.getDate();
    if (day < 10) {
        day = "0" + day;
    }
    return day;
};

const validateHyperlink = (text) => {
    const hyperlinkPattern = /\[([^\]]*)\]\(([^)]*)\)/g;
    let isValid = true;

    // Find all matches for hyperlinks in the text
    const matches = [...text.matchAll(hyperlinkPattern)];

    // If there are no matches, it's valid
    if (matches.length === 0) {
        return isValid;
    }

    // Check each match to see if the URL starts with https://

    for (const match of matches) {
        if (
            !match[1].length ||
            !match[2].length ||
            !match[2].startsWith("https://") ||
            !match[2].slice(8).length
        ) {
            isValid = false;
            break; // No need to check further, one invalid URL is enough to return false
        }
    }

    return isValid;
};

const handleHyperlink = (text = "") => {
    const pattern = /\[([^\]]*)\]\(([^)]*)\)/g;

    const replacedText = text.replace(
        pattern,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    return <div dangerouslySetInnerHTML={{ __html: replacedText }} />;
};

const loginClick = (setContentSelector) => {
    setContentSelector("loginContent");
};

const signupClick = (setContentSelector) => {
    setContentSelector("signupContent");
};

const reloadWindow = () => {
    window.location.reload();
};

export default { getMetaData, handleHyperlink, validateHyperlink, loginClick, signupClick, reloadWindow };
