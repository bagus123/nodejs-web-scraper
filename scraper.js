const requestAsync = require('request-promise');
const cheerio = require('cheerio');
const func = require('./utils/function')
const MAX_FETCH = 100;
const URL_KARIRPAD = 'https://www.karirpad.com/Lowongan/load_vacancy/semuanya/null/[page]'
    + '?sort=newer&job_func=&salary1=&salary2=&educ=&exp1=&exp2=&age1=&age2=&stat='




// do scraping from web www.karirpad.com
async function insertOrUpdateJob(data) {
    let job = await MODELS.Job.findOne({ jobId: data.jobId });
    if (job) {
        job.name = data.name
        job.slug = data.slug
        job.url = data.url
        job.companyName = data.companyName
        job.source = data.source
        job.salary = data.salary
        job.age = data.age
        job.education = data.education
        job.urlCompanyLogo = data.urlCompanyLogo
        job.location = data.location
        job.jobLevel = data.jobLevel
        job.jobType = data.jobType
        job.jobFunction = data.jobFunction
        job.jobIndustry = data.jobIndustry
        job.jobDescription = data.jobDescription
        job.publishDate = data.publishDate
        await job.save()
    } else {
        await MODELS.Job.create(data);
    }
}

async function insertLogFetching(data) {
    await MODELS.ScrapingLog.create(data);
}

async function doScrapingKarirPad(page) {
    let source = 'www.karirpad.com'
    let currentURL = URL_KARIRPAD.replace('[page]', page)
    let html = await requestAsync(currentURL);
    let $ = cheerio.load(html);


    //loop element div class result
    $('div.result').each(async (i, el) => {

        let jobId
        let name
        let slug
        let url
        let salary
        let companyName
        let urlCompanyLogo
        let education
        let age
        let location
        let jobFunction
        let jobIndustry
        let jobLevel
        let jobType
        let publishDate
        let jobDescription


        $(el).find('div').each(async (i, el) => {

            // find job name or title, url, jobId, slug, publishDate
            if (el.attribs.class.indexOf('result_bar') > -1) {
                let divTitle = $(el).find('.result_title')
                let pos = 0;
                $(el).find('span').each((i, el) => {
                    if (pos === 0) {
                        publishDate = $(el).text()
                        publishDate = publishDate.replace('Tanggal pemasangan', '').trim()
                        publishDate = func.convertDate(publishDate)
                    }
                    pos++;
                })

                url = $(el).find('a').attr('href')
                name = $(divTitle).attr('title')
                jobId = url.split('/').slice(-1)[0]
                slug = url.split('/').slice(-2)[0]
            }

            // find company name, location, education, age
            if (el.attribs.class === 'comp_name') {
                let a = $(el).find('a')
                companyName = a.text()

                let pos = 0;
                $(el).find('span').each((i, el) => {
                    if (pos === 2) {
                        location = $(el).text()
                    }

                    if (pos === 3) {
                        education = $(el).text()
                        education = education.replace('Pendidikan :', '').trim()
                    }

                    if (pos === 4) {
                        age = $(el).text()
                    }
                    pos++;
                })
            }

            // find salary
            if (el.attribs.class === 'vac_salary') {
                let span = $(el.children).find('span')
                salary = span.text()
            }


            // find logo company
            if (el.attribs.class === 'comp_logo') {
                let img = $(el).find('img')
                urlCompanyLogo = $(img).attr('src')
            }

        })


        let htmlDetail = await requestAsync(url);
        $ = cheerio.load(htmlDetail);
        $('#vacan_job').each(async (i, el) => {
            let pos = 0;
            $(el).find('li').each(async (i, el) => {
                let div = $(el).find('div');
                if (pos === 0) {
                    jobLevel = $(div).eq(2).text()
                }

                if (pos === 1) {
                    jobFunction = $(div).eq(2).text()
                }

                if (pos === 3) {
                    jobType = $(div).eq(2).text()
                }

                pos++
            })
        })

        jobIndustry = "" // not found at the web, maybe not provide
        jobDescription = $('#vacan_terms').html().replace(/\n/g, '')

        let data = {
            jobId,
            name,
            slug,
            url,
            companyName,
            source,
            salary,
            age,
            education,
            urlCompanyLogo,
            location,
            jobLevel,
            jobType,
            jobFunction,
            jobIndustry,
            jobDescription,
            publishDate
        }

        // insert or update job
        await insertOrUpdateJob(data);

    });

    let data = { source, url: currentURL, page }
    await insertLogFetching(data)
    console.log('[DONE] : FETCH URL', currentURL)

    // recursive loop
    if (page < MAX_FETCH) {
        page += 10
        doScrapingKarirPad(page)
    }


}


module.exports = {
    run: () => {

        //do scraping from web 'www.karirpad.com'
        doScrapingKarirPad(10);

        //put here another source 
        // ..........


    }
}