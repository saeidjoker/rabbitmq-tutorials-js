const amqp = require('amqplib/callback_api');
const paramToMessages = require('../shared/param-to-messages')

const queue = 'tutorial-2-queue';
const messages = paramToMessages();

/**
 * Remember that two things are required to make sure that messages aren't lost: 
 *  we need to mark the queue "durable" and messages as "persistent"
 */

amqp.connect('amqp://localhost:5672', function (error0, connection) {
    if (error0) throw error0;

    connection.createChannel(function (error1, channel) {
        if (error1) throw error1;

        channel.assertQueue(queue, {
            durable: true
        });

        messages.forEach(msg => {
            channel.sendToQueue(queue, Buffer.from(msg), {
                persistent: true
            });
            console.log(` [x] Sent '${msg}'`);
        });

        setTimeout(function () {
            connection.close();
            process.exit(0);
        }, 500);
    });
});