// Generator for MSCE Class 4 Scholarship Test Series (Paper 1 & Paper 2)
// Generates 60 Tests (30 for Paper 1, 30 for Paper 2), 20 Questions each = 1,200 Questions Total
// Includes rich SVG diagrams for geometry, mirror images, water images, patterns, fractions, clocks.

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(BASE_DIR, 'data');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ==========================================
// SVG DIAGRAM GENERATOR HELPERS
// ==========================================
function getClockSvg(hours, minutes, timeText = '') {
    const hDeg = (hours % 12) * 30 + minutes * 0.5;
    const mDeg = minutes * 6;
    return `<div class="flex flex-col items-center justify-center my-3 p-3 bg-blue-50/50 rounded-xl border border-blue-200">
        <svg width="140" height="140" viewBox="0 0 140 140" class="drop-shadow-sm">
            <circle cx="70" cy="70" r="62" fill="#ffffff" stroke="#1e3a8a" stroke-width="4"/>
            <circle cx="70" cy="70" r="5" fill="#1e3a8a"/>
            <!-- Clock Numbers -->
            <text x="70" y="24" text-anchor="middle" font-size="12" font-weight="bold" fill="#1e3a8a">12</text>
            <text x="118" y="74" text-anchor="middle" font-size="12" font-weight="bold" fill="#1e3a8a">3</text>
            <text x="70" y="122" text-anchor="middle" font-size="12" font-weight="bold" fill="#1e3a8a">6</text>
            <text x="22" y="74" text-anchor="middle" font-size="12" font-weight="bold" fill="#1e3a8a">9</text>
            <!-- Hour Hand -->
            <line x1="70" y1="70" x2="70" y2="40" stroke="#b91c1c" stroke-width="4" stroke-linecap="round" transform="rotate(${hDeg} 70 70)"/>
            <!-- Minute Hand -->
            <line x1="70" y1="70" x2="70" y2="22" stroke="#1e3a8a" stroke-width="3" stroke-linecap="round" transform="rotate(${mDeg} 70 70)"/>
        </svg>
        ${timeText ? `<span class="mt-1 text-xs font-bold text-blue-900">${timeText}</span>` : ''}
    </div>`;
}

function getAngleSvg(type, angleLabel = '') {
    let arc = '';
    let ray2 = '';
    if (type === 'right') { // 90 deg
        ray2 = '<line x1="25" y1="95" x2="25" y2="25" stroke="#1e3a8a" stroke-width="3"/>';
        arc = '<rect x="25" y="75" width="20" height="20" fill="none" stroke="#dc2626" stroke-width="2"/>';
    } else if (type === 'acute') { // 45 deg
        ray2 = '<line x1="25" y1="95" x2="95" y2="40" stroke="#1e3a8a" stroke-width="3"/>';
        arc = '<path d="M 50 95 A 25 25 0 0 0 45 78" fill="none" stroke="#dc2626" stroke-width="2"/>';
    } else { // obtuse 135 deg
        ray2 = '<line x1="75" y1="95" x2="20" y2="45" stroke="#1e3a8a" stroke-width="3"/>';
        arc = '<path d="M 50 95 A 25 25 0 0 1 55 75" fill="none" stroke="#dc2626" stroke-width="2"/>';
    }
    return `<div class="flex flex-col items-center justify-center my-3 p-3 bg-amber-50/50 rounded-xl border border-amber-200">
        <svg width="150" height="120" viewBox="0 0 150 120">
            <!-- Baseline -->
            <line x1="25" y1="95" x2="135" y2="95" stroke="#1e3a8a" stroke-width="3"/>
            ${ray2}
            ${arc}
            <circle cx="25" cy="95" r="4" fill="#1e3a8a"/>
            <text x="135" y="112" font-size="11" font-weight="bold" fill="#1e3a8a">B</text>
            <text x="15" y="112" font-size="11" font-weight="bold" fill="#1e3a8a">A</text>
            <text x="30" y="20" font-size="11" font-weight="bold" fill="#1e3a8a">C</text>
        </svg>
        ${angleLabel ? `<span class="mt-1 text-xs font-bold text-amber-900">${angleLabel}</span>` : ''}
    </div>`;
}

