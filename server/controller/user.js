const express =  require("express");
const User = require("../models/users");

const router = express.Router();

const signUp = async (req, res) => {
    try {
        const { username, password, first_name, last_name } = req.body;
        const newUser = await User.create({
            username,
            password,
            first_name,
            last_name
        });
        res.status(200).send(formatOutput(newUser));
    } 
    catch (error) {
        if (error.message.includes('duplicate key error')) {
            return res.status(401).send({
                message: 'User with username already exists. Try a different username'  
            });
        }
        res.status(500).send(error.message);
    }

};

const formatOutput = (loggedinUser) => {
    return {
        username: loggedinUser.username,
        first_name: loggedinUser.first_name,
        last_name: loggedinUser.last_name,
        roles: loggedinUser.roles
    };

}


const login = async (req, res) => {
    try{
        const {username, password} = req.body;
        const loggedinUser = await User.findOne({ username, password });

        if (!loggedinUser){
            return res.status(401).send('Authentication failed');
        }
        req.session['currentUser'] = formatOutput(loggedinUser);
        res.status(200).send(req.session['currentUser']);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}

const logout = async (req, res) => {
    try{
        req.session.destroy();
        res.status(200).send({"success": true});
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
};

const getCurrentUser = async (req, res) => {

        if (!req.session['currentUser']){
            return res.status(200).send('Login First');
        }
        res.status(200).send(req.session['currentUser']);
        
};


const modifyUser = async (req, res) => {
    if (!req.session['currentUser']){
        return res.status(401).send('Login First');
    }
    const user = req.session['currentUser'].username;

    try {
        const updatedUser = await User.findOneAndUpdate({ username: user }, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).send('User not found');
        }
        req.session['currentUser'] = updatedUser;
        res.status(200).send(formatOutput(updatedUser));
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
};



router.post('/signUp', signUp);
router.post('/login', login);
router.post('/logout', logout);
router.get('/getCurrentUser', getCurrentUser);
router.put('/modifyUser', modifyUser);

module.exports = router;
