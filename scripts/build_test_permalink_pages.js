const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '..');
const GITHUB_REPO = 'https://github.com/successdigitaloffice-cell/scholarship-class4-tests';
const LIVE_BASE = 'https://successdigitaloffice-cell.github.io/scholarship-class4-tests';

// Load question banks by evaluating or reading
const p1File = fs.readFileSync(path.join(BASE_DIR, 'data', 'class4_paper1.js'), 'utf-8');
const p2File = fs.readFileSync(path.join(BASE_DIR, 'data', 'class4_paper2.js'), 'utf-8');
const metaFile = fs.readFileSync(path.join(BASE_DIR, 'data', 'scholarship_class4_bank.js'), 'utf-8');

// Define global.window for Node environment
global.window = {};
eval(p1File);
eval(p2File);
eval(metaFile);

const meta = global.window.scholarshipClass4Meta;
const p1Data = global.window.scholarshipClass4.paper1;
const p2Data = global.window.scholarshipClass4.paper2;

const csvRows = [
    ['Series_ID', 'Class', 'Paper', 'Test_Number', 'Test_Name', 'Questions', 'Marks', 'Direct_Test_Link', 'Dedicated_Permalink', 'GitHub_Source_Link', 'Diagrams_Count', 'Status']
];

const p1AnswerKeysMd = ['# 📝 Paper 1 Official Answer Keys (Tests 01 to 30)\n'];
const p2AnswerKeysMd = ['# 📝 Paper 2 Official Answer Keys (Tests 01 to 30)\n'];

['paper1', 'paper2'].forEach(paperKey => {
    const isP1 = paperKey === 'paper1';
    const paperFolder = isP1 ? 'paper-1' : 'paper-2';
    const paperName = isP1 ? 'Paper 1 (मराठी + गणित)' : 'Paper 2 (इंग्रजी + बुद्धिमत्ता)';
    const dataObj = isP1 ? p1Data : p2Data;
    const namesObj = meta.papers[paperKey].testNames;
    const targetMd = isP1 ? p1AnswerKeysMd : p2AnswerKeysMd;

    for (let i = 1; i <= 30; i++) {
        const numPad = String(i).padStart(2, '0');
        const testName = namesObj[i] || `चाचणी क्र. ${i}`;
        const dir = path.join(BASE_DIR, paperFolder, `test-${numPad}`);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const directLink = `${LIVE_BASE}/test.html?paper=${paperKey}&test=${i}`;
        const permalink = `${LIVE_BASE}/${paperFolder}/test-${numPad}/`;
        const ghLink = `${GITHUB_REPO}/tree/main/${paperFolder}/test-${numPad}`;

        const qList = dataObj[i] || [];
        let diagramCount = 0;
        qList.forEach(q => {
            if (q.question.includes('<svg') || q.question.includes('<div') || q.type === 'Diagram') {
                diagramCount++;
            }
        });

        // 1. Create test-XX/index.html with auto-redirect to universal test player
        const permalinkHtml = `<!DOCTYPE html>
<html lang="mr">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0; url=../../test.html?paper=${paperKey}&test=${i}">
    <title>${testName} - इयत्ता चौथी स्कॉलरशिप</title>
    <script>window.location.href = "../../test.html?paper=${paperKey}&test=${i}";</script>
</head>
<body style="font-family: sans-serif; text-align: center; padding: 40px; background: #f8fafc;">
    <h2>चाचणी लोड होत आहे...</h2>
    <p><a href="../../test.html?paper=${paperKey}&test=${i}">येथे क्लिक करा (Click here if not redirected)</a></p>
</body>
</html>`;
        fs.writeFileSync(path.join(dir, 'index.html'), permalinkHtml, 'utf-8');

        // 2. Save individual questions.json
        fs.writeFileSync(path.join(dir, 'questions.json'), JSON.stringify({
            seriesId: `SCHOLARSHIP-C4-${isP1 ? 'P1' : 'P2'}-${numPad}`,
            classLevel: 4,
            paper: isP1 ? 1 : 2,
            testNumber: i,
            testName: testName,
            totalQuestions: qList.length,
            totalMarks: qList.length * 2,
            questions: qList
        }, null, 2), 'utf-8');

        // Add to CSV
        csvRows.push([
            `SCHOLARSHIP-C4-${isP1 ? 'P1' : 'P2'}-${numPad}`,
            'Class 4',
            isP1 ? 'Paper 1' : 'Paper 2',
            i,
            `"${testName}"`,
            qList.length,
            qList.length * 2,
            directLink,
            permalink,
            ghLink,
            diagramCount,
            'Verified & Live'
        ]);

        // Add to Answer keys Markdown
        targetMd.push(`### Test ${numPad}: ${testName}`);
        targetMd.push(`| Q.No | Correct Answer (Option) | Subject | Type |`);
        targetMd.push(`| :---: | :---: | :---: | :---: |`);
        qList.forEach((q, qIdx) => {
            targetMd.push(`| ${qIdx + 1} | पर्याय ${q.answer + 1} (${q.options[q.answer].replace(/<[^>]*>?/gm, '').substring(0, 30)}) | ${q.subject} | ${q.type} |`);
        });
        targetMd.push('\n---\n');
    }
});

// Write CSV
const csvContent = csvRows.map(r => r.join(',')).join('\n');
fs.writeFileSync(path.join(BASE_DIR, 'test-links.csv'), csvContent, 'utf-8');
console.log(`[SUCCESS] Generated test-links.csv with all 60 tests!`);

// Write Answer Keys
fs.writeFileSync(path.join(BASE_DIR, 'answer-keys', 'PAPER_1_ANSWER_KEYS.md'), p1AnswerKeysMd.join('\n'), 'utf-8');
fs.writeFileSync(path.join(BASE_DIR, 'answer-keys', 'PAPER_2_ANSWER_KEYS.md'), p2AnswerKeysMd.join('\n'), 'utf-8');
console.log(`[SUCCESS] Generated Answer Keys in answer-keys/ directory!`);
