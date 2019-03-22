const config = require("./config.json");
const Discord = require("discord.js");
const fs = require('fs');
const db = require('quick.db');

const bot = new Discord.Client();

const items = JSON.parse(fs.readFileSync('items.json', 'utf8'));

const serverStats = {
		guildID: '509046168378933268',
		totalUserID: '529069328914710532',
		botCountID: '529069423244476436'
};

bot.commands = new Discord.Collection();

	fs.readdir('./commands/', (err, files) => {
		if(err) console.error(err);

		var jsfiles = files.filter(f => f.split('.').pop() === 'js');
		if(jsfiles.length <= 0) { return console.log('No commands found...')}
		else { console.log(jsfiles.length + ' commands found.') }

			jsfiles.forEach((f, i) => {
				var cmds = require(`./commands/${f}`);
				console.log(`Command ${f} loading...`);
				bot.commands.set(cmds.config.command, cmds);
			})

	})

	bot.on('ready', () => console.log('Launched!'));

	bot.on('guildMemberAdd', member => {
		if(member.guild.id !== serverStats.guildID) return;
		bot.channels.get(serverStats.totalUserID).setName(`Всего участников: ${member.guild.memberCount}`);
		bot.channels.get(serverStats.botCountID).setName(`Ботов всего: ${member.guild.members.filter(m => m.user.bot).size}`);
	});

	bot.on('guildMemberRemove', member => {

		if(member.guild.id !== serverStats.guildID) return;
		bot.channels.get(serverStats.totalUserID).setName(`Всего участников: ${member.guild.memberCount}`);
		bot.channels.get(serverStats.botCountID).setName(`Всего ботов: ${member.guild.members.filter(m => m.user.bot).size}`);
	});

	bot.on("message", message => {

		//Var
		let sender = message.author;
		let msg = message.content.toUpperCase();
		let prefix = "."
		var cont = message.content.slice(prefix.length).split(" ");
		var args = cont.slice(1);

		if(!message.content.startsWith(prefix)) return;

		var cmd = bot.commands.get(cont[0])
		if (cmd) cmd.run(bot, message, args);

	//Events



	if (msg == prefix + 'TEST') {
		message.channel.send('Testing...')
	}

	if (msg.startsWith(`${prefix}BUY`)) {

		//Variables
		let categories = [];

		if(!args.join(" ")) {
			for (var i in items) {
				if (!categories.includes(items[i].type)) {
					categories.push(items[i].type)
				}
			}
			const embed = new Discord.RichEmbed()
				.setDescription(`Доступные предметы`)
				.setColor(0xd4af37)

			for (var i = 0; i < categories.length; i++) {

				//Variables
				var tempDesc = '';

				for (var c in items) {
					if(categories[i] === items[c].type) {
						tempDesc += `${items[c].name} - $${items[c].price} - ${items[c].desc}\n`;
					}
				}

				embed.addField(categories[i], tempDesc);
			}
			message.channel.send({embed});


}


	let itemName = '';
	let itemPrice = 0;
	let itemDesc = '';

	for (var i in items) {
		if(args.join(" ").trim().toUpperCase() === items[i].name.toUpperCase()) {
			itemName = items[i].name;
			itemPrice = items[i].price;
			itemDesc = items[i].desc;
		}
	}

	if (itemName === '') {
		return message.channel.send(`**Предмет ${args.join(" ").trim()} не найден!**`)
	}

	let selfBalance = db.fetch(`userBalance_${message.author.id}`);

	if (selfBalance < itemPrice) {
		return message.channel.send(`**У Вас не хватает средств для покупки данного предмета**`);
	}

	db.subtract(`userBalance_${message.author.id}`, parseInt(`${itemPrice}`))
			message.channel.send('**Ты купил ' + itemName + '!**');
			if(itemName === "Helper Role") {
					message.guild.members.get(message.author.id).addRole(message.guild.roles.find('name', 'Helper'));
			}
	}


})

bot.on("ready", async () => {

console.log(`${bot.user.username} is online!`)

});

bot.login(config.token);
