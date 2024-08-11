const Tag = require("../models/tags");
const Question = require("../models/questions");

const addTag = async (tname) => {
    // return 'complete addTag';
    // Check if the tag already exists
    let tag = await Tag.findOne({ name: tname });
    if (tag) {
        return tag._id.toString();
    }else {
        // Create new tag
        tag = new Tag({ name: tname });
        const savedTag = await tag.save(); 
        return savedTag._id;
      }
    
    
};

const getQuestionsByOrder = async (order) => {
    // complete the function
    let questions;
    switch(order){
        case "newest": {
            questions = await Question.find().populate('tags');
            const toReturnNew = questions.sort((a, b) => b.ask_date_time - a.ask_date_time);
            return toReturnNew;
        }
        case "unanswered":  {
            questions = await Question.find().populate('tags');
            const toReturnUn = questions.filter(question => question.answers.length == 0).sort((a,b) => b.ask_date_time - a.ask_date_time);
            return toReturnUn;
        }
        case "active": {
            questions = await Question.find().populate('tags')
                .populate({
                    path: 'answers',
                    options: { sort: { 'ans_date_time': -1 } }
                });
            questions=questions.sort((a, b) => b.ask_date_time - a.ask_date_time);

            questions.forEach(question => {
                    question.answers.sort((a, b) => new Date(b.ans_date_time) - new Date(a.ans_date_time));
                });            
            const toReturn = questions.sort((a, b) => {
                let aDate = a.answers.length > 0 ? new Date(a.answers[0].ans_date_time) : new Date(0);
                let bDate = b.answers.length > 0 ? new Date(b.answers[0].ans_date_time) : new Date(0);
                return bDate - aDate;
            });
            return toReturn;
        }
        default: {
            return await Question.find().populate('tags');
        }

}
};

const filterQuestionsBySearch = (qlist, search) => {
    // complete the function return [];
    if (search === ""){
        return qlist;
    }
    else{
    const tags = search.match(/\[(.*?)\]/g)?.map(tag => tag.replace(/\[|\]/g, '').toLowerCase()) || [];
    const keywords = search.replace(/\[(.*?)\]/g, '').toLowerCase().trim();

    const result = qlist.filter(question => {
        const titleTextMatch = keywords ? question.title.toLowerCase().includes(keywords)||question.text.toLowerCase().includes(keywords): false;        
        const tagMatch = tags.length > 0 ? question.tags.some(tag => tag.name && tags.includes(tag.name.toLowerCase())) : false;
        return titleTextMatch || (tags.length > 0 && tagMatch);
    });
    return result;
}

}


module.exports = { addTag, getQuestionsByOrder, filterQuestionsBySearch };