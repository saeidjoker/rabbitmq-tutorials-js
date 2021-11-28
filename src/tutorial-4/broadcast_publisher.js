const amqp = require('amqplib/callback_api');
const paramToMessages = require('../shared/param-to-messages');

const exchange = 'tutorial-4-exchange';
// info, error, warning
const messages = {
    info: paramToMessages(2, 'INF'),
    error: paramToMessages(3, 'ERR'),
    warning: paramToMessages(4, 'WRN')
};

function main() {
    amqp.connect('amqp://localhost', function (error0, connection) {
        if (error0) throw error0;

        connection.createChannel(function (error1, channel) {
            if (error1) throw error1;

            channel.assertExchange(exchange, 'direct', {
                durable: false
            });

            for (const severity in messages) {
                messages[severity].forEach(msg => {
                    channel.publish(exchange, severity, Buffer.from(msg));
                    console.log(` [x] Sent ${msg}`);
                });
            }

            setTimeout(function () {
                connection.close();
                process.exit(0);
            }, 500);
        });
    });
}

setTimeout(main, 2000);