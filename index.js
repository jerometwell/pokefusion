#!/usr/bin/env node

const ora = require("ora");
const fetch = require("node-fetch");
const termImg = require("terminal-image");
const cheerio = require("cheerio");
const sharp = require("sharp");

(async () => {
  try {
    const args = process.argv.slice(2);

    const url = ["https://pokemon.alexonsager.net", ...args].join("/");

    const spinner = ora("Fusing Pokémon...").start();

    const html = await fetch(url).then((res) => res.text());
    const $ = cheerio.load(html);

    const pokemon = {
      name: $("#pk_name").text(),
      src: $("#pk_img").attr("src"),
    };

    const image = await fetch(pokemon.src);
    const buffer = await image.buffer();
    const trimmed = await sharp(buffer).trim().toBuffer();

    spinner.stop();

    // use fixed width to prevent image from rendering at 100% width/centred
    // Cap height = 20 to fit in default unix 80x24 terminal
    console.log(await termImg.buffer(trimmed, { width: 50, height: 20 }));
    console.log(pokemon.name);
  } catch (e) {
    console.log(`An error occurred. ${e.message}`);
  }
})();
