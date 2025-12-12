const { Worker } = require('bullmq');
require('dotenv').config();
const processor = require('./processor')
const Redis = require('ioredis')

const connectionOptns = {
	host: process.env.REDIS_URL,
	port: parseInt(process.env.REDIS_PORT, 10),
	username: 'default',
	password: process.env.REDIS_PASSWORD,
	maxRetriesPerRequest: null
}

const connection = new Redis(connectionOptns)

connection.on('connect', () => console.log('Worker connected'));
connection.on('error', (err) => {
	console.error('Worker could not connect to redis:', err.message);
	if (err.message.includes('Client network socket disconnected')) {
		console.log('HINT: You might be using TLS settings on a non-TLS port (or vice versa). Try flipping the USE_TLS variable.');
	}
});

const worker = new Worker('resultsNotifications', processor, {
	connection: connectionOptns,
	concurrency: 5
})

worker.on('failed', () => {
	console.error("Email sending failed");
})
worker.on('completed', () => {
	console.log("Emails sent");
})

