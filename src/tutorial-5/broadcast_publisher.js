const amqp = require('amqplib/callback_api');

const exchange = 'tutorial-5-exchange';

const messages = [
    {
        topic: 'system.log',
        text: 'System Log'
    },
    {
        topic: 'system.telemetry',
        text: 'System Telemetry'
    },
    {
        topic: 'user.log',
        text: 'User Log'
    }
]

function main() {
    amqp.connect('amqp://localhost', function (error0, connection) {
        if (error0) throw error0;

        connection.createChannel(function (error1, channel) {
            if (error1) throw error1;

            channel.assertExchange(exchange, 'topic', {
                durable: false
            });

            messages.forEach(msg => {
                channel.publish(exchange, msg.topic, Buffer.from(msg.text));
                console.log(` [x] Sent ${msg.text}`);
            });

            setTimeout(function () {
                connection.close();
                process.exit(0);
            }, 500);
        });
    });
}

setTimeout(main, 2000);