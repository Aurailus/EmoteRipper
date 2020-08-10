const fs = require('fs').promises;

import * as Discord from 'discord.js';

import {Bot} from "./Bot";
import {BotConf} from "./BotConf";

export function getFatalCallback(prefix: string, exit: boolean = true) {
	return (err: Error) => {
		console.error(`[${prefix}] A fatal error has occured:\n${err.toString()}.\n`);
		if (exit) process.exit(0);
	}
}

(async () => {
	try {
		await fs.access("./conf.json");
		const conf = JSON.parse((await fs.readFile("./conf.json")).toString()) as BotConf;

		const bot = new Bot(conf);
		await bot.connect();

		process.on('SIGINT', async () => {
			await bot.shutDown();
			process.exit();
		});
	}
	catch(e) { getFatalCallback("Initialization")(e); }
})();