function getCircleGeometrySvg(radiusVal = 7, showDiameter = false) {
    return `<div class="flex flex-col items-center justify-center my-3 p-3 bg-indigo-50/50 rounded-xl border border-indigo-200">
        <svg width="150" height="150" viewBox="0 0 150 150">
            <circle cx="75" cy="75" r="60" fill="#f8fafc" stroke="#3b82f6" stroke-width="3"/>
            <circle cx="75" cy="75" r="4" fill="#ef4444"/>
            <text x="75" y="92" font-size="11" font-weight="bold" fill="#ef4444" text-anchor="middle">O (केंद्र)</text>
            <!-- Radius / Diameter -->
            <line x1="75" y1="75" x2="135" y2="75" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="3,3"/>
            <text x="105" y="68" font-size="11" font-weight="bold" fill="#1e3a8a">${radiusVal} सेमी</text>
            ${showDiameter ? `<line x1="15" y1="75" x2="75" y2="75" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="3,3"/>` : ''}
        </svg>
        <span class="mt-1 text-xs font-bold text-indigo-900">वर्तुळ केंद्र O आणि त्रिज्या = ${radiusVal} सेमी</span>
    </div>`;
}

function getPerimeterRectSvg(l, w) {
    return `<div class="flex flex-col items-center justify-center my-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-200">
        <svg width="180" height="110" viewBox="0 0 180 110">
            <rect x="20" y="20" width="140" height="70" fill="#ecfdf5" stroke="#059669" stroke-width="3" rx="4"/>
            <text x="90" y="15" text-anchor="middle" font-size="12" font-weight="bold" fill="#065f46">लांबी = ${l} सेमी</text>
            <text x="90" y="105" text-anchor="middle" font-size="12" font-weight="bold" fill="#065f46">लांबी = ${l} सेमी</text>
            <text x="165" y="60" text-anchor="start" font-size="12" font-weight="bold" fill="#065f46">${w} सेमी</text>
            <text x="5" y="60" text-anchor="end" font-size="12" font-weight="bold" fill="#065f46">${w} सेमी</text>
        </svg>
        <span class="mt-1 text-xs font-bold text-emerald-900">आयताची परिमिती = २ × (लांबी + रुंदी)</span>
    </div>`;
}

function getFractionSvg(parts, shaded) {
    // Divided bar
    const w = 180;
    const h = 40;
    const partW = w / parts;
    let rects = '';
    for (let i = 0; i < parts; i++) {
        const isShaded = i < shaded;
        rects += `<rect x="${i * partW}" y="0" width="${partW}" height="${h}" fill="${isShaded ? '#3b82f6' : '#ffffff'}" stroke="#1e3a8a" stroke-width="2"/>`;
    }
    return `<div class="flex flex-col items-center justify-center my-3 p-3 bg-sky-50/50 rounded-xl border border-sky-200">
        <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
            ${rects}
        </svg>
        <span class="mt-2 text-xs font-bold text-sky-900">एकूण समान भाग = ${parts}, रंगवलेले भाग = ${shaded}</span>
    </div>`;
}

function getMirrorSvg(leftContent, rightContent = '?') {
    return `<div class="flex flex-col items-center justify-center my-3 p-3 bg-purple-50/50 rounded-xl border border-purple-200">
        <div class="flex items-center gap-6">
            <div class="w-16 h-16 flex items-center justify-center border-2 border-purple-600 bg-white rounded-lg text-2xl font-black text-purple-900 shadow-sm">
                ${leftContent}
            </div>
            <div class="flex flex-col items-center">
                <div class="h-16 w-1 border-r-2 border-dashed border-red-500"></div>
                <span class="text-[10px] font-black text-red-600 uppercase mt-1">आरसा (Mirror)</span>
            </div>
            <div class="w-16 h-16 flex items-center justify-center border-2 border-dashed border-gray-400 bg-gray-50 rounded-lg text-2xl font-black text-gray-500">
                ${rightContent}
            </div>
        </div>
        <span class="mt-2 text-xs font-bold text-purple-900">आरशातील अचूक प्रतिमा ओळखा</span>
    </div>`;
}

