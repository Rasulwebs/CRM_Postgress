import nodemailer from 'nodemailer';

const sendMail = async (mail, number) =>{
    const transporter = nodemailer.createTransport({
        service : "gmail",
        auth : {
            user : "boyqoziyevs0@gmail.com",
            pass : "ngtauroresbuwnyk"
        }
    })

   const info = transporter.sendMail({
    from : "boyqoziyevs0@gmail.com",
    to : mail,
    subject : "Sizning tasdiqlash kodingiz",
    html : `
    <span>Tasdiqlash kodi : <strong>${number}</strong></span>`
   })
   return info

}




export default sendMail;