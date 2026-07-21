// ============================================================
// timecard_manage.js ― 打刻管理（全スタッフ×期間マトリクス）
// 縦：スタッフ / 横：給与計算期間（21日〜翌20日）
// セルクリックで既存の打刻編集モーダル（openPunchEditor）を開く
// ============================================================

let _tcmStore    = '全店';   // 店舗フィルタ: 全店 / 本店 / マルコ
let _tcmMode     = 'detail'; // 表示: detail(出退勤+実働) / compact(実働のみ)
let _tcmMissOnly = false;    // 打刻漏れがあるスタッフのみ表示

// 展開済み従業員の店舗判定（両店スタッフは _enya/_marco で判定）
function tcmRowStore(emp) {
  const id = String(emp.id);
  if (id.includes('_enya'))  return '本店';
  if (id.includes('_marco')) return 'マルコ';
  return emp.store || '';
}

// 期間内の日付リスト
function tcmDates(year, month) {
  const { startDate, endDate } = getPayPeriod(year, month);
  const dates = [];
  const end = new Date(endDate);
  for (let dt = new Date(startDate); dt <= end; dt.setDate(dt.getDate() + 1)) {
    dates.push(dt.toISOString().slice(0, 10));
  }
  return dates;
}

// スタッフ1人分の date→rec マップ（期間内のみ）
function tcmEmpMap(empId, year, month) {
  const map = {};
  for (const d of getExtendedDailyList(empId, year, month, true)) {
    if (isInPayPeriod(d.date, year, month)) map[d.date] = d;
  }
  return map;
}

// 打刻漏れ判定（出勤のみ・退勤のみ）
function tcmIsMiss(rec) {
  if (!rec) return false;
  const hasIn  = !!rec.punchIn;
  const hasOut = !!rec.punchOut;
  return (hasIn && !hasOut) || (!hasIn && hasOut);
}

