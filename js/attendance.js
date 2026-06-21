// hm: 時間数(小数)を "Xh Ym" 形式に変換
function hm(h) {
  if (h === null || h === undefined || h === '' || isNaN(h)) return '—';
  const total = Math.round(Number(h) * 60);
  if (total === 0) return '0h';
  const hh = Math.floor(total / 60);
  const mm = total % 60;
  return mm ? `${hh}h${mm}m` : `${hh}h`;
}
// ── 打刻タイムライン表示 ──────────────────────────────────
function renderPunchTimeline(rec) {
  if (!rec || (!rec.punchIn && !rec.actual)) return '<span style="color:#ccc">—</span>';
  const lines = [];
  if (rec.punchIn)  lines.push(`<span style="color:#1a3a5c">▶ ${rec.punchIn}</span>`);
  // 休憩ブロック
  if (rec.breaks && rec.breaks.length) {
    const labels = ['ランチ前','ランチ後','ディナー後'];
    rec.breaks.forEach((b,i) => {
      if (b && (b.start || b.end)) {
        const lbl = labels[i] || `休憩${i+1}`;
        if (b.start) lines.push(`<span style="color:#888">⏸ ${lbl}入り ${b.start}</span>`);
        if (b.end)   lines.push(`<span style="color:#888">▷ ${lbl}終了 ${b.end}</span>`);
      }
    });
  }
  if (rec.punchOut) lines.push(`<span style="color:#c0392b">⏹ ${rec.punchOut}</span>`);
  if (!lines.length && rec.actual) return `<span style="color:#666">${hm(rec.actual)}</span>`;
  return lines.join('<br>');
}

// ── 打刻編集ダイアログ ────────────────────────────────────
function openPunchEditor(empId, dateStr, dy, dm) {
  const ym  = `${dy}-${String(dm).padStart(2,'0')}`;
  const rec = ((attendance[ym]||{})[empId]||{})[dateStr] || {};
  const br  = rec.breaks || [{},{},{}];
  while (br.length < 3) br.push({});

  const labels = ['ランチ前','ランチ後','ディナー後'];
  const existing = document.getElementById('punchEditorModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'punchEditorModal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.45);z-index:9999;display:flex;align-items:center;justify-content:center';

  const brRows = labels.map((lbl,i) => `
    <div style="margin-bottom:8px">
      <div style="font-size:11px;color:#666;margin-bottom:3px">${lbl}休憩</div>
      <div style="display:flex;gap:8px;align-items:center">
        <label style="font-size:12px;width:32px">入り</label>
        <input type="time" id="pe_brStart_${i}" value="${br[i]?.start||''}" style="${timeStyle}">
        <label style="font-size:12px;width:32px">終了</label>
        <input type="time" id="pe_brEnd_${i}" value="${br[i]?.end||''}" style="${timeStyle}">
      </div>
    </div>`).join('');

  modal.innerHTML = `
    <div style="background:#fff;border-radius:12px;padding:24px;min-width:320px;max-width:420px;box-shadow:0 8px 32px rgba(0,0,0,0.2);max-height:90vh;overflow-y:auto">
      <div style="font-weight:700;font-size:15px;margin-bottom:16px;color:#1a3a5c">打刻・勤怠編集 — ${dateStr}</div>
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:12px">
        <label style="font-size:12px;width:40px">出勤</label>
        <input type="time" id="pe_in" value="${rec.punchIn||''}" style="${timeStyle}">
      </div>
      ${brRows}
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:16px">
        <label style="font-size:12px;width:40px">退勤</label>
        <input type="time" id="pe_out" value="${rec.punchOut||''}" style="${timeStyle}">
      </div>
      <div style="background:#f8faff;border-radius:8px;padding:12px;margin-bottom:16px;font-size:12px;color:#555">
        ※ 実働・残業・深夜時間は保存後に自動計算されます
      </div>
      <div style="display:flex;gap:8px">
        <button onclick="savePunchEditor(${empId},'${dateStr}',${dy},${dm})"
          style="flex:1;background:#1a3a5c;color:#fff;border:none;border-radius:8px;padding:10px;font-size:14px;cursor:pointer;font-weight:700">保存</button>
        <button onclick="document.getElementById('punchEditorModal').remove()"
          style="background:#eee;color:#666;border:none;border-radius:8px;padding:10px 14px;font-size:14px;cursor:pointer">✕</button>
      </div>
    </div>`;

  document.body.appendChild(modal);
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}

