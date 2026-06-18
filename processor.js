const backendurl = require('./backendurl');

const processor = async (job) => {
	if (job.name === 'sendResults') {
		const mailReq = await fetch(`${backendurl}/emails/push-results`, {
			method: 'POST',
			body: JSON.stringify({ electionId: job.data.id }),
			headers: {
				'Content-Type': 'application/json'
			}
		})

		if (!mailReq.ok) throw new Error("The request failed in mailReq processor")
	} else if (job.name === 'sendVerificationEmail') {
		const verificationReq = await fetch(`${backendurl}/emails/push-email-verification`, {
			method: "POST",
			body: JSON.stringify({ mail: job.data.email}),
			headers: {
				'Content-Type': 'application/json'
			}
		})

		if (!verificationReq) throw new Error("Email verification failed in processor")
	}
}

module.exports = processor