function renderTimecardManage(year, month) {
  const dates = tcmDates(year, month);
  const todayStr = new Date().toISOString().slice(0, 10);

  // 行データを先に構築
  let rows = activeEmployeesExpanded()
    .filter(emp => _tcmStore === '全店' || tcmRowStore(emp) === _tcmStore)
    .map(emp => {
      const map = tcmEmpMap(emp.id, year, month);
      let days = 0, actual = 0, ot = 0, midnight = 0, miss = 0, paid = 0;
      for (const d of dates) {
        const r = map[d];
        if (!r) continue;
        if ((r.actual || 0) > 0 || r.punchIn || r.punchOut) days++;
        actual   += r.actual   || 0;
        ot       += r.dailyOT  || 0;
        midnight += r.midnight || 0;
        if (r.paidLeave) paid++;
        if (tcmIsMiss(r)) miss++;
      }
      return { emp, map, days, actual, ot, midnight, miss, paid };
    })
    .filter(row => row.days > 0 || row.paid > 0 || !_tcmMissOnly) // 全員表示が基本
    ;
  if (_tcmMissOnly) rows = rows.filter(r => r.miss > 0);

  // サマリー
  const sumDays   = rows.reduce((s, r) => s + r.days, 0);
  const sumActual = rows.reduce((s, r) => s + r.actual, 0);
  const sumOT     = rows.reduce((s, r) => s + r.ot, 0);
  const sumMiss   = rows.reduce((s, r) => s + r.miss, 0);

  // 日別出勤人数（フッター用）
  const headcount = {};
  for (const d of dates) headcount[d] = rows.reduce((s, r) => s + ((r.map[d] && ((r.map[d].actual||0) > 0 || r.map[d].punchIn)) ? 1 : 0), 0);

  // 編集モーダル用に全行のマップをグローバル保持
  window._tcmMaps = {};
  for (const r of rows) window._tcmMaps[String(r.emp.id)] = r.map;

  const storeBtn = s => `<button class="btn-outline" onclick="_tcmStore='${s}';renderPage('timecard_manage')"
    style="${_tcmStore===s?'background:#1a3a5c;color:#fff;border-color:#1a3a5c':''}">${s}</button>`;

  // ---- ヘッダー行（日付） ----
  const headCells = dates.map(d => {
    const dt  = new Date(d);
    const dow = dt.getDay();
    const isLegal    = dow === PAY_CONFIG.legalHolidayDow;
    const isNonLegal = dow === PAY_CONFIG.nonLegalHolidayDow;
    const isToday    = d === todayStr;
    const bg = isToday ? '#fff9db' : isLegal ? '#fdecec' : isNonLegal ? '#fdf3e7' : '';
    const color = isLegal ? '#c0392b' : isNonLegal ? '#d35400' : dow===0 ? '#c0392b' : dow===6 ? '#2980b9' : '';
    const [,mm,dd] = d.split('-');
    return `<th style="min-width:${_tcmMode==='detail'?'86':'56'}px;background:${bg||'#1a3a5c'};${bg?`color:${color||'#333'}`:''}">
      ${parseInt(mm)}/${parseInt(dd)}<br><span style="font-size:10px">${DOW_NAMES[dow]}${isLegal?'🔴':isNonLegal?'🟠':''}</span></th>`;
  }).join('');

  // ---- 本体行 ----
  const bodyRows = rows.map(({ emp, map, days, actual, ot, midnight, miss }) => {
    const cells = dates.map(d => {
      const rec = map[d];
      const dt  = new Date(d);
      const dow = dt.getDay();
      const isToday = d === todayStr;
      const holBg = dow === PAY_CONFIG.legalHolidayDow ? '#fff7f7' : dow === PAY_CONFIG.nonLegalHolidayDow ? '#fffaf3' : '';
      const bg = isToday ? '#fffbe6' : holBg;
      const click = `onclick="tcmOpenEditor('${emp.id}','${d}',${year},${month})" style="cursor:pointer;background:${bg};padding:3px 4px;vertical-align:top" title="クリックして打刻編集"`;

      if (!rec || (!rec.punchIn && !rec.punchOut && !(rec.actual > 0) && !rec.paidLeave && !rec.absent)) {
        return `<td ${click}><span style="color:#d5dbe3">—</span></td>`;
      }
      if (rec.paidLeave) {
        return `<td ${click}><span style="display:inline-block;background:#e8f8ee;color:#1e8e4e;border-radius:4px;padding:1px 5px;font-size:10px;font-weight:700">有給</span></td>`;
      }
      if (rec.absent) {
        return `<td ${click}><span style="display:inline-block;background:#f3f4f6;color:#6b7280;border-radius:4px;padding:1px 5px;font-size:10px;font-weight:700">欠勤</span></td>`;
      }
      if (tcmIsMiss(rec)) {
        return `<td ${click.replace(`background:${bg}`, 'background:#fdecec')}>
          <div style="font-size:10px;color:#c0392b;font-weight:700">⚠ ${rec.punchIn ? `出 ${rec.punchIn}` : `退 ${rec.punchOut}`}</div>
          <div style="font-size:9px;color:#c0392b">${rec.punchIn ? '退勤なし' : '出勤なし'}</div></td>`;
      }
      const brMins = rec.breakMins || (rec.breaks || []).reduce((s, b) => s + (b.minutes || 0), 0);
      if (_tcmMode === 'compact') {
        return `<td ${click} style="cursor:pointer;background:${bg};padding:3px 4px;text-align:center">
          <span style="font-size:11px;font-weight:700;color:#1a5fa0">${hm(rec.actual)}</span>
          ${(rec.dailyOT||0)>0?'<span style="color:#c0392b;font-size:9px">残</span>':''}${(rec.midnight||0)>0?'<span style="color:#8e44ad;font-size:9px">深</span>':''}</td>`;
      }
      return `<td ${click}>
        <div style="font-size:10px;color:#374151;white-space:nowrap">${rec.punchIn||'--'}–${rec.punchOut||'--'}</div>
        ${brMins?`<div style="font-size:9px;color:#9ca3af">休${Math.round(brMins)}m</div>`:''}
        <div style="font-size:11px;font-weight:700;color:#1a5fa0">${hm(rec.actual)}</div>
        ${(rec.dailyOT||0)>0?`<div style="font-size:9px;color:#c0392b;font-weight:700">残 ${hm(rec.dailyOT)}</div>`:''}
        ${(rec.midnight||0)>0?`<div style="font-size:9px;color:#8e44ad;font-weight:700">深 ${hm(rec.midnight)}</div>`:''}
      </td>`;
    }).join('');

    return `<tr>
      <td class="tcm-sticky" style="font-weight:700;color:#1a3a5c;white-space:nowrap">${emp.name}${miss>0?` <span style="color:#c0392b;font-size:10px">⚠${miss}</span>`:''}</td>
      ${cells}
      <td style="text-align:center;font-weight:700">${days}</td>
      <td style="text-align:center;font-weight:700;color:#1a5fa0">${hm(actual)}</td>
      <td style="text-align:center;color:#c0392b;font-weight:700">${ot>0?hm(ot):'—'}</td>
      <td style="text-align:center;color:#8e44ad;font-weight:700">${midnight>0?hm(midnight):'—'}</td>
    </tr>`;
  }).join('');

  // ---- フッター（日別出勤人数） ----
  const footCells = dates.map(d => `<td style="text-align:center;font-weight:700">${headcount[d]||'—'}</td>`).join('');

  return `
  <div class="section-header">
    <div class="section-title">⏱️ 打刻管理 ― ${year}年${month}月度</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      ${storeBtn('全店')}${storeBtn('本店')}${storeBtn('マルコ')}
      <button class="btn-outline" onclick="_tcmMode=_tcmMode==='detail'?'compact':'detail';renderPage('timecard_manage')">${_tcmMode==='detail'?'▤ コンパクト表示':'▦ 詳細表示'}</button>
      <button class="btn-outline" onclick="_tcmMissOnly=!_tcmMissOnly;renderPage('timecard_manage')"
        style="${_tcmMissOnly?'background:#c0392b;color:#fff;border-color:#c0392b':''}">⚠ 打刻漏れのみ</button>
      <button class="btn-outline" onclick="exportTimecardManageCSV(${year},${month})">CSV出力</button>
    </div>
  </div>

  <div class="alert alert-info" style="margin-bottom:12px">
    <span>📅</span>
    <div><strong>対象期間：</strong>${getPayPeriod(year,month).startDate.replace(/-/g,'/')} 〜 ${getPayPeriod(year,month).endDate.replace(/-/g,'/')}　
    セルをクリックすると打刻の修正ができます（🔴木＝法定休日 / 🟠水＝法定外休日 / 黄色＝本日）</div>
  </div>

  <div class="stat-grid">
    <div class="stat-box"><div class="stat-val">${sumDays}</div><div class="stat-label">延べ出勤日数</div></div>
    <div class="stat-box"><div class="stat-val">${hm(sumActual)}</div><div class="stat-label">総実働時間</div></div>
    <div class="stat-box warn"><div class="stat-val">${hm(sumOT)}</div><div class="stat-label">総残業時間（日8h超）</div></div>
    <div class="stat-box ${sumMiss>0?'danger':'success'}"><div class="stat-val">${sumMiss}</div><div class="stat-label">打刻漏れ件数</div></div>
  </div>

  <div class="card">
    <style>
      #tcmTable { border-collapse:collapse; font-size:11px; }
      #tcmTable th { padding:4px 3px; white-space:nowrap; color:#fff; position:sticky; top:0; z-index:2; }
      #tcmTable td { padding:3px 4px; border-bottom:1px solid #eef1f5; border-right:1px solid #f3f5f8; }
      #tcmTable .tcm-sticky { position:sticky; left:0; background:#fff; z-index:1; border-right:2px solid #dce3ec; min-width:96px; }
      #tcmTable thead .tcm-sticky { background:#1a3a5c; z-index:3; }
      #tcmTable tfoot td { background:#eef2f8; border-top:2px solid #1a3a5c; }
      #tcmTable tfoot .tcm-sticky { background:#eef2f8; }
    </style>
    <div class="table-wrap" style="width:100%;overflow:auto;max-height:72vh;-webkit-overflow-scrolling:touch">
      <table id="tcmTable">
        <thead><tr>
          <th class="tcm-sticky">氏名</th>
          ${headCells}
          <th style="min-width:44px">出勤<br>日数</th><th style="min-width:56px">実働<br>合計</th>
          <th style="min-width:52px">残業<br>合計</th><th style="min-width:52px">深夜<br>合計</th>
        </tr></thead>
        <tbody>${bodyRows || `<tr><td colspan="${dates.length+5}" style="text-align:center;padding:24px;color:#9ca3af">該当データがありません</td></tr>`}</tbody>
        <tfoot><tr>
          <td class="tcm-sticky" style="font-weight:700">出勤人数</td>
          ${footCells}
          <td colspan="4"></td>
        </tr></tfoot>
      </table>
    </div>
  </div>`;
}

