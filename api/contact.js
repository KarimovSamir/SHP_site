const nodemailer = require('nodemailer');
const multiparty = require('multiparty');

export default async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Method is not allowed' });
        return;
    }
    
    // Парсинг данных формы, включая файлы
    const form = new multiparty.Form();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            res.status(500).send({ error: 'Form processing error' });
            return;
        }
        
        // Проверка обязательных полей
        if (!fields.name || !fields.name[0].trim()) {
            return res.status(400).send({ error: 'The "Name" field is required' });
        }
        if (!fields.email || !fields.email[0].trim()) {
            return res.status(400).send({ error: 'The "Email" field is required' });
        }
        if (!files.resume || !files.resume[0]) {
            return res.status(400).send({ error: 'The file (resume) is required to upload' });
        }
        
        const { name, email, message } = fields;
        const resume = files.resume[0];
        // Сообщение является необязательным – если его нет, то передаем пустую строку
        const messageText = (message && message[0]) ? message[0] : '';

        // Настройка транспондера для отправки почты
        let transporter = nodemailer.createTransport({
            service: 'gmail', // или другой почтовый сервис
            auth: {
                user: process.env.EMAIL_USER, // задается через переменные окружения
                pass: process.env.EMAIL_PASS,
            },
        });

        let mailOptions = {
            from: email[0],
            to: 'mistersam444@gmail.com', // адрес для получения сообщений
            subject: 'Candidate for a job at SHP',
            text: `Name: ${name[0]}\nEmail: ${email[0]}\nMessage: ${messageText}`,
            attachments: [{
                filename: resume.originalFilename,
                path: resume.path,
            }],
        };

        try {
            await transporter.sendMail(mailOptions);
            res.status(200).send({ message: 'Mail sent successfully' });
        } catch (error) {
            res.status(500).send({ error: 'Mail sending error' });
        }
    });
};
