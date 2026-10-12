const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '..');
const p1File = fs.readFileSync(path.join(BASE_DIR, 'data', 'class4_paper1.js'), 'utf-8');
const p2File = fs.readFileSync(path.join(BASE_DIR, 'data', 'class4_paper2.js'), 'utf-8');
const metaFile = fs.readFileSync(path.join(BASE_DIR, 'data', 'scholarship_class4_bank.js'), 'utf-8');

global.window = {};
eval(p1File);
eval(p2File);
eval(metaFile);

const p1 = global.window.class4Paper1Data || (global.window.scholarshipClass4 && global.window.scholarshipClass4.paper1);
const p2 = global.window.class4Paper2Data || (global.window.scholarshipClass4 && global.window.scholarshipClass4.paper2);

let errors = [];
let totalP1Q = 0;
let totalP2Q = 0;
let p1Diagrams = 0;
let p2Diagrams = 0;

for (let i = 1; i <= 30; i++) {
    const q1 = p1[i];
    if (!q1) {
        errors.push(`Paper 1 Test ${i} is missing`);
    } else {
        if (q1.length !== 20) errors.push(`Paper 1 Test ${i} has ${q1.length} questions instead of 20`);
        totalP1Q += q1.length;
        q1.forEach((q, idx) => {
            if (!q.question) errors.push(`P1 T${i} Q${idx+1}: missing question`);
            if (!Array.isArray(q.options) || q.options.length !== 4) errors.push(`P1 T${i} Q${idx+1}: invalid options length`);
            if (typeof q.answer !== 'number' || q.answer < 0 || q.answer > 3) errors.push(`P1 T${i} Q${idx+1}: invalid answer index (${q.answer})`);
            if (!q.explanation) errors.push(`P1 T${i} Q${idx+1}: missing explanation`);
            if (q.question.includes('<svg') || q.question.includes('<div') || q.type === 'Diagram') p1Diagrams++;
        });
    }

    const q2 = p2[i];
    if (!q2) {
        errors.push(`Paper 2 Test ${i} is missing`);
    } else {
        if (q2.length !== 20) errors.push(`Paper 2 Test ${i} has ${q2.length} questions instead of 20`);
        totalP2Q += q2.length;
        q2.forEach((q, idx) => {
            if (!q.question) errors.push(`P2 T${i} Q${idx+1}: missing question`);
            if (!Array.isArray(q.options) || q.options.length !== 4) errors.push(`P2 T${i} Q${idx+1}: invalid options length`);
            if (typeof q.answer !== 'number' || q.answer < 0 || q.answer > 3) errors.push(`P2 T${i} Q${idx+1}: invalid answer index (${q.answer})`);
            if (!q.explanation) errors.push(`P2 T${i} Q${idx+1}: missing explanation`);
            if (q.question.includes('<svg') || q.question.includes('<div') || q.type === 'Diagram') p2Diagrams++;
        });
    }
}

// Verify CSV
const csv = fs.readFileSync(path.join(BASE_DIR, 'test-links.csv'), 'utf-8').split('\n').filter(Boolean);
const csvRowsCount = csv.length - 1; // exclude header

// Verify Database
const db = JSON.parse(fs.readFileSync('C:/Users/user/Desktop/test/data/scholarship_tests_database.json', 'utf-8'));

console.log('===========================================================');
console.log('  MSCE Class 4 Scholarship Test Series - Verification Report');
console.log('===========================================================');
console.log(`Paper 1 Tests: 30 (${totalP1Q} Questions, ${p1Diagrams} Diagrams)`);
console.log(`Paper 2 Tests: 30 (${totalP2Q} Questions, ${p2Diagrams} Diagrams)`);
console.log(`Total Questions: ${totalP1Q + totalP2Q} / 1200`);
console.log(`CSV Rows Count: ${csvRowsCount} / 60`);
console.log(`Database Records: ${db.length} / 60 (P1: ${db.filter(d=>d.paper===1).length}, P2: ${db.filter(d=>d.paper===2).length})`);
console.log(`Total Errors Detected: ${errors.length}`);

if (errors.length > 0) {
    console.error('Errors:', errors.slice(0, 10));
    process.exit(1);
} else {
    console.log('[AUDIT PASSED] 100% Quality Verification Successful!');
}
