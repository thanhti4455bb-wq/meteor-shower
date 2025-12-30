/**
 * 流星雨数据自动更新脚本
 * 每天自动运行，更新网站内容
 */

const fs = require('fs');
const path = require('path');

// 流星雨日历数据（包含2025年剩余和2026年）
const meteorShowers = [
    // 2025年流星雨
    {
        name: "Quadrantids",
        nameCn: "象限仪座",
        peakStart: "2025-01-03",
        peakEnd: "2025-01-04",
        zhr: "80-120",
        zhrMax: 120,
        moonPhase: "Fair (Waxing Crescent)",
        parentBody: "Asteroid 2003 EH1",
        wikiLink: "https://en.wikipedia.org/wiki/Quadrantids"
    },
    {
        name: "Lyrids",
        nameCn: "天琴座",
        peakStart: "2025-04-22",
        peakEnd: "2025-04-22",
        zhr: "18",
        zhrMax: 18,
        moonPhase: "Good",
        parentBody: "Comet Thatcher",
        wikiLink: "https://en.wikipedia.org/wiki/Lyrids"
    },
    {
        name: "Eta Aquariids",
        nameCn: "宝瓶座η",
        peakStart: "2025-05-06",
        peakEnd: "2025-05-06",
        zhr: "50",
        zhrMax: 50,
        moonPhase: "Variable",
        parentBody: "Comet Halley",
        wikiLink: "https://en.wikipedia.org/wiki/Eta_Aquariids"
    },
    {
        name: "Perseids",
        nameCn: "英仙座",
        peakStart: "2025-08-12",
        peakEnd: "2025-08-13",
        zhr: "100",
        zhrMax: 100,
        moonPhase: "Variable",
        parentBody: "Comet Swift-Tuttle",
        wikiLink: "https://en.wikipedia.org/wiki/Perseids"
    },
    {
        name: "Orionids",
        nameCn: "猎户座",
        peakStart: "2025-10-21",
        peakEnd: "2025-10-21",
        zhr: "20",
        zhrMax: 20,
        moonPhase: "Excellent (New Moon)",
        parentBody: "Comet Halley",
        wikiLink: "https://en.wikipedia.org/wiki/Orionids"
    },
    {
        name: "Leonids",
        nameCn: "狮子座",
        peakStart: "2025-11-17",
        peakEnd: "2025-11-18",
        zhr: "15",
        zhrMax: 15,
        moonPhase: "Good (Waning Crescent)",
        parentBody: "Comet Tempel-Tuttle",
        wikiLink: "https://en.wikipedia.org/wiki/Leonids"
    },
    {
        name: "Geminids",
        nameCn: "双子座",
        peakStart: "2025-12-13",
        peakEnd: "2025-12-14",
        zhr: "150",
        zhrMax: 150,
        moonPhase: "Excellent (26% Moon)",
        parentBody: "Asteroid 3200 Phaethon",
        wikiLink: "https://en.wikipedia.org/wiki/Geminids",
        isFeatured: true
    },
    {
        name: "Ursids",
        nameCn: "小熊座",
        peakStart: "2025-12-21",
        peakEnd: "2025-12-22",
        zhr: "10",
        zhrMax: 10,
        moonPhase: "Excellent (6% Moon)",
        parentBody: "Comet 8P/Tuttle",
        wikiLink: "https://en.wikipedia.org/wiki/Ursids"
    },
    // 2026年流星雨
    {
        name: "Quadrantids",
        nameCn: "象限仪座",
        peakStart: "2026-01-03",
        peakEnd: "2026-01-04",
        zhr: "80-120",
        zhrMax: 120,
        moonPhase: "Good (Waxing Gibbous)",
        parentBody: "Asteroid 2003 EH1",
        wikiLink: "https://en.wikipedia.org/wiki/Quadrantids"
    },
    {
        name: "Lyrids",
        nameCn: "天琴座",
        peakStart: "2026-04-22",
        peakEnd: "2026-04-23",
        zhr: "18",
        zhrMax: 18,
        moonPhase: "Excellent (New Moon)",
        parentBody: "Comet Thatcher",
        wikiLink: "https://en.wikipedia.org/wiki/Lyrids"
    },
    {
        name: "Eta Aquariids",
        nameCn: "宝瓶座η",
        peakStart: "2026-05-05",
        peakEnd: "2026-05-06",
        zhr: "50",
        zhrMax: 50,
        moonPhase: "Good (Waning Gibbous)",
        parentBody: "Comet Halley",
        wikiLink: "https://en.wikipedia.org/wiki/Eta_Aquariids"
    },
    {
        name: "Perseids",
        nameCn: "英仙座",
        peakStart: "2026-08-12",
        peakEnd: "2026-08-13",
        zhr: "100",
        zhrMax: 100,
        moonPhase: "Excellent (New Moon)",
        parentBody: "Comet Swift-Tuttle",
        wikiLink: "https://en.wikipedia.org/wiki/Perseids",
        isFeatured: true
    },
    {
        name: "Orionids",
        nameCn: "猎户座",
        peakStart: "2026-10-21",
        peakEnd: "2026-10-22",
        zhr: "20",
        zhrMax: 20,
        moonPhase: "Good (First Quarter)",
        parentBody: "Comet Halley",
        wikiLink: "https://en.wikipedia.org/wiki/Orionids"
    },
    {
        name: "Leonids",
        nameCn: "狮子座",
        peakStart: "2026-11-17",
        peakEnd: "2026-11-18",
        zhr: "15",
        zhrMax: 15,
        moonPhase: "Excellent (New Moon)",
        parentBody: "Comet Tempel-Tuttle",
        wikiLink: "https://en.wikipedia.org/wiki/Leonids"
    },
    {
        name: "Geminids",
        nameCn: "双子座",
        peakStart: "2026-12-13",
        peakEnd: "2026-12-14",
        zhr: "150",
        zhrMax: 150,
        moonPhase: "Good (Waxing Crescent)",
        parentBody: "Asteroid 3200 Phaethon",
        wikiLink: "https://en.wikipedia.org/wiki/Geminids",
        isFeatured: true
    },
    {
        name: "Ursids",
        nameCn: "小熊座",
        peakStart: "2026-12-22",
        peakEnd: "2026-12-23",
        zhr: "10",
        zhrMax: 10,
        moonPhase: "Excellent (Waxing Crescent)",
        parentBody: "Comet 8P/Tuttle",
        wikiLink: "https://en.wikipedia.org/wiki/Ursids"
    }
];