const timeStyle = 'border:1px solid #ddd;border-radius:6px;padding:5px 8px;font-size:13px;flex:1';

function savePunchEditor(empId, dateStr, dy, dm) {
  const punchIn  = document.getElementById('pe_in')?.value  || '';
  const punchOut = document.getElementById('pe_out')?.value || '';
  const breaks   = [0,1,2].map(i => {
    const start = document.getElementById(`pe_brStart_${i}`)?.value || '';
    const end   = document.getElementById(`pe_brEnd_${i}`)?.value   || '';
    if (!start && !end) return null;
    const minutes = (start && end) ? calcBreakMinutes(start, end) : 0;
    return { start, end, minutes };
  }).filter(Boolean);

  // 実働・深夜を自動計算
  let actual = 0, midnight = 0;
  if (punchIn && punchOut) {
    const totalMins  = calcBreakMinutes(punchIn, punchOut);
    const breakMins  = breaks.reduce((s,b) => s + (b.minutes||0), 0);
    actual   = Math.round((totalMins - breakMins) / 60 * 10) / 10;
    midnight = calcMidnight(punchOut, actual);
  }

  const ym  = `${dy}-${String(dm).padStart(2,'0')}`;
  const existing = ((attendance[ym]||{})[empId]||{})[dateStr] || {};
  const updated  = {
    ...existing,
    punchIn, punchOut, breaks,
    actual:   actual   || existing.actual   || 0,
    midnight: midnight || existing.midnight || 0,
    source:   'manual',
  };

  db.ref(`payroll/attendance/${ym}/${empId}/${dateStr}`).update(updated);
  document.getElementById('punchEditorModal').remove();
}

function calcBreakMinutes(start, end) {
  const [sh,sm] = start.split(':').map(Number);
  let   [eh,em] = end.split(':').map(Number);
  if (eh < sh) eh += 24; // 日またぎ
  return (eh*60+em) - (sh*60+sm);
}

function calcMidnight(punchOut, actual) {
  if (!punchOut) return 0;
  const [h,m] = punchOut.split(':').map(Number);
  const outH  = h + m/60;
  if (outH >= 22) return Math.round((outH - 22) * 10) / 10;
  if (outH < 5)   return Math.round((outH + 2) * 10) / 10;
  return 0;
}

// ============================================================
// attendance.js  ―  勤怠入力（日次打刻・CSV取込）
// ============================================================

