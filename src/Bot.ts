const fs = require('fs').promises;

import * as Discord from 'discord.js';

import {Emoji} from "./Emoji";
import {BotConf} from "./BotConf";
import {getFatalCallback} from './Main';

export class Bot {
	config: BotConf;
	client: Discord.Client;

	constructor(config: BotConf) {
		this.config = config;
		this.client = new Discord.Client();
	}

	connect(): Promise<Bot> {
		return new Promise((resolve, reject) => {
			this.client.login(this.config.token);

			this.client.on('ready', () => {
				console.log(`Successfully connected as ${this.client.user.tag}.`);
				console.log(`Version 0.0.1`);
				// this.client.user.setActivity(this.config.playing_tag.message, {type: this.config.playing_tag.type});
				this.client.user.setStatus('online');
				resolve(this);

				this.client.guilds.forEach(g => this.rip(g));
			});

			this.client.on('error', (error: Error) => {
				reject(error);
			});

			// this.client.on('message', (msg) => {

			// })
		});
	}

	async rip(g: Discord.Guild) {
		let emojis: Emoji[] = [];

		g.emojis.forEach(e => {
			if (e.deleted) return;

			emojis.push({
				id: e.id,
				name: e.name,
				url: `https://cdn.discordapp.com/emojis/${e.id}.${e.animated ? "gif" : "png"}`
			});
		});

		try { await fs.mkdir('ripped') } catch (e) {};
		await fs.writeFile(`ripped/${g.id}.json`, 
			JSON.stringify({
				id: g.id,
				name: g.name,
				emojis: emojis,
				icon: `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`
			}, null, '\t'));
	}

	async shutDown() {
		try {
			console.log(`Shut down gracefully.`);
		}
		catch (e) {
			getFatalCallback("Shutdown")(e);
		}
	}
}
