const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// List of websites to screenshot
const sites = [
    { id: 'herzen-tutor', url: 'https://itvd.online/herzen-tutor/' },
    // { id: 'cycleapp', url: 'https://cycleapp.example.com' },
    { id: 'technopark-proj', url: 'https://itvd.online/technopark-proj/' },
    { id: 'virtual-museum', url: 'https://itvd.online/virtual_museum/' },
    { id: 'itdx-skills', url: 'https://www.itvd.online/ITxD-skills/' },
    { id: 'pelican-magazine', url: 'https://www.itvd.online/pelican-magazine/' },
    { id: 'wiki-guide', url: 'https://www.itvd.online/wiki-guide/' },
    { id: 'herzen-books', url: 'https://www.itvd.online/herzenbooks/' },
    { id: 'open-campus', url: 'https://itvd.online/open-campus/' },
    { id: 'herzen-map', url: 'https://itvd.online/herzen-map/', delay: 5000 }, // Задержка 5 сек
    { id: 'mushroom-hunter', url: 'https://itvd.online/mushroom-hunter/', delay: 5000 } // Задержка 5 сек
];

// Delay function
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function takeScreenshots() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    const outputDir = path.join(__dirname, 'public');
    await fs.mkdir(outputDir, { recursive: true });

    for (const site of sites) {
        console.log(`Capturing screenshot for ${site.id}...`);
        try {
            await page.goto(site.url, { 
                waitUntil: 'networkidle2', 
                timeout: 30000 
            });

            // Добавляем задержку только если она указана для сайта
            if (site.delay) {
                console.log(`Waiting ${site.delay/1000} seconds for ${site.id}...`);
                await delay(site.delay);
            }

            const screenshotPath = path.join(outputDir, `${site.id}.png`);
            await page.screenshot({ 
                path: screenshotPath,
                fullPage: false,
                clip: { x: 0, y: 0, width: 1280, height: 720 }
            });
            console.log(`Saved screenshot for ${site.id} at ${screenshotPath}`);
        } catch (error) {
            console.error(`Failed to capture screenshot for ${site.id}: ${error.message}`);
        }
    }

    await browser.close();
    console.log('All screenshots completed.');
}

// Запускаем скрипт
takeScreenshots().catch(error => {
    console.error('Error in screenshot process:', error);
    process.exit(1);
});