function renderAttendance(year, month) {
  const { startDate, endDate } = getPayPeriod(year, month);
  const empOptions = activeEmployees().map(e=>`<option value="${e.id}">${e.name}</option>`).join('');

  return `
  <div class="section-header">
    <div class="section-title">🕐 勤怠入力 ― ${year}年${month}月</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn-accent" onclick="showCSVImport()">📋 CSV一括取込</button>
      <button class="btn-outline" onclick="exportAttendanceCSV(${year},${month})">CSV出力</button>
    </div>
  </div>

  <div class="alert alert-info">
    <span>📅</span>
    <div><strong>賃金計算期間：${startDate.replace(/-/g,'/')} 〜 ${endDate.replace(/-/g,'/')}</strong>（20日締め・当月末払い）<br>
    この期間外の日付を入力した場合でも保存されますが、給与計算には反映されません。<br>
    <strong>週マタギ計算</strong>：期間をまたぐ週も自動で週40h超えを計算します。</div>
  </div>

  <div class="card" id="csvImportCard" style="display:none;border:2px solid #e8a020;">
    <div class="card-title" style="color:#b07d00;">📂 エクセルCSV一括取込</div>
    <div class="alert alert-info"><span>📌</span>
    <div>
      <strong>必須列：</strong>スタッフ名, 日付(YYYY/MM/DD), 出勤, 退勤, 休憩入1, 休憩終1, 休憩入2, 休憩終2, 休憩入3, 休憩終3<br>
      <span style="font-size:12px;color:#666;">※ 社員はランチ前・ランチ後・ディナー休憩の3回まで対応。パートは休憩列を空白でOK。</span>
    </div></div>
    <div style="margin-bottom:10px;">
      <button class="btn-outline" onclick="downloadAttCsvTemplate()" style="font-size:12px;">📄 CSVテンプレートをダウンロード</button>
    </div>
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;flex-wrap:wrap;">
      <label style="font-size:13px;font-weight:600;">CSVファイル：</label>
      <input type="file" id="attCsvFileInput" accept=".csv" onchange="previewAttCsv(this,${year},${month})">
    </div>
    <div id="attCsvPreview" style="display:none;margin-bottom:10px;">
      <div style="font-size:13px;font-weight:600;margin-bottom:6px;">📋 取込プレビュー</div>
      <div id="attCsvPreviewTable" style="overflow-x:auto;max-height:260px;overflow-y:auto;border:1px solid #dce3ec;border-radius:8px;"></div>
      <div id="attCsvParseError" style="color:#c00;font-size:12px;margin-top:6px;display:none;"></div>
    </div>
    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
      <button class="btn-primary" id="attCsvImportBtn" onclick="execAttCsvImport(${year},${month})" style="display:none;">📥 取込実行</button>
      <button class="btn-outline" onclick="hideCSVImport()">キャンセル</button>
      <span id="attCsvStatus" style="font-size:13px;color:#555;"></span>
    </div>
  </div>

  <div class="card">
    <div class="card-title">
      <span>従業員選択：</span>
      <select id="attEmpSel" onchange="renderAttendanceTable(${year},${month})" style="border:1px solid #dce3ec;border-radius:6px;padding:4px 8px;font-family:inherit;font-size:13px">
        ${empOptions}
      </select>
    </div>
    <div id="attTableWrap"></div>
  </div>`;
}

function showCSVImport() {
  document.getElementById('csvImportCard').style.display = 'block';
}
function hideCSVImport() {
  document.getElementById('csvImportCard').style.display = 'none';
}

