const authenticate = (req, res, next) => {
    if(req.session.user === undefined){
        return res.status(401).json(" You must be logged in to access this page");
    }
    next();
}

module.exports = { authenticate };