const { Worker } = require('bullmq');
require('dotenv').config();
const processor = require('./processor')
const Redis = require('ioredis')

const connectionOptns = {

}

const connection = new Redis(connectionOptns)

connection.on('connect', () => console.log('Worker connected'));
connection.on('error', (err) => {
	console.error('Worker could not connect to redis:', err.message);
	if (err.message.includes('Client network socket disconnected')) {
		console.log('HINT: You might be using TLS settings on a non-TLS port (or vice versa). Try flipping the USE_TLS variable.');
	}
});

const resultWorker = new Worker('resultsNotifications', processor, {
	connection: connectionOptns,
	concurrency: 5
})

const sendVerificationWorker = new Worker('emailVerifications', processor, {
	connection: connectionOptns,
	concurrency: 5
})

sendVerificationWorker.on('failed', () => {
	console.log('Email verification invitation failed');
})

sendVerificationWorker.on('completed', () => {
	console.log('Email verification invitation sent');
})

resultWorker.on('failed', () => {
	console.error("Could not send result email");
})

resultWorker.on('completed', () => {
	console.log("Results email sent");
})
