const { Resend } = require('resend')

const resend  = new Resend( process.env.RESEND_KEY);

async function sendMail(obj) {
	try {
		const { data, error } = await resend.emails.send({
			from: obj.from,
			to: obj.to,
			subject: obj.subject,
			html: obj.body
		});

		if (error) {
			console.error('Resend API Error:', error);
			throw new Error(`Failed to send email: ${error.message}`);
		}

		console.log('Email sent successfully. ID:', data.id);
		return { success: true, emailId: data.id };

	} catch (e) {
		console.error('Email sending failed:', e);
		return { success: false, error: e.message };
	}
}

module.exports = sendMail;