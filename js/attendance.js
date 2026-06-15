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

  <div class="card" id="csvImportCard" style="display:none">
    <div class="card-title">📋 CSV一括取込</div>
    <div class="alert alert-info"><span>📌</span>
    <div>形式：<code>氏名,日付(YYYY/MM/DD),実働時間(h),深夜時間(h),休日(0/1)</code><br>
    1行目にヘッダがある場合は自動スキップします。</div></div>
    <textarea id="csvPasteArea" style="width:100%;height:120px;font-family:monospace;font-size:12px;border:1px solid #dce3ec;border-radius:8px;padding:10px" placeholder="ここにCSVデータを貼り付け..."></textarea>
    <div style="display:flex;gap:8px;margin-top:10px">
      <button class="btn-primary" onclick="importCSV(${year},${month})">取込実行</button>
      <button class="btn-outline" onclick="hideCSVImport()">キャンセル</button>
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
      <th>有給</th><th>欠勤</th><th>備考</th>
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
      <td><input type="text" style="width:90px;text-align:left"
        value="${rec.note||''}"
        onchange="setAttFull(${empId},'${dateStr}','note',this.value,${dy},${dm})"></td>
    </tr>`;
  }

  // 合計行
  const result = calcWeeklyOT(extended, year, month);

  html += `</tbody><tfoot>
    <tr class="total-row">
      <td colspan="2">期間計</td>
      <td>${result.totalActual}h</td>
      <td><strong>${result.monthDailyOT}h</strong></td>
      <td>${result.monthMidnight}h</td>
      <td>${result.monthMidnightOT}h</td>
      <td>${result.monthHolidayLegal}h</td>
      <td>${result.monthHolidayNonLegal}h</td>
      <td colspan="3">週40h超残業：${result.monthWeekOT}h　残業計：<strong>${result.monthOT}h</strong></td>
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
function importCSV(year, month) {
  const raw = document.getElementById('csvPasteArea').value.trim();
  if (!raw) { showToast('CSVを貼り付けてください','error'); return; }

  const lines = raw.split('\n').map(l=>l.trim()).filter(Boolean);
  let imported = 0, skipped = 0;

  const ym = getYM(year, month);
  if (!attendance[ym]) attendance[ym] = {};

  for (const line of lines) {
    const cols = line.split(',').map(c=>c.trim().replace(/"/g,''));
    if (cols[0]==='氏名'||cols[0]==='name') continue; // ヘッダスキップ
    if (cols.length < 3) { skipped++; continue; }

    const [nameRaw, dateRaw, actualRaw, midnightRaw, holidayRaw] = cols;

    // 氏名マッチ（前後スペース除去・部分一致）
    const emp = employees.find(e=>e.name.replace(/\s/g,'')===nameRaw.replace(/\s/g,'') || e.name===nameRaw);
    if (!emp) { skipped++; console.warn('不明な従業員:', nameRaw); continue; }

    // 日付パース
    const dateStr = dateRaw.replace(/\//g,'-');
    const [y,mo,d] = dateStr.split('-').map(Number);
    if (!y||!mo||!d) { skipped++; continue; }

    if (!attendance[ym][emp.id]) attendance[ym][emp.id] = {};
    attendance[ym][emp.id][dateStr] = {
      actual:   parseFloat(actualRaw)||0,
      midnight: parseFloat(midnightRaw)||0,
      holiday:  parseInt(holidayRaw)||0,
    };
    imported++;
  }

  saveLS('attendance', attendance);
  hideCSVImport();
  renderAttendanceTable(year, month);
  showToast(`${imported}件取込完了（スキップ${skipped}件）`);
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
