const amqp = require('amqplib/callback_api');

const queue = 'tutorial-2-queue';
const consumerNumber = parseInt(process.argv[3]);

amqp.connect('amqp://localhost:5672', function(error0, connection) {
    if (error0) throw error0;

    connection.createChannel(function(error1, channel) {
        if (error1) throw error1;

        channel.assertQueue(queue, {
            durable: true
        });
        channel.prefetch(1);

        console.log(` [*] Consumer#${consumerNumber} Waiting for messages in ${queue}. To exit press CTRL+C`);

        channel.consume(queue, function(msg) {
            const content = msg.content;
            console.log(` [x] Consumer#${consumerNumber} - Received ${content}`);
            setTimeout(function() {
                console.log(` [✓] Consumer#${consumerNumber} - Processed ${content}`);
                channel.ack(msg);
            }, 1500);
        }, {
            // manual acknowledgment mode
            noAck: false
        });
    });
});