// セルクリック → 既存の打刻編集モーダルを開く
// openPunchEditor は window._lastEmpMap[dateStr] を参照するため、対象スタッフのマップを差し替えてから呼ぶ
function tcmOpenEditor(empId, dateStr, year, month) {
  window._lastEmpMap = (window._tcmMaps || {})[String(empId)] || {};
  openPunchEditor(empId, dateStr, year, month);
}

// マトリクスをCSV出力（1行＝スタッフ×日）
function exportTimecardManageCSV(year, month) {
  const dates  = tcmDates(year, month);
  const header = ['氏名','店舗','日付','曜日','出勤','退勤','休憩(分)','実働(h)','残業(h)','深夜(h)','有給','欠勤','打刻漏れ'];
  const rowsCsv = [];
  for (const emp of activeEmployeesExpanded()) {
    if (_tcmStore !== '全店' && tcmRowStore(emp) !== _tcmStore) continue;
    const map = tcmEmpMap(emp.id, year, month);
    for (const d of dates) {
      const r = map[d];
      if (!r) continue;
      const brMins = r.breakMins || (r.breaks || []).reduce((s, b) => s + (b.minutes || 0), 0);
      rowsCsv.push([
        emp.name, tcmRowStore(emp), d.replace(/-/g,'/'), DOW_NAMES[new Date(d).getDay()],
        r.punchIn || '', r.punchOut || '', Math.round(brMins) || 0,
        r.actual || 0, r.dailyOT || 0, r.midnight || 0,
        r.paidLeave ? 1 : 0, r.absent ? 1 : 0, tcmIsMiss(r) ? '⚠' : ''
      ]);
    }
  }
  const csv = [header, ...rowsCsv].map(r => r.join(',')).join('\n');
  dlFile(`打刻管理_${year}年${month}月度.csv`, csv, 'text/csv');
}
