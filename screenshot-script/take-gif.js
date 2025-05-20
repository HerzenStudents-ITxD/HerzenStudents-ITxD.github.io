const { chromium } = require('playwright');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const fs = require('fs').promises;
const path = require('path');

// Settings
const WIDTH = 1280;
const HEIGHT = 720;
const FPS = 10;
const DURATION = 5000; // 5 seconds
const FRAME_INTERVAL = 1000 / FPS;
const FRAME_COUNT = Math.floor(DURATION / FRAME_INTERVAL);

// Set FFmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

// List of sites with specific actions
const sites = [
    { id: 'herzen-tutor', url: 'https://itvd.online/herzen-tutor/' },
    { id: 'technopark-proj', url: 'https://itvd.online/technopark-proj/' },
    { id: 'virtual-museum', url: 'https://itvd.online/virtual_museum/' },
    { id: 'itdx-skills', url: 'https://www.itvd.online/ITxD-skills/' },
    { id: 'pelican-magazine', url: 'https://www.itvd.online/pelican-magazine/' },
    { id: 'wiki-guide', url: 'https://www.itvd.online/wiki-guide/' },
    { id: 'herzen-books', url: 'https://www.itvd.online/herzenbooks/' },
    { id: 'open-campus', url: 'https://itvd.online/open-campus/' },
    {
        id: 'herzen-map',
        url: 'https://itvd.online/herzen-map/',
        is3D: true,
        actions: async (page, frameIndex, totalFrames) => {
            const centerX = WIDTH / 2;
            const centerY = HEIGHT / 2;
            const progress = frameIndex / (totalFrames - 1);
            const maxMoveX = 600; // Max sideways movement

            if (frameIndex === 0) {
                console.log('Initializing herzen-map camera...');
                // Reset scroll and set initial camera height
                await page.evaluate(() => {
                    window.scrollTo(0, 0);
                    document.body.style.overflow = 'hidden';
                    if (window.camera) {
                        window.camera.position.set(0, 5, 10); // Higher initial position
                    }
                });
                await page.mouse.move(centerX, centerY);
                await page.mouse.down(); // Start dragging
            }

            // Smooth sideways movement during frame capture
            const moveX = centerX + maxMoveX * progress;
            await page.mouse.move(moveX, centerY, { steps: 10 });
            console.log(`herzen-map frame ${frameIndex + 1}: Moved to x=${moveX}`);

            if (frameIndex === totalFrames - 1) {
                await page.mouse.up(); // Release LMB at the end
            }
        }
    },
    {
        id: 'mushroom-hunter',
        url: 'https://itvd.online/mushroom-hunter/',
        is3D: true,
        actions: async (page, frameIndex, totalFrames) => {
            const centerX = WIDTH / 2;
            const centerY = HEIGHT / 2;
            const progress = frameIndex / (totalFrames - 1);
            const maxMoveX = 600; // Max sideways movement

            if (frameIndex === 0) {
                console.log('Initializing mushroom-hunter camera...');
                // Reset scroll and set initial camera position
                await page.evaluate(() => {
                    window.scrollTo(0, 0);
                    document.body.style.overflow = 'hidden';
                    if (window.camera) {
                        window.camera.position.set(0, 0, 0); // Reset to origin
                    }
                });
                await page.keyboard.down('w'); // Start holding 'w'
                await page.mouse.move(centerX, centerY);
                await page.mouse.click(centerX, centerY); // Initial LMB click
                console.log('mushroom-hunter: Started holding "w" and clicked');
            }

            // Smooth sideways movement during frame capture
            const moveX = centerX + maxMoveX * progress;
            await page.mouse.move(moveX, centerY, { steps: 10 });
            console.log(`mushroom-hunter frame ${frameIndex + 1}: Moved to x=${moveX}`);

            if (frameIndex === totalFrames - 1) {
                await page.keyboard.up('w'); // Release 'w' at the end
            }
        }
    }
];

async function ensurePlaywrightBrowsers() {
    try {
        const { execSync } = require('child_process');
        console.log('Checking Playwright browser installation...');
        execSync('npx playwright install', { stdio: 'inherit' });
        execSync('npx playwright install-deps', { stdio: 'inherit' });
    } catch (error) {
        console.error('Error installing browsers:', error);
        process.exit(1);
    }
}

async function captureGif(page, site, outputPath) {
    const framesDir = path.join(__dirname, 'temp_frames', site.id);
    await fs.mkdir(framesDir, { recursive: true });

    try {
        // Wait for models to load for 3D sites
        if (site.is3D) {
            console.log(`Waiting for ${site.id} models to load...`);
            try {
                await page.waitForSelector('canvas', { timeout: 20000 });
                console.log('Canvas detected, models likely loaded');
            } catch (error) {
                console.warn('Canvas not found, falling back to timeout');
                await page.waitForTimeout(15000); // Fallback 15s wait
            }
        }

        // Get total height for non-3D sites
        let totalHeight = 0;
        if (!site.is3D) {
            totalHeight = await page.evaluate(() => document.body.scrollHeight);
        }

        for (let i = 0; i < FRAME_COUNT; i++) {
            const progress = i / (FRAME_COUNT - 1);

            // Execute site-specific actions for 3D sites or scroll for non-3D sites
            if (site.is3D && site.actions) {
                await site.actions(page, i, FRAME_COUNT);
            } else {
                await page.evaluate(({ progress, totalHeight }) => {
                    window.scrollTo({
                        top: totalHeight * progress,
                        behavior: 'smooth'
                    });
                }, { progress, totalHeight });
                await page.waitForTimeout(100); // Brief wait for scroll to settle
            }

            const framePath = path.join(framesDir, `frame_${i.toString().padStart(4, '0')}.png`);
            await page.screenshot({
                path: framePath,
                animations: 'allow',
                fullPage: false // Capture viewport only for scrolling effect
            });
            console.log(`Captured frame ${i + 1}/${FRAME_COUNT} for ${site.id}`);
            await page.waitForTimeout(FRAME_INTERVAL);
        }

        await new Promise((resolve, reject) => {
            console.log(`Creating GIF for ${site.id}...`);
            ffmpeg()
                .input(path.join(framesDir, 'frame_%04d.png'))
                .inputFPS(FPS)
                .outputOptions([
                    '-f gif',
                    '-filter_complex', '[0:v] split [a][b];[a] palettegen [p];[b][p] paletteuse'
                ])
                .save(outputPath)
                .on('end', () => {
                    console.log(`GIF created: ${outputPath}`);
                    resolve();
                })
                .on('error', (err) => {
                    console.error(`Error creating GIF: ${err.message}`);
                    reject(err);
                });
        });

    } catch (error) {
        console.error(`Error capturing GIF for ${site.id}:`, error);
        throw error;
    } finally {
        await fs.rm(framesDir, { recursive: true, force: true });
    }
}

async function takeScreenshots() {
    await ensurePlaywrightBrowsers();

    const browser = await chromium.launch({
        headless: true, // Headless mode
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
            console.log(`\nProcessing ${site.id}...`);
            await page.goto(site.url, {
                waitUntil: 'networkidle',
                timeout: 60000
            });

            // Wait for page to fully load
            await page.waitForTimeout(2000);

            const gifPath = path.join(outputDir, `${site.id}.gif`);
            await captureGif(page, site, gifPath);

        } catch (error) {
            console.error(`Error processing ${site.id}:`, error.message);
        }
    }

    await browser.close();
}

(async () => {
    try {
        await takeScreenshots();
        console.log('\nProcess completed!');
    } catch (error) {
        console.error('\nCritical error:', error);
        process.exit(1);
    }
})();