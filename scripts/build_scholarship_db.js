const fs = require('fs');

const csv4Path = 'C:/Users/user/Desktop/scholarship-class4-tests/test-links.csv';
const csv7Path = 'C:/Users/user/Desktop/scholarship-class7-tests/test-links.csv';
const targetJson = 'C:/Users/user/Desktop/test/data/scholarship_tests_database.json';

function parseCsv(csvPath, classLevel, seriesId) {
    if (!fs.existsSync(csvPath)) return [];
    const lines = fs.readFileSync(csvPath, 'utf-8').split('\n').filter(Boolean);
    const records = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const parts = line.split(',');
        if (parts.length < 10) continue;

        const id = parts[0].trim();
        const isP1 = id.includes('-P1-');
        const testNum = parseInt(parts[3].trim(), 10);
        
        const quoteStart = line.indexOf('"');
        const quoteEnd = line.lastIndexOf('"');
        const testName = (quoteStart !== -1 && quoteEnd !== -1)
            ? line.substring(quoteStart + 1, quoteEnd)
            : parts[4].trim();

        const remainder = line.substring(quoteEnd + 1).split(',');
        const directLink = remainder[3].trim();
        const permalink = remainder[4].trim();
        const ghLink = remainder[5].trim();

        const examTitle = classLevel === 4
            ? `इयत्ता चौथी शिष्यवृत्ती - ${isP1 ? 'पेपर १ (मराठी व गणित)' : 'पेपर २ (इंग्रजी व बुद्धिमत्ता)'}`
            : `इयत्ता सातवी शिष्यवृत्ती - ${isP1 ? 'पेपर १ (मराठी व गणित)' : 'पेपर २ (इंग्रजी व बुद्धिमत्ता)'}`;

        const categoryKey = classLevel === 4
            ? (isP1 ? 'scholarship4_p1' : 'scholarship4_p2')
            : (isP1 ? 'scholarship7_p1' : 'scholarship7_p2');

        records.push({
            id: id,
            seriesId: seriesId,
            classLevel: classLevel,
            paper: isP1 ? 1 : 2,
            testNumber: testNum,
            examName: examTitle,
            category: categoryKey,
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
    return records;
}

const c4Records = parseCsv(csv4Path, 4, 'scholarship_class4');
const c7Records = parseCsv(csv7Path, 7, 'scholarship_class7');

const allRecords = [...c4Records, ...c7Records];

fs.writeFileSync(targetJson, JSON.stringify(allRecords, null, 2), 'utf-8');

console.log(`[SUCCESS] Generated scholarship_tests_database.json with ${allRecords.length} records!`);
console.log(`Class 4 Tests: ${c4Records.length} (P1: ${c4Records.filter(r=>r.paper===1).length}, P2: ${c4Records.filter(r=>r.paper===2).length})`);
console.log(`Class 7 Tests: ${c7Records.length} (P1: ${c7Records.filter(r=>r.paper===1).length}, P2: ${c7Records.filter(r=>r.paper===2).length})`);
