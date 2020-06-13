import express from 'express';
const app = express();

app.get('/', (req, res) => {
    console.log(req.hostname);
    res.send('5');
});

app.listen(3000, () => console.log('ayyy lmao'));