function getWaterSvg(topContent, bottomContent = '?') {
    return `<div class="flex flex-col items-center justify-center my-3 p-3 bg-cyan-50/50 rounded-xl border border-cyan-200">
        <div class="flex flex-col items-center gap-2">
            <div class="w-16 h-16 flex items-center justify-center border-2 border-cyan-600 bg-white rounded-lg text-2xl font-black text-cyan-900 shadow-sm">
                ${topContent}
            </div>
            <div class="w-32 h-1 border-b-2 border-dashed border-blue-500 my-1"></div>
            <span class="text-[10px] font-black text-blue-600 uppercase">पाण्याची पातळी (Water Surface)</span>
            <div class="w-16 h-16 flex items-center justify-center border-2 border-dashed border-gray-400 bg-gray-50 rounded-lg text-2xl font-black text-gray-500">
                ${bottomContent}
            </div>
        </div>
        <span class="mt-2 text-xs font-bold text-cyan-900">पाण्यातील अचूक प्रतिबिंब ओळखा</span>
    </div>`;
}

function getFigureSeriesSvg(fig1, fig2, fig3, fig4 = '?') {
    return `<div class="flex flex-col items-center justify-center my-3 p-3 bg-amber-50/50 rounded-xl border border-amber-200">
        <div class="flex items-center gap-2 md:gap-3">
            <div class="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center border-2 border-amber-500 bg-white rounded-lg text-xl font-bold text-amber-900 shadow-sm">${fig1}</div>
            <i class="fas fa-arrow-right text-gray-400 text-xs"></i>
            <div class="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center border-2 border-amber-500 bg-white rounded-lg text-xl font-bold text-amber-900 shadow-sm">${fig2}</div>
            <i class="fas fa-arrow-right text-gray-400 text-xs"></i>
            <div class="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center border-2 border-amber-500 bg-white rounded-lg text-xl font-bold text-amber-900 shadow-sm">${fig3}</div>
            <i class="fas fa-arrow-right text-gray-400 text-xs"></i>
            <div class="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center border-2 border-dashed border-red-500 bg-red-50 rounded-lg text-xl font-black text-red-600 shadow-sm">${fig4}</div>
        </div>
        <span class="mt-2 text-xs font-bold text-amber-900">आकृती मालिकेतील पुढील पद (?) ओळखा</span>
    </div>`;
}

function getCountTriangleSvg() {
    return `<div class="flex flex-col items-center justify-center my-3 p-3 bg-rose-50/50 rounded-xl border border-rose-200">
        <svg width="150" height="120" viewBox="0 0 150 120">
            <!-- Big Triangle -->
            <polygon points="75,15 15,105 135,105" fill="#fff1f2" stroke="#e11d48" stroke-width="3"/>
            <!-- Median line -->
            <line x1="75" y1="15" x2="75" y2="105" stroke="#e11d48" stroke-width="2.5"/>
            <!-- Labels -->
            <text x="45" y="90" font-size="12" font-weight="bold" fill="#9f1239">१</text>
            <text x="95" y="90" font-size="12" font-weight="bold" fill="#9f1239">२</text>
        </svg>
        <span class="mt-1 text-xs font-bold text-rose-900">आकृतीत एकूण किती त्रिकोण तयार होतात?</span>
    </div>`;
}

console.log('SVG generator helpers initialized.');

module.exports = {
    getClockSvg,
    getAngleSvg,
    getCircleGeometrySvg,
    getPerimeterRectSvg,
    getFractionSvg,
    getMirrorSvg,
    getWaterSvg,
    getFigureSeriesSvg,
    getCountTriangleSvg
};
