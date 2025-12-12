const sendMail = require('./sendmail');

const processor = async (job) => {
	if (job.name === 'sendResults') {
		console.log(`Processing results for election: ${job.data.id}`);
		
		const mailResult = await sendMail({
		    from: 'onboarding@resend.dev',
		    to: 'patsoks.sokari@gmail.com',
		    subject: "Results for Election: " + job.data.id,
		    body: "<strong>Test Mail - Election Results Notification</strong>"
		});
		
		if (!mailResult.success) {
		    throw new Error(`Email failed to send for job ${job.id}: ${mailResult.error}`);
		}
	}
}

module.exports = processor