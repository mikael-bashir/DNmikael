import express, { Request, Response } from 'express';
const nodemailer = require('nodemailer');
const app = express();
const port = 3000;

app.use(express.static('publicFiles'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/publicFiles/index.html');
});

app.use(express.json());

app.post('/send-email', async (req: Request, res: Response) => {
    const { name, email, card } = req.body;
    console.log(name);

    let transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            type: 'OAuth2',
            user: 'mikael.bashir.transporter@gmail.com',
            clientId: '722949435662-becu0q198au7sm1rg8d1hh6275a67spa.apps.googleusercontent.com',
            clientSecret: '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',
            refreshToken: '1//04TNM1_bwDRK2CgYIARAAGAQSNwF-L9Ir5xiRmRR-QzGU8VndDMVhpBnFtjTSkgXOQRikV-d1jnyQ0iq6RSi6s2RkDwrnV1S0SR4',
        }
    });


    let mailOptions = {
        from: 'mikael.bashir.transporter@gmail.com', // sender address
        to: 'test@dn-uk.com', // list of receivers
        subject: 'this is a test subject', // Subject line
        text: `Name: ${name.trim()}\nEmail: ${email.trim()}\nCard: ${card.trim()}`
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});