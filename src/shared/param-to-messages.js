function paramToMessages(argIndex = 2, prefix = 'Message') {
    const msgCount = parseInt(process.argv[argIndex]);
    const messages = [];
    for (let i = 0; i < msgCount; i++) {
        messages.push(`${prefix}#${i + 1}`);
    }
    return messages;
}

module.exports = paramToMessages;