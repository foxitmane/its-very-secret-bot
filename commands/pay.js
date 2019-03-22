const db = require('quick.db');

module.exports.run = async (client, message, args, tools) => {
	if(!message.mentions.members.first()) return message.channel.send('**Пожалуйста, укажите пользователя**');

	let targetMember = message.mentions.members.first(),
		amount = parseInt(args.join(' ').replace(targetMember, ''));
	if(isNaN(amount)) return message.channel.send('**Пожалуйста, укажите сумму.**');
	let targetBalance = await db.fetch(`userBalance_${targetMember.id}`),
		selfBalance = await db.fetch(`userBalance_${message.author.id}`);

	if(targetBalance === null) targetBalance = 0;
	if(selfBalance === null) selfBalance = 0;

	if (amount > selfBalance) return message.channel.send('Извините, на вашем счете нехватает средств!');
	db.add(`userBalance_${targetMember.id}`, amount);
	db.subtract(`userBalance_${message.author.id}`, amount);

	message.channel.send(`**Вы успешно отправили $${amount} участнику ${targetMember.user.tag}**`);
}

module.exports.config = {
	command: "pay"
}
