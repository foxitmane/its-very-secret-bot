const db = require('quick.db');

exports.run = async (client, message, args, tools) => {
	let user = message.mentions.users.first() || message.author;
	let balance = await db.fetch(`userBalance_${user.id}`);
	if(balance === null) balance = 0;

	message.channel.send(`${user.username} - Баланс: $${balance}`);
}

module.exports.config = {
	command: "balance"
}