function renderAttendanceTable(year, month) {
  const sel = document.getElementById('attEmpSel');
  if (!sel) return;
  const empId = parseInt(sel.value);
  const emp = employees.find(e=>e.id===empId);
  if (!emp) return;

  const { startDate, endDate } = getPayPeriod(year, month);
  const start = new Date(startDate);
  const end   = new Date(endDate);
  const DOW   = ['日','月','火','水','木','金','土'];

  // 全期間の打刻データを取得（前月・当月にまたがるため両方から）
  const extended = getExtendedDailyList(empId, year, month);
  const empMap   = {};
  for (const d of extended) empMap[d.date] = d;

  let html = `<div class="table-wrap"><table>
    <thead><tr>
      <th>日付</th><th>曜日</th>
      <th title="その日の実労働時間合計">実働(h)</th>
      <th title="うち日8時間を超えた残業時間（例：10h勤務なら2hと入力）">日8h超<br>残業(h)</th>
      <th title="22時〜5時の労働時間合計">深夜(h)<br>22時〜</th>
      <th title="22時以降かつ残業（8h超/週40h超）の時間">深夜×残業<br>(h)</th>
      <th title="法定休日（木曜）出勤 → 35%割増">法定休日<br>🔴木</th>
      <th title="法定外休日（水曜）出勤 → 週40h超のみ25%">法定外休日<br>🟠水</th>
      <th>有給</th><th>欠勤</th><th style="min-width:160px">打刻・勤怠時間</th>
    </tr>
    <tr style="background:#f8faff;font-size:11px;color:var(--text-muted)">
      <td colspan="2"></td>
      <td>合計</td><td style="color:#c0392b">+25〜50%</td>
      <td style="color:#2980b9">+25%</td><td style="color:#8e44ad">追加+25%</td>
      <td style="color:#c0392b">+35%</td><td>週OT時25%</td>
      <td colspan="3"></td>
    </tr></thead><tbody>`;

  // ★ 前月21日〜当月20日でループ
  for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate()+1)) {
    const dateStr = dt.toISOString().slice(0,10);
    const dow     = dt.getDay();
    const [,mm,dd] = dateStr.split('-');
    const rec     = empMap[dateStr] || {};
    const isLegal    = dow === PAY_CONFIG.legalHolidayDow;
    const isNonLegal = dow === PAY_CONFIG.nonLegalHolidayDow;
    const [dy, dm] = dateStr.split('-').map(Number);

    const rowBg    = isLegal ? 'background:#fff0f0' : isNonLegal ? 'background:#fff8f0' : '';
    const dowColor = isLegal ? '#c0392b' : isNonLegal ? '#d35400' : '';

    html += `<tr style="${rowBg}">
      <td>${parseInt(mm)}/${parseInt(dd)}</td>
      <td style="font-weight:${isLegal||isNonLegal?'700':'400'};color:${dowColor||'inherit'}">${DOW_NAMES[dow]}${isLegal?' 🔴':isNonLegal?' 🟠':''}</td>
      <td><input type="number" min="0" max="24" step="0.5" style="width:58px"
        value="${rec.actual||''}"
        onchange="setAttFull(${empId},'${dateStr}','actual',this.value,${dy},${dm})"></td>
      <td style="background:#fff5f5"><input type="number" min="0" max="16" step="0.5" style="width:58px"
        title="日8h超の残業時間のみ（例：10h勤務→2と入力）"
        value="${rec.dailyOT||''}"
        onchange="setAttFull(${empId},'${dateStr}','dailyOT',this.value,${dy},${dm})"></td>
      <td style="background:#f0f5ff"><input type="number" min="0" max="8" step="0.5" style="width:58px"
        title="22時〜5時の労働時間合計"
        value="${rec.midnight||''}"
        onchange="setAttFull(${empId},'${dateStr}','midnight',this.value,${dy},${dm})"></td>
      <td style="background:#f5f0ff"><input type="number" min="0" max="8" step="0.5" style="width:58px"
        title="22時以降 かつ 残業（8h超または週40h超）の時間"
        value="${rec.midnightOT||''}"
        onchange="setAttFull(${empId},'${dateStr}','midnightOT',this.value,${dy},${dm})"></td>
      <td style="background:${isLegal?'#ffe8e8':''}">
        <input type="checkbox" ${rec.holidayLegal?'checked':''}
        title="法定休日（木曜）出勤 → 35%割増"
        onchange="setAttFull(${empId},'${dateStr}','holidayLegal',this.checked?1:0,${dy},${dm})"></td>
      <td style="background:${isNonLegal?'#fff0e0':''}">
        <input type="checkbox" ${rec.holidayNonLegal||(rec.holiday&&!rec.holidayLegal)?'checked':''}
        title="法定外休日（水曜）出勤 → 週40h超のみ25%"
        onchange="setAttFull(${empId},'${dateStr}','holidayNonLegal',this.checked?1:0,${dy},${dm})"></td>
      <td><input type="checkbox" ${rec.paidLeave?'checked':''}
        onchange="setAttFull(${empId},'${dateStr}','paidLeave',this.checked?1:0,${dy},${dm})"></td>
      <td><input type="checkbox" ${rec.absent?'checked':''}
        onchange="setAttFull(${empId},'${dateStr}','absent',this.checked?1:0,${dy},${dm})"></td>
      <td style="font-size:11px;line-height:1.7;cursor:pointer;min-width:160px" onclick="openPunchEditor(${empId},'${dateStr}',${dy},${dm})" title="クリックして打刻・勤怠を編集">
        ${renderPunchTimeline(rec)}
      </td>
    </tr>`;
  }

  // 合計行
  const result = calcWeeklyOT(extended, year, month);

  html += `</tbody><tfoot>
    <tr class="total-row">
      <td colspan="2">期間計</td>
      <td>${hm(result.totalActual)}</td>
      <td><strong>${hm(result.monthOT)}</strong><br><span style="font-size:10px;font-weight:400">日超:${hm(result.monthDailyOT)} 週超:${hm(result.monthWeekOT)}</span></td>
      <td>${hm(result.monthMidnight)}</td>
      <td>${hm(result.monthMidnightOT)}</td>
      <td>${hm(result.monthHolidayLegal)}</td>
      <td>${hm(result.monthHolidayNonLegal)}</td>
      <td></td><td></td>
      <td style="font-size:11px">残業計：<strong>${hm(result.monthOT)}</strong>（日超${hm(result.monthDailyOT)}＋週超${hm(result.monthWeekOT)}）</td>
    </tr>
  </tfoot></table></div>`;

  document.getElementById('attTableWrap').innerHTML = html;
}

