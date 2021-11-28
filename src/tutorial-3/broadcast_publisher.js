const amqp = require('amqplib/callback_api');
const paramToMessages = require('../shared/param-to-messages');

const exchange = 'tutorial-3-exchange';
const messages = paramToMessages();

function main() {
    amqp.connect('amqp://localhost', function (error0, connection) {
        if (error0) throw error0;

        connection.createChannel(function (error1, channel) {
            if (error1) throw error1;

            channel.assertExchange(exchange, 'fanout', {
                durable: false
            });

            messages.forEach(msg => {
                channel.publish(exchange, '', Buffer.from(msg));
                console.log(` [x] Sent ${msg}`);
            });

            setTimeout(function () {
                connection.close();
                process.exit(0);
            }, 500);
        });
    });
}

setTimeout(main, 2000);