const db = require('quick.db');

module.exports.run = async (client, message, args, tools) => {
	if(!message.mentions.members.first()) return message.channel.send('**Пожалуйста, укажите пользователя**');

  if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("Вы не можете сделать данное действие");

	let targetMember = message.mentions.members.first(),
		amount = parseInt(args.join(' ').replace(targetMember, ''));
	if(isNaN(amount)) return message.channel.send('**Пожалуйста, укажите сумму.**');
	let targetBalance = await db.fetch(`userBalance_${targetMember.id}`);

	if(targetBalance === null) targetBalance = 0;

	db.add(`userBalance_${targetMember.id}`, amount);

	message.channel.send(`**Вы успешно отправили $${amount} участнику ${targetMember.user.tag}**`);

  let alog = message.guild.channels.find(`name`, "admin-log");
  if(!alog) return message.channel.send("`Ошибка #80.` Обратитесь к Разработчику бота.");
  alog.send(`${message.author} использовал команду **.givemoney** на пользователе **${targetMember.user.tag}**. Amount: $${amount}`);

  return;
}

module.exports.config = {
	command: "givemoney"
}
