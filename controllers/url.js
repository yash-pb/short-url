const URL = require('../models/url');

const generateRandomeIds = () => {
    let random = Math.random().toString(36).slice(3)
    return random;
}

const createNewUrl = async (req, res) => {
    try {
        const {url} = req.body;
        if(!url) {
            return res.status(400).json({
                'status': false,
                'error': "url is required"
            });
        }
    
        const result = await URL.create({
            shortId: generateRandomeIds(),
            redirectUrl: url,
            visitHistory: []
        })
        
        return res.status(200).json({
            'status': true,
            'url': result
        })
    } catch (error) {
        return res.status(500).json({
            'status': false,
            'error': "Something went wrong"
        })
    }
}

const getAllUrls = async (req, res) => {
    try {
        const results = await URL.find({})
        
        return res.status(200).json({
            'status': true,
            'data': results
        })
    } catch (error) {
        console.log('error => ',error);
        
        return res.status(500).json({
            'status': false,
            'error': "Something went wrong"
        })
    }
}

const redirectUrl = async (req, res) => {
    try {
        const shortId = req.params.id;
        const result = await URL.findOneAndUpdate({
            shortId
        }, {
            $push: {
                visitHistory: {
                    timestamp: Date.now()
                }
            }
        })

        res.redirect(result.redirectUrl);
    } catch (error) {
        console.log('error => ',error);
        
        return res.status(500).json({
            'status': false,
            'error': "Something went wrong"
        })
    }
}

const getAnalyticOfId = async (req, res) => {
    try {
        const shortId = req.params.id;
        const result = await URL.findOne({ shortId })
        
        return res.json({
            'status': true,
            'totalClicks': result.visitHistory.length,
            'analytics': result.visitHistory
        })
    } catch (error) {
        console.log('error => ',error);
        
        return res.status(500).json({
            'status': false,
            'error': "Something went wrong"
        })
    }
}



module.exports = {
    createNewUrl,
    getAllUrls,
    getAnalyticOfId,
    redirectUrl
}