function setAtt(empId, dateStr, field, value, year, month) {
  setAttFull(empId, dateStr, field, value, year, month);
}

// ★ 実際の日付の年月に保存（締め日またぎ対応）＋Firebase直接書き込み
function setAttFull(empId, dateStr, field, value, actualYear, actualMonth) {
  const ym = getYM(actualYear, actualMonth);
  if (!attendance[ym]) attendance[ym] = {};
  if (!attendance[ym][empId]) attendance[ym][empId] = {};
  if (!attendance[ym][empId][dateStr]) attendance[ym][empId][dateStr] = {};

  const path = db.ref(`payroll/attendance/${ym}/${empId}/${dateStr}`);

  if (value === '' || value === false || value === 0 || value === '0') {
    delete attendance[ym][empId][dateStr][field];
    if (Object.keys(attendance[ym][empId][dateStr]).length === 0) {
      delete attendance[ym][empId][dateStr];
      path.remove();
    } else {
      path.update({ [field]: null });
    }
  } else {
    const numVal = parseFloat(value);
    const v = isNaN(numVal) ? value : numVal;
    attendance[ym][empId][dateStr][field] = v;
    path.update({ [field]: v });
  }
}

// CSV取込
// -------- 勤怠入力ページ CSV取込 --------
let attCsvParsedRows = [];

function downloadAttCsvTemplate() {
  const header = 'スタッフ名,日付,出勤,退勤,休憩入1,休憩終1,休憩入2,休憩終2,休憩入3,休憩終3';
  const samples = [
    '青木,2026/05/21,07:43,21:44,10:10,10:21,15:29,16:50,,',
    '原,2026/05/21,07:42,21:58,10:12,10:21,,,,',
    '小沼,2026/05/21,08:00,17:00,12:00,13:00,,,,',
    '武田,2026/05/21,11:00,21:00,15:00,16:00,,,,'
  ];
  const csv = [header, ...samples].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = '勤怠CSV_テンプレート.csv';
  a.click();
}

function timeToH(str) {
  if (!str) return null;
  const [h, m] = str.split(':').map(Number);
  if (isNaN(h) || isNaN(m)) return null;
  return h + m / 60;
}

function previewAttCsv(input, year, month) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    let text = e.target.result.replace(/^\uFEFF/, '');
    parseAttCsv(text, year, month);
  };
  reader.readAsText(file, 'UTF-8');
}

