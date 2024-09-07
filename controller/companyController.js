const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer')
const companyModel = require('../models/Company');
const fs = require('fs');
const path = require('path')

exports.scrapeData = async(req,res)=>{
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ message: 'URL is required' });
    }

    try {
        // Launch Puppeteer and navigate to the URL
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' }); // Wait for the network to be idle

        // Extract data from the page using Puppeteer
        const scrapedData = await page.evaluate(() => {
            // Get name (title or meta tag)
            const name = document.querySelector('meta[property="og:site_name"]')?.getAttribute('content') ||
                         document.querySelector('title')?.innerText;

            // Get description (meta description)
            const description = document.querySelector('meta[name="description"]')?.getAttribute('content') ||
                                document.querySelector('meta[property="og:description"]')?.getAttribute('content');

            // Get logo (meta og:image or link rel="icon")
            let logo = document.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
                       document.querySelector('link[rel="icon"]')?.getAttribute('href') ||
                       document.querySelector('link[rel="shortcut icon"]')?.getAttribute('href');

            // If logo is a relative path, prepend the domain (handled later in code)
            if (logo && !logo.startsWith('http')) {
                const baseUrl = window.location.origin;
                logo = new URL(logo, baseUrl).href;
            }

            // Extract social links
            const socialLinks = {};
            document.querySelectorAll('a[href]').forEach((elem) => {
                const href = elem.getAttribute('href');
                if (href.includes('facebook.com')) socialLinks.facebook = href;
                if (href.includes('twitter.com')) socialLinks.twitter = href;
                if (href.includes('linkedin.com')) socialLinks.linkedin = href;
                if (href.includes('instagram.com')) socialLinks.instagram = href;
            });

            let email = null;
            const emailAnchor = document.querySelector('a[href^="mailto:"]');
            if (emailAnchor) {
                email = emailAnchor.getAttribute('href').replace('mailto:', '');
            }

            // Extract phone
            let phone = null;
            const phoneAnchor = document.querySelector('a[href^="tel:"]');
            if (phoneAnchor) {
                phone = phoneAnchor.getAttribute('href').replace('tel:', '');
            }

            // Extract address (if available)
            const address = document.querySelector('address')?.innerText || null;


            return {
                name,
                description,
                logo,
                socialLinks,
                email,
                phone,
                address
            };
        });

        // Ensure the screenshots directory exists
        // const screenshotsDir = path.join(__dirname, '../screenshots');
        // if (!fs.existsSync(screenshotsDir)) {
        //     fs.mkdirSync(screenshotsDir);
        // }


        // Take screenshot
        const screenshotPath = `screenshots/${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath });

        // Close Puppeteer
        await browser.close();

        // Save the scraped data to the database
        const company = await companyModel.create({...scrapedData,screenshot:screenshotPath});

        // Respond with the scraped data
        res.status(200).json({
            status: 'success',
            data: company
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to scrape the website' });
    }
}


exports.companyDetails = async(req,res)=>{
    const {id} = req.params;
    try{
        const data = await companyModel.findById({_id:id});
        // console.log(data)
        res.status(200).json({
            status:'success',
            data:data
        })
    }
    catch(err){
        res.json({
            error:err
        })
    }
}