/**
 * 获取当前或下一个流星雨事件
 */
function getCurrentOrNextShower() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 首先检查是否有正在进行的流星雨
    for (const shower of meteorShowers) {
        const start = new Date(shower.peakStart);
        const end = new Date(shower.peakEnd);
        end.setDate(end.getDate() + 1); // 包含结束日

        if (today >= start && today <= end) {
            return { shower, status: 'active' };
        }
    }

    // 查找下一个流星雨
    for (const shower of meteorShowers) {
        const start = new Date(shower.peakStart);
        if (start > today) {
            return { shower, status: 'upcoming' };
        }
    }

    // 如果没有更多流星雨，返回列表第一个（未来年份的）
    return { shower: meteorShowers[0], status: 'next_year' };
}

/**
 * 计算距离流星雨的天数
 */
function getDaysUntil(dateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

/**
 * 格式化日期显示
 */
function formatPeakDate(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    if (start === end) {
        return `${months[startDate.getMonth()]} ${startDate.getDate()}`;
    }
    return `${months[startDate.getMonth()]} ${startDate.getDate()}-${endDate.getDate()}`;
}

/**
 * 生成动态Hero内容
 */
function generateHeroContent(current) {
    const { shower, status } = current;
    const daysUntil = getDaysUntil(shower.peakStart);

    let badge, subtitle, title, description;

    if (status === 'active') {
        badge = 'Live Event - Happening Now';
        subtitle = 'The Best Meteor Shower of 2025';
        title = `${shower.name} Meteor Shower<br>Peak Tonight!`;
        description = `Up to <strong>${shower.zhr} meteors per hour</strong> visible tonight (${formatPeakDate(shower.peakStart, shower.peakEnd)}). ${shower.moonPhase.includes('Excellent') ? 'Near-perfect viewing conditions. ' : ''}This is ${shower.isFeatured ? 'the #1 meteor shower of 2025' : 'one of the major meteor showers'} - don't miss it!`;
    } else if (daysUntil <= 7) {
        badge = `${daysUntil} Days Until Peak`;
        subtitle = 'Coming This Week';
        title = `${shower.name} Meteor Shower<br>Peaks ${formatPeakDate(shower.peakStart, shower.peakEnd)}`;
        description = `Get ready for up to <strong>${shower.zhr} meteors per hour</strong>. ${shower.moonPhase.includes('Excellent') ? 'Excellent viewing conditions expected. ' : ''}Mark your calendar!`;
    } else {
        badge = `Next Event: ${formatPeakDate(shower.peakStart, shower.peakEnd)}`;
        subtitle = `${daysUntil} Days Away`;
        title = `${shower.name} Meteor Shower<br>Coming Soon`;
        description = `The next major meteor shower peaks ${formatPeakDate(shower.peakStart, shower.peakEnd)} with up to <strong>${shower.zhr} meteors per hour</strong>.`;
    }

    return { badge, subtitle, title, description, shower, status, daysUntil };
}

/**
 * 更新HTML文件中的动态内容
 */
function updateHtmlFile() {
    const htmlPath = path.join(__dirname, '..', 'index.html');
    let html = fs.readFileSync(htmlPath, 'utf8');

    const current = getCurrentOrNextShower();
    const heroContent = generateHeroContent(current);

    // 更新 LIVE badge
    const badgeRegex = /(<span class="live-badge">)[^<]*(Live Event - Happening Now|Days Until Peak|Next Event:[^<]*)<\/span>/;
    if (heroContent.status === 'active') {
        html = html.replace(badgeRegex, `$1Live Event - Happening Now</span>`);
    } else if (heroContent.daysUntil <= 7) {
        html = html.replace(badgeRegex, `$1${heroContent.daysUntil} Days Until Peak</span>`);
    } else {
        html = html.replace(badgeRegex, `$1Next Event: ${formatPeakDate(heroContent.shower.peakStart, heroContent.shower.peakEnd)}</span>`);
    }

    // 更新 meta 标签中的日期（用于SEO）
    const today = new Date().toISOString().split('T')[0];
    const metaDateRegex = /(<meta name="date" content=")[^"]*(")/;
    if (html.match(metaDateRegex)) {
        html = html.replace(metaDateRegex, `$1${today}$2`);
    }

    // 保存更新后的HTML
    fs.writeFileSync(htmlPath, html);

    console.log('=== Meteor Shower Auto-Update ===');
    console.log(`Date: ${new Date().toISOString()}`);
    console.log(`Current/Next Shower: ${heroContent.shower.name}`);
    console.log(`Status: ${heroContent.status}`);
    console.log(`Days until peak: ${heroContent.daysUntil}`);
    console.log('HTML updated successfully!');
}

/**
 * 生成数据JSON文件供前端使用
 */
function generateDataJson() {
    const dataPath = path.join(__dirname, '..', 'data', 'meteor-showers.json');
    const dataDir = path.dirname(dataPath);

    // 确保目录存在
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    const current = getCurrentOrNextShower();

    const data = {
        lastUpdated: new Date().toISOString(),
        currentShower: current.shower,
        currentStatus: current.status,
        daysUntilPeak: getDaysUntil(current.shower.peakStart),
        allShowers: meteorShowers.map(shower => ({
            ...shower,
            peakFormatted: formatPeakDate(shower.peakStart, shower.peakEnd),
            daysUntil: getDaysUntil(shower.peakStart)
        }))
    };

    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    console.log('Data JSON generated successfully!');
}

// 执行更新
try {
    updateHtmlFile();
    generateDataJson();
    console.log('\n✅ All updates completed successfully!');
} catch (error) {
    console.error('❌ Error during update:', error);
    process.exit(1);
}
