"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const nodemailer = require('nodemailer');
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.static('publicFiles'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/publicFiles/index.html');
});
app.use(express_1.default.json());
app.post('/send-email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        let info = yield transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        res.status(200).send('Email sent successfully');
    }
    catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email');
    }
}));
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
