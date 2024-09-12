const express = require('express');
const mongoose = require('./connection');
const urlRoutes = require('./routes/url');
const URL = require('./models/url');

require('dotenv').config();

const app = express();
const port = process.env.PORT;
const host = process.env.HOST;
const mongo = process.env.MONGO;

app.listen(port, host, () => {
    console.log(`Server started on http://${host}:${port}`);
})

mongoose.connectToDatabase(mongo).then(() => {
    console.log('mongo DB connected');
}).catch(error => console.log("Error => ", error));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/url', urlRoutes);
// // app.use('/:id', urlRoutes);
// // app.use('/analytics', urlRoutes);
// // router.get('/analytics/:id', getAnalyticOfId);

app.use('/:id', async (req, res) => {
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
});


// app.get('/shorten', async (req, res) => {
//     res.end('shorten');
// });
  
//   // Route to handle redirection to the original URL
// app.get('/:shortUrl', async (req, res) => {
//     let test = req.params.shortUrl;
//     res.end(`sffdfdf => ${test}`);
// });
  