function parseAttCsv(text, year, month) {
  const errEl  = document.getElementById('attCsvParseError');
  const prevEl = document.getElementById('attCsvPreview');
  const btnEl  = document.getElementById('attCsvImportBtn');
  const stEl   = document.getElementById('attCsvStatus');
  errEl.style.display = 'none';
  btnEl.style.display = 'none';
  stEl.textContent = '';
  attCsvParsedRows = [];

  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) {
    errEl.textContent = 'CSVにデータがありません。';
    errEl.style.display = 'block';
    prevEl.style.display = 'block';
    return;
  }

  // ヘッダ行スキップ
  let startIdx = 0;
  const firstCell = lines[0].split(',')[0].trim();
  if (firstCell === 'スタッフ名' || firstCell === '氏名' || firstCell === 'name') startIdx = 1;

  const errors = [];
  const rows = [];
  const timeRe = /^\d{1,2}:\d{2}$/;

  for (let i = startIdx; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim().replace(/"/g, ''));
    const [nameRaw, dateRaw, punchIn, punchOut, b1in, b1out, b2in, b2out, b3in, b3out] = cols;

    if (!nameRaw || !dateRaw || !punchIn || !punchOut) {
      errors.push(`行${i+1}: スタッフ名・日付・出退勤が必要です`);
      continue;
    }

    // 氏名マッチ（全角スペース・半角スペース・スペースなし全対応）
    const normName = s => s.replace(/　/g,' ').replace(/\s+/g,'').trim();
    const emp = employees.find(e => normName(e.name) === normName(nameRaw));
    if (!emp) {
      errors.push(`行${i+1}: 「${nameRaw}」は給与システムに存在しません`);
      continue;
    }

    // 日付正規化（月日のゼロ埋め対応: 2026/5/22 → 2026-05-22）
    const dateParts = dateRaw.replace(/\//g, '-').split('-');
    if (dateParts.length !== 3) {
      errors.push(`行${i+1}: 日付はYYYY/MM/DD形式で入力してください (${dateRaw})`);
      continue;
    }
    const dateStr = `${dateParts[0]}-${String(Number(dateParts[1])).padStart(2,'0')}-${String(Number(dateParts[2])).padStart(2,'0')}`;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      errors.push(`行${i+1}: 日付はYYYY/MM/DD形式で入力してください (${dateRaw})`);
      continue;
    }

    // 時刻バリデーション
    if (!timeRe.test(punchIn) || !timeRe.test(punchOut)) {
      errors.push(`行${i+1}: 出退勤はHH:MM形式で入力してください`);
      continue;
    }

    // 休憩計算
    let breakMins = 0;
    const breaks = [];
    for (const [bi, bo] of [[b1in,b1out],[b2in,b2out],[b3in,b3out]]) {
      if (bi && bo && timeRe.test(bi) && timeRe.test(bo)) {
        const mins = Math.round((timeToH(bo) - timeToH(bi)) * 60);
        if (mins > 0) { breakMins += mins; breaks.push({ start:bi, end:bo, minutes:mins }); }
      }
    }

    // 実労働時間（分単位精度）
    let work = timeToH(punchOut) - timeToH(punchIn);
    if (work < 0) work += 24;
    const workMins  = Math.round(work * 60);
    const netMins   = Math.max(0, workMins - breakMins);
    const netHdec   = Math.round(netMins / 60 * 100) / 100; // 小数h（給与計算用）
    const netH      = netHdec; // プレビュー表示用
    const otMins    = Math.max(0, netMins - 480);
    const dailyOT   = Math.round(otMins / 60 * 100) / 100;

    // 深夜時間（分単位）
    const outH = timeToH(punchOut);
    let midnightMins = 0;
    if (outH >= 22)    midnightMins = Math.round((outH - 22) * 60);
    else if (outH < 5) midnightMins = Math.round((outH + 2) * 60);
    const midnight = Math.round(midnightMins / 60 * 100) / 100;

    rows.push({ emp, dateStr, punchIn, punchOut, breakMins, breaks, netH, netHdec, dailyOT, midnight });
  }

  attCsvParsedRows = rows;

  if (errors.length) {
    errEl.innerHTML = '<strong>⚠ エラー（スキップ）：</strong><br>' + errors.join('<br>');
    errEl.style.display = 'block';
  }

  if (!rows.length) {
    document.getElementById('attCsvPreviewTable').innerHTML =
      '<div style="padding:12px;color:#c00;">取込できる行がありません。</div>';
    prevEl.style.display = 'block';
    return;
  }

  let tbl = '<table style="width:100%;border-collapse:collapse;font-size:12px;">';
  tbl += '<thead><tr style="background:#f5f5f5;position:sticky;top:0;">';
  for (const h of ['スタッフ','日付','出勤','退勤','休憩(分)','実労働h','残業h','深夜h']) {
    tbl += `<th style="padding:5px 8px;border:1px solid #ddd;white-space:nowrap;">${h}</th>`;
  }
  tbl += '</tr></thead><tbody>';
  for (const r of rows) {
    tbl += `<tr>
      <td style="padding:4px 8px;border:1px solid #eee;">${r.emp.name}</td>
      <td style="padding:4px 8px;border:1px solid #eee;">${r.dateStr.replace(/-/g,'/')}</td>
      <td style="padding:4px 8px;border:1px solid #eee;">${r.punchIn}</td>
      <td style="padding:4px 8px;border:1px solid #eee;">${r.punchOut}</td>
      <td style="padding:4px 8px;border:1px solid #eee;text-align:right;">${r.breakMins}</td>
      <td style="padding:4px 8px;border:1px solid #eee;text-align:right;font-weight:700;color:#1a5fa0;">${r.netH}</td>
      <td style="padding:4px 8px;border:1px solid #eee;text-align:right;color:${r.dailyOT>0?'#c0001a':'#666'};">${r.dailyOT}</td>
      <td style="padding:4px 8px;border:1px solid #eee;text-align:right;color:${r.midnight>0?'#6b2fa0':'#666'};">${r.midnight}</td>
    </tr>`;
  }
  tbl += '</tbody></table>';
  document.getElementById('attCsvPreviewTable').innerHTML = tbl;
  prevEl.style.display = 'block';
  btnEl.style.display = 'inline-block';
  stEl.textContent = `${rows.length}件を取込できます`;
}

