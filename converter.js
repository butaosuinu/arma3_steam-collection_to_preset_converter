"use strict"
const fs = require('fs')
const path = require('path')
const ejs = require('ejs')
const cheerio = require('cheerio')
const moment = require('moment')

const importFile = () => {
	return cheerio.load(fs.readFileSync(process.argv[2]))
}

(() => {
	const items = []
	const $ = importFile()
	$('.collectionItemDetails .workshopItemTitle').each((i, e) => {
		items[i] = {name: $(e).text()}
	})
	$('.collectionItemDetails>a:first-child').each((i, e) => {
		items[i]['url'] = $(e).attr('href')
	})
	fs.readFile('./template.ejs', 'utf-8', (err, data) => {
		if (err) {console.error(err)}
		const str = ejs.render(data, {steamItems: items, localItems: []})
		fs.writeFile(path.join('dist', 'Arma3_generated_preset_' + moment().format('YYYY_MM_DD_x') + '.html'), str, (err) => {
			if (err) {console.error(err)}
			console.log('done.')
		})
	})
})()