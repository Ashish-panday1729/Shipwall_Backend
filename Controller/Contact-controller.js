import nodemailer from 'nodemailer'

export const sendMessage = async (req, res) => {
    const { name } = req.body;
    const { email } = req.body;
    const { mobile } = req.body;
    const { message } = req.body;


    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "pandaycoder@gmail.com",
                pass: "bzpl xzsz jurt psmz"
            }
        });

        const mailOptions = {
            from: "pandaycoder@gmail.com",
            to: "ashish@indiaadmart.com",
            subject: "Mail From Customer",
            html: `<h1>Congratulations ! We have done this creation.</h1> <br /> <h3>Name : ${name}</h3>  <br /> <h3>Email : ${email}</h3> <br /> <h3>Mobile : ${mobile}</h3>  <br /> <h3>Message : ${message}</h3>`,
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                res.status(201).send({ success: true, info })
                console.log(info.response)
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Server error!" });
    }
}