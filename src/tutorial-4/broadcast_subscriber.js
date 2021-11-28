const amqp = require('amqplib/callback_api');

const exchange = 'tutorial-4-exchange';
const subscriberNumber = parseInt(process.argv[2]);
const severitiesToListenTo = process.argv.slice(3);

amqp.connect('amqp://localhost', function (error0, connection) {
    if (error0) throw error0;

    connection.createChannel(function (error1, channel) {
        if (error1) throw error1;

        channel.assertExchange(exchange, 'direct', {
            durable: false
        });

        // let the rabbitmq to choose a name for our queue, so we pass an empty string for the name of the queue
        channel.assertQueue('', {
            // When the connection that declared it closes, the queue will be deleted because it is declared as exclusive
            exclusive: true
        }, function (error2, { queue }) {
            if (error2) throw error2;

            console.log(` [*] Subscriber#${subscriberNumber} - Waiting for messages in ${queue}. To exit press CTRL+C`);

            severitiesToListenTo.forEach(severity => {
                channel.bindQueue(queue, exchange, severity);    
            });
            
            channel.consume(queue, function (msg) {
                console.log(` [x] Subscriber#${subscriberNumber} - Received ${msg.fields.routingKey}: '${msg.content}'`);
            }, {
                // automatic acknowledge; because we just want to receive and process the broadcast messages very fast
                noAck: true
            });
        });
    });
});