// ============================================================
// weekly.js  ―  週次集計・週マタギ残業詳細
// ============================================================

function renderWeekly(year, month) {
  const rows = activeEmployees().map(emp => {
    const extended = getExtendedDailyList(emp.id, year, month);
    const result   = calcWeeklyOT(extended, year, month);
    return { emp, result };
  });

  return `
  <div class="section-header">
    <div class="section-title">📅 週次集計（週マタギ残業） ― ${year}年${month}月</div>
    <button class="btn-outline" onclick="exportWeeklyCSV(${year},${month})">CSV出力</button>
  </div>

  <div class="alert alert-info">
    <span>⚠️</span>
    <div><strong>週マタギ計算について</strong><br>
    労基法は「週」単位（月曜〜日曜）で40時間を管理します。月をまたぐ週も正しく計算します。<br>
    🔴 <strong>法定休日：木曜日</strong>（35%割増）　🟠 <strong>法定外休日：水曜日</strong>（週40h超分のみ25%）</div>
  </div>

  <div class="card">
    <div class="card-title">月次サマリ（全員）</div>
    <div class="table-wrap"><table>
      <thead><tr>
        <th class="tl">氏名</th><th>雇用区分</th><th>店舗</th>
        <th>実働合計</th><th>週40h超<br>残業(h)</th><th>深夜(h)</th><th>休日(h)</th>
        <th>出勤日数</th><th>36協定</th>
      </tr></thead>
      <tbody>
      ${rows.map(({ emp, result }) => {
        const r36  = check36(emp.id, year, month);
        const badge = r36.alerts.some(a=>a.level==='danger')
          ? '<span class="badge badge-red">超過</span>'
          : r36.alerts.some(a=>a.level==='warn')
          ? '<span class="badge badge-yellow">要注意</span>'
          : '<span class="badge badge-green">正常</span>';
        const cls = r36.alerts.some(a=>a.level==='danger') ? 'danger-row'
                  : r36.alerts.some(a=>a.level==='warn')   ? 'warning-row' : '';
        return `<tr class="${cls}">
          <td class="tl">${emp.name}</td>
          <td>${emp.type}</td>
          <td>${emp.store||'—'}</td>
          <td>${result.totalActual}h</td>
          <td><strong>${result.monthOT}h</strong></td>
          <td>${result.monthMidnight}h</td>
          <td>${result.monthHoliday}h</td>
          <td>${getMonthSummary(emp.id,year,month).workDays}日</td>
          <td>${badge}</td>
        </tr>`;
      }).join('')}
      </tbody>
    </table></div>
  </div>

  <div class="card">
    <div class="card-title">週別詳細</div>
    <div class="form-group" style="margin-bottom:12px">
      <select id="weekEmpSel" onchange="renderWeekDetail(${year},${month})" style="border:1px solid #dce3ec;border-radius:6px;padding:5px 10px;font-family:inherit;font-size:13px">
        ${activeEmployees().map(e=>`<option value="${e.id}">${e.name}</option>`).join('')}
      </select>
    </div>
    <div id="weekDetailWrap"></div>
  </div>`;
}

function renderWeekDetail(year, month) {
  const sel = document.getElementById('weekEmpSel');
  if (!sel) return;
  const empId = parseInt(sel.value);
  const emp   = employees.find(e=>e.id===empId);
  if (!emp) return;

  const extended = getExtendedDailyList(empId, year, month);
  const result   = calcWeeklyOT(extended, year, month);
  const DOW = ['日','月','火','水','木','金','土'];

  // 週ごとの日別詳細も表示
  const byWeek = {};
  for (const d of extended) {
    const dt  = new Date(d.date);
    const day = dt.getDay() || 7;
    const mon = new Date(dt); mon.setDate(dt.getDate()-day+1);
    const wk  = mon.toISOString().slice(0,10);
    if (!byWeek[wk]) byWeek[wk] = [];
    byWeek[wk].push(d);
  }

  let html = '';
  for (const wkStart of Object.keys(byWeek).sort()) {
    const days   = byWeek[wkStart];
    const endDt  = new Date(wkStart); endDt.setDate(endDt.getDate()+6);
    const wkEnd  = endDt.toISOString().slice(0,10);
    const wkActual   = days.reduce((s,d)=>s+(d.actual||0),0);
    const wkOT       = Math.max(0, wkActual-40);
    const wkMidnight = days.reduce((s,d)=>s+(d.midnight||0),0);
    const wkHoliday  = days.reduce((s,d)=>s+(d.holiday||0),0);

    const daysThisMonth = days.filter(d=>{
      const [y,m]=d.date.split('-').map(Number);
      return y===year&&m===month;
    }).length;
    const isCrossMonth = days.some(d=>{
      const [y,m]=d.date.split('-').map(Number);
      return !(y===year&&m===month);
    });

    html += `
    <div style="margin-bottom:16px">
      <div style="font-weight:700;color:var(--primary);margin-bottom:6px;display:flex;align-items:center;gap:8px">
        📅 ${wkStart.replace(/-/g,'/')} 〜 ${wkEnd.replace(/-/g,'/')}
        ${isCrossMonth?'<span class="badge badge-yellow">月マタギ週</span>':''}
        <span style="margin-left:auto">週実働：${wkActual}h ／ 残業：<strong style="color:${wkOT>0?'var(--danger)':'inherit'}">${wkOT}h</strong></span>
      </div>
      <div class="table-wrap"><table>
        <thead><tr><th>日付</th><th>曜日</th><th>当月</th><th>実働(h)</th><th>深夜(h)</th><th>休日</th><th>備考</th></tr></thead>
        <tbody>
        ${days.map(d=>{
          const dt = new Date(d.date);
          const dow = dt.getDay();
          const [y,m]=d.date.split('-').map(Number);
          const inMonth = y===year&&m===month;
          return `<tr ${!inMonth?'style="opacity:0.5"':''}>
            <td>${d.date.replace(/-/g,'/')}</td>
            <td style="color:${dow===0?'#c0392b':dow===6?'#2980b9':'inherit'}">${DOW[dow]}</td>
            <td>${inMonth?'✓':'前後月'}</td>
            <td>${d.actual||0}h</td>
            <td>${d.midnight||0}h</td>
            <td>${d.holiday?'●':''}</td>
            <td>${d.note||''}</td>
          </tr>`;
        }).join('')}
        </tbody>
        <tfoot><tr class="total-row">
          <td colspan="3">週計</td>
          <td>${wkActual}h</td>
          <td>${wkMidnight}h</td>
          <td>${wkHoliday}h</td>
          <td>残業：<strong>${wkOT}h</strong></td>
        </tr></tfoot>
      </table></div>
    </div>`;
  }

  document.getElementById('weekDetailWrap').innerHTML = html || '<p>勤怠データがありません</p>';
}

