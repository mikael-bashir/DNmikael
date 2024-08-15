const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const port = 3000;

// Serve static files (like HTML, CSS, JavaScript) from the "public" directory
app.use(express.static('public'));

// Define a simple route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Middleware to parse JSON requests
app.use(express.json());

// Route to send email
app.post('/send-email', async (req, res) => {
    const { name, email, card } = req.body;
    console.log(name);

    // Create a transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail', // e.g., 'gmail' or use your email service provider
        auth: {
            type: 'OAuth2',
            user: 'mikael.bashir.transporter@gmail.com',
            clientId: '722949435662-becu0q198au7sm1rg8d1hh6275a67spa.apps.googleusercontent.com',
            clientSecret: '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',
            refreshToken: '1//04vN975_W4WjbCgYIARAAGAQSNwF-L9IrpnmvRr3hRK8l2tniIFMLpnryG0q3DtuqhTV37Z4YxP3rv6_HojraosiUOqaO3XMAl8w',
        }
    });

    // Setup email data
    let mailOptions = {
        from: 'mikael.bashir.transporter@gmail.com', // sender address
        to: 'mikaelbashir14096545@gmail.com', // list of receivers
        subject: 'this is a test subject', // Subject line
        text: `Name: ${name.trim()}\nEmail: ${email.trim()}\nCard: ${card.trim()}`
    };

    try {
        // Send mail with defined transport object
        let info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        res.status(200).send('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending email');
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});