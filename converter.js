"use strict"
const fs = require('fs')
const ejs = require('ejs')
const cheerio = require('cheerio')

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
		fs.writeFile('Arma3_generated_preset.html', str, (err) => {
			if (err) {console.error(err)}
			console.log('done.')
		})
	})
})()