function exportWeeklyCSV(year, month) {
  const header = ['氏名','雇用区分','店舗','実働合計(h)','週40h超残業(h)','深夜(h)','休日(h)','出勤日数'];
  const rows = activeEmployees().map(emp => {
    const r = calcWeeklyOT(getExtendedDailyList(emp.id, year, month), year, month);
    const s = getMonthSummary(emp.id, year, month);
    return [emp.name, emp.type, emp.store||'', r.totalActual, r.monthOT, r.monthMidnight, r.monthHoliday, s.workDays];
  });
  const csv = [header,...rows].map(r=>r.join(',')).join('\n');
  dlFile(`週次集計_${year}年${month}月.csv`, csv, 'text/csv');
}

// 週次ページのイベント
const _origAttachOld = attachPageEvents;
function attachPageEvents(page) {
  if (page === 'weekly') {
    setTimeout(()=>{
      const y = parseInt(document.getElementById('targetYear').value);
      const m = parseInt(document.getElementById('targetMonth').value);
      renderWeekDetail(y, m);
    }, 0);
  } else if (page === 'attendance') {
    setTimeout(()=>{
      const y = parseInt(document.getElementById('targetYear').value);
      const m = parseInt(document.getElementById('targetMonth').value);
      renderAttendanceTable(y, m);
    }, 0);
  }
}

// 月次勤怠ページ
function renderMonthly(year, month) {
  const rows = activeEmployees().map(emp => {
    const s = getMonthSummary(emp.id, year, month);
    return { emp, s };
  });
  const totals = rows.reduce((acc, { s }) => {
    acc.workDays   += s.workDays;
    acc.totalActual += s.totalActual;
    acc.monthOT    += s.monthOT;
    acc.monthMidnight += s.monthMidnight;
    acc.monthHoliday  += s.monthHoliday;
    acc.paidDays   += s.paidDays;
    acc.absentDays += s.absentDays;
    return acc;
  }, { workDays:0, totalActual:0, monthOT:0, monthMidnight:0, monthHoliday:0, paidDays:0, absentDays:0 });

  return `
  <div class="section-header">
    <div class="section-title">📋 月次勤怠一覧 ― ${year}年${month}月</div>
    <button class="btn-outline" onclick="exportMonthlyCSV(${year},${month})">CSV出力</button>
  </div>
  <div class="card">
    <div class="table-wrap"><table>
      <thead><tr>
        <th>No</th><th class="tl">氏名</th><th>雇用</th><th>店舗</th>
        <th>出勤日数</th><th>有給日数</th><th>欠勤日数</th>
        <th>実働(h)</th><th>週残業(h)</th><th>深夜(h)</th><th>休日(h)</th>
        <th>遅刻(h)</th>
      </tr></thead>
      <tbody>
      ${rows.map(({emp,s})=>`<tr>
        <td>${emp.id}</td>
        <td class="tl">${emp.name}</td>
        <td>${emp.type}</td>
        <td>${emp.store||'—'}</td>
        <td>${s.workDays}</td>
        <td>${s.paidDays}</td>
        <td>${s.absentDays}</td>
        <td>${s.totalActual}</td>
        <td><strong>${s.monthOT}</strong></td>
        <td>${s.monthMidnight}</td>
        <td>${s.monthHoliday}</td>
        <td>${s.lateDays}</td>
      </tr>`).join('')}
      </tbody>
      <tfoot><tr class="total-row">
        <td colspan="4">合計</td>
        <td>${totals.workDays}</td>
        <td>${totals.paidDays}</td>
        <td>${totals.absentDays}</td>
        <td>${Math.round(totals.totalActual*10)/10}</td>
        <td><strong>${Math.round(totals.monthOT*10)/10}</strong></td>
        <td>${Math.round(totals.monthMidnight*10)/10}</td>
        <td>${Math.round(totals.monthHoliday*10)/10}</td>
        <td>—</td>
      </tr></tfoot>
    </table></div>
  </div>`;
}

function exportMonthlyCSV(year, month) {
  const header = ['No','氏名','雇用区分','出勤日数','有給日数','欠勤日数','実働(h)','週残業(h)','深夜(h)','休日(h)'];
  const rows = activeEmployees().map(emp => {
    const s = getMonthSummary(emp.id, year, month);
    return [emp.id, emp.name, emp.type, s.workDays, s.paidDays, s.absentDays, s.totalActual, s.monthOT, s.monthMidnight, s.monthHoliday];
  });
  const csv = [header,...rows].map(r=>r.join(',')).join('\n');
  dlFile(`月次勤怠_${year}年${month}月.csv`, csv, 'text/csv');
}
