const { chromium } = require('playwright');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const fs = require('fs').promises;
const path = require('path');

// Настройки
const WIDTH = 1280;
const HEIGHT = 720;
const FPS = 10;
const DURATION = 5000; // 5 секунд
const FRAME_INTERVAL = 1000 / FPS;
const FRAME_COUNT = Math.floor(DURATION / FRAME_INTERVAL);

// Установка пути к FFmpeg
ffmpeg.setFfmpegPath(ffmpegPath);

// Список сайтов
const sites = [
    { id: 'herzen-tutor', url: 'https://itvd.online/herzen-tutor/' },
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

async function ensurePlaywrightBrowsers() {
    try {
        const { execSync } = require('child_process');
        console.log('Проверка установки браузеров Playwright...');
        execSync('npx playwright install', { stdio: 'inherit' });
        execSync('npx playwright install-deps', { stdio: 'inherit' });
    } catch (error) {
        console.error('Ошибка при установке браузеров:', error);
        process.exit(1);
    }
}

async function captureGif(page, site, outputPath) {
    const framesDir = path.join(__dirname, 'temp_frames', site.id);
    await fs.mkdir(framesDir, { recursive: true });

    try {
        const totalHeight = await page.evaluate(() => document.body.scrollHeight);
        
        for (let i = 0; i < FRAME_COUNT; i++) {
            const progress = i / (FRAME_COUNT - 1);
            // Исправлено: передаем один объект с параметрами
            await page.evaluate(({progress, totalHeight}) => {
                window.scrollTo({
                    top: totalHeight * progress,
                    behavior: 'smooth'
                });
            }, {progress, totalHeight});

            await page.waitForTimeout(FRAME_INTERVAL);

            const framePath = path.join(framesDir, `frame_${i.toString().padStart(4, '0')}.png`);
            await page.screenshot({ 
                path: framePath,
                animations: 'allow'
            });
            console.log(`Снят кадр ${i+1}/${FRAME_COUNT} для ${site.id}`);
        }

        await new Promise((resolve, reject) => {
            console.log(`Создаем GIF для ${site.id}...`);
            ffmpeg()
                .input(path.join(framesDir, 'frame_%04d.png'))
                .inputFPS(FPS)
                .outputOptions([
                    '-f gif',
                    '-filter_complex', '[0:v] split [a][b];[a] palettegen [p];[b][p] paletteuse'
                ])
                .save(outputPath)
                .on('end', () => {
                    console.log(`GIF создан: ${outputPath}`);
                    resolve();
                })
                .on('error', (err) => {
                    console.error(`Ошибка создания GIF: ${err.message}`);
                    reject(err);
                });
        });

    } catch (error) {
        console.error(`Ошибка при создании GIF для ${site.id}:`, error);
        throw error;
    } finally {
        await fs.rm(framesDir, { recursive: true, force: true });
    }
}

async function takeScreenshots() {
    await ensurePlaywrightBrowsers();

    const browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const context = await browser.newContext({
        viewport: { width: WIDTH, height: HEIGHT },
        ignoreHTTPSErrors: true
    });

    const page = await context.newPage();
    const outputDir = path.join(__dirname, 'public');
    await fs.mkdir(outputDir, { recursive: true });

    for (const site of sites) {
        try {
            console.log(`\nНачинаем обработку ${site.id}...`);
            await page.goto(site.url, { 
                waitUntil: 'networkidle', 
                timeout: 60000 
            });

            const gifPath = path.join(outputDir, `${site.id}.gif`);
            await captureGif(page, site, gifPath);

        } catch (error) {
            console.error(`Ошибка при обработке ${site.id}:`, error.message);
        }
    }

    await browser.close();
}

(async () => {
    try {
        await takeScreenshots();
        console.log('\nПроцесс завершен!');
    } catch (error) {
        console.error('\nКритическая ошибка:', error);
        process.exit(1);
    }
})();