function execAttCsvImport(year, month) {
  if (!attCsvParsedRows.length) return;
  if (!confirm(`${attCsvParsedRows.length}件を取込みます。よろしいですか？`)) return;

  const updates = {};
  for (const r of attCsvParsedRows) {
    const [dy, dm] = r.dateStr.split('-').map(Number);
    const payM = dm + (dy >= 21 ? 1 : 0);
    const payY = payM > 12 ? dy + 1 : dy;
    const ym = `${payY}-${String(payM > 12 ? payM - 12 : payM).padStart(2,'0')}`;
    updates[`${ym}/${r.emp.id}/${r.dateStr}`] = {
      actual:     r.netHdec,  // 計算用小数（給与計算に使用）
      dailyOT:    r.dailyOT,
      midnight:   r.midnight,
      midnightOT: Math.min(r.midnight, r.dailyOT),
      punchIn:    r.punchIn,
      punchOut:   r.punchOut,
      breakMins:  r.breakMins,
      breakCount: r.breaks.length,
      breaks:     r.breaks,
      source:     'csv',
    };
  }

  db.ref('payroll/attendance').update(updates)
    .then(() => {
      // Firebaseのon('value')リスナーが自動でattendanceを更新・再描画する
      hideCSVImport();
      document.getElementById('attCsvFileInput').value = '';
      attCsvParsedRows = [];
      renderAttendanceTable(year, month);
      showToast(`✅ ${Object.keys(updates).length}件を取込みました`);
    })
    .catch(e => showToast('取込エラー：' + e.message, 'error'));
}

function importCSV(year, month) {
  // 旧貼り付け方式（後方互換）
  showToast('ファイル選択からCSVを取込んでください');
}

function exportAttendanceCSV(year, month) {
  const ym = getYM(year, month);
  const header = ['氏名','日付','実働時間(h)','深夜時間(h)','休日(0/1)','有給','欠勤','遅刻(h)','備考'];
  const rows = [];
  for (const emp of activeEmployees()) {
    const empData = (attendance[ym] && attendance[ym][emp.id]) || {};
    for (const [date, rec] of Object.entries(empData)) {
      rows.push([emp.name, date.replace(/-/g,'/'), rec.actual||0, rec.midnight||0, rec.holiday||0, rec.paidLeave||0, rec.absent||0, rec.late||0, rec.note||'']);
    }
  }
  rows.sort((a,b)=>a[0].localeCompare(b[0]) || a[1].localeCompare(b[1]));
  const csv = [header,...rows].map(r=>r.join(',')).join('\n');
  dlFile(`勤怠_${year}年${month}月.csv`, csv, 'text/csv');
}

// セレクト変更後にテーブル描画
document.addEventListener('change', e => {
  if (e.target.id === 'attEmpSel') {
    const y = parseInt(document.getElementById('targetYear').value);
    const m = parseInt(document.getElementById('targetMonth').value);
    renderAttendanceTable(y, m);
  }
});

// ページ表示後に初期テーブル描画
const _origAttach = attachPageEvents;
function attachPageEvents(page) {
  if (page === 'attendance') {
    setTimeout(()=>{
      const y = parseInt(document.getElementById('targetYear').value);
      const m = parseInt(document.getElementById('targetMonth').value);
      renderAttendanceTable(y, m);
    }, 0);
  }
}
