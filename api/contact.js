const nodemailer = require('nodemailer');
const multiparty = require('multiparty');

export default async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Метод не разрешен' });
        return;
    }
    
    // Парсинг данных формы, включая файлы
    const form = new multiparty.Form();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            res.status(500).send({ error: 'Ошибка при обработке формы' });
            return;
        }
        
        const { name, email, message } = fields;
        const resume = files.resume ? files.resume[0] : null;

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
            to: 'mistersam444@gmail.com', // твой email для получения сообщений
            subject: 'Новое сообщение с сайта',
            text: `Имя: ${name[0]}\nEmail: ${email[0]}\nСообщение: ${message[0]}`,
            attachments: resume ? [{
                filename: resume.originalFilename,
                path: resume.path,
            }] : [],
        };

        try {
            await transporter.sendMail(mailOptions);
            res.status(200).send({ message: 'Сообщение успешно отправлено' });
        } catch (error) {
            res.status(500).send({ error: 'Ошибка отправки почты' });
        }
    });
};
