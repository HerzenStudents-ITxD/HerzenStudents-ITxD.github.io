const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// List of websites to screenshot (replace with your actual URLs)
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
    { id: 'herzen-map', url: 'https://itvd.online/herzen-map/' },
    { id: 'mushroom-hunter', url: 'https://itvd.online/mushroom-hunter/' }
];

async function takeScreenshots() {
    // Launch Puppeteer browser
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Set viewport size for consistent screenshots
    await page.setViewport({ width: 1280, height: 720 });

    // Create output directory if it doesn't exist
    const outputDir = path.join(__dirname, 'public');
    await fs.mkdir(outputDir, { recursive: true });

    // Iterate through sites
    for (const site of sites) {
        console.log(`Capturing screenshot for ${site.id}...`);
        try {
            // Navigate to the URL
            await page.goto(site.url, { waitUntil: 'networkidle2', timeout: 30000 });

            // Take screenshot
            const screenshotPath = path.join(outputDir, `${site.id}.png`);
            await page.screenshot({ 
                path: screenshotPath,
                fullPage: false,
                clip: { x: 0, y: 0, width: 1280, height: 720 }
            });
            console.log(`Saved screenshot for ${site.id} at ${screenshotPath}`);
        } catch (error) {
            console.error(`Failed to capture screenshot for ${site.id}: ${error.message}`);
            // Optionally save a placeholder image or log the failure
        }
    }

    // Close the browser
    await browser.close();
    console.log('All screenshots completed.');
}

// Run the script
takeScreenshots().catch(error => {
    console.error('Error in screenshot process:', error);
    process.exit(1);
});