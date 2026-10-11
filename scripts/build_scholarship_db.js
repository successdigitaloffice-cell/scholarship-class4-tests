const fs = require('fs');

const csvPath = 'C:/Users/user/Desktop/scholarship-class4-tests/test-links.csv';
const targetJson = 'C:/Users/user/Desktop/test/data/scholarship_tests_database.json';

const lines = fs.readFileSync(csvPath, 'utf-8').split('\n').filter(Boolean);
const records = [];

for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const parts = line.split(',');
    if (parts.length < 10) continue;

    const id = parts[0].trim();
    const isP1 = id.includes('-P1-');
    const testNum = parseInt(parts[3].trim(), 10);
    // test name is enclosed in quotes
    const quoteStart = line.indexOf('"');
    const quoteEnd = line.lastIndexOf('"');
    const testName = (quoteStart !== -1 && quoteEnd !== -1)
        ? line.substring(quoteStart + 1, quoteEnd)
        : parts[4].trim();

    // After quotes: ...,20,40,directLink,permalink,ghLink,...
    const remainder = line.substring(quoteEnd + 1).split(',');
    const directLink = remainder[3].trim();
    const permalink = remainder[4].trim();
    const ghLink = remainder[5].trim();

    records.push({
        id: id,
        seriesId: 'scholarship_class4',
        classLevel: 4,
        paper: isP1 ? 1 : 2,
        testNumber: testNum,
        examName: `इयत्ता चौथी शिष्यवृत्ती - ${isP1 ? 'पेपर १ (मराठी व गणित)' : 'पेपर २ (इंग्रजी व बुद्धिमत्ता)'}`,
        category: isP1 ? 'scholarship4_p1' : 'scholarship4_p2',
        subjectTopic: testName,
        testLink: directLink,
        dedicatedLink: permalink,
        githubLink: ghLink,
        status: 'Ready',
        scheduledDate: '',
        postedAt: null,
        postedGroups: [],
        error: null
    });
}

fs.writeFileSync(targetJson, JSON.stringify(records, null, 2), 'utf-8');
console.log(`[SUCCESS] Re-built scholarship_tests_database.json with ${records.length} records! Paper 1 count: ${records.filter(r => r.paper === 1).length}, Paper 2 count: ${records.filter(r => r.paper === 2).length}`);
