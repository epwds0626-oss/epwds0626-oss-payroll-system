// ============================================================
// freelance.js  ―  業務委託管理
// ============================================================

// 業務委託スタッフの期間を返す
// ID=5（半谷）のみ 1日〜末日、それ以外は通常給与期間
function getFreelancePeriod(empId, year, month) {
  if (empId === 5) {
    const startDate = `${year}-${String(month).padStart(2,'0')}-01`;
    const lastDay   = new Date(year, month, 0).getDate();
    const endDate   = `${year}-${String(month).padStart(2,'0')}-${String(lastDay).padStart(2,'0')}`;
    return { startDate, endDate };
  }
  return getPayPeriod(year, month);
}

// 指定期間の日次データを取得（両店スタッフ対応：旧キー・_enya・_marco を統合）
// 戻り値：{ dateStr: rec }（同日に複数店舗の打刻がある場合は実働時間を合算）
function getFreelanceDailyData(empId, startDate, endDate) {
  const result = {};
  const start = new Date(startDate);
  const end   = new Date(endDate);

  // 給与期間ベース（21〜20日）ではなく月ベースで保存されているため、
  // 期間にまたがる全ての ym（カレンダー月）をスキャンする
  const ymSet = new Set();
  for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate()+1)) {
    const dateStr = dt.toISOString().slice(0,10);
    const [dy, dm] = dateStr.split('-').map(Number);
    ymSet.add(getYM(dy, dm));
  }

  const keysToCheck = [empId, String(empId), `${empId}_enya`, `${empId}_marco`];

  for (const ym of ymSet) {
    if (!attendance[ym]) continue;
    for (const key of keysToCheck) {
      const empData = attendance[ym][key];
      if (!empData) continue;
      for (const [dateStr, rawRec] of Object.entries(empData)) {
        const d = new Date(dateStr);
        if (d < start || d > end) continue;
        const rec = recomputeRec(rawRec);
        if (!result[dateStr]) {
          result[dateStr] = { ...rec };
        } else {
          // 同日に複数店舗の打刻がある場合は実働時間を合算
          result[dateStr] = {
            ...result[dateStr],
            actual: (result[dateStr].actual || 0) + (rec.actual || 0),
            _merged: true,
            _stores: [...(result[dateStr]._stores || []), key]
          };
        }
      }
    }
  }
  return result;
}

function renderFreelance(year, month) {
  const freelancers = employees.filter(e =>
    e.type === '業務委託' && e.status !== 'inactive'
  );

  if (!freelancers.length) {
    return `<div style="padding:40px;text-align:center;color:#999">
      業務委託スタッフが登録されていません。<br>
      従業員マスタで雇用区分「業務委託」で登録してください。
    </div>`;
  }

  // 月間集計（スタッフごとに期間を取得、店舗統合データを使用）
  const summaries = freelancers.map(emp => {
    const { startDate, endDate } = getFreelancePeriod(emp.id, year, month);
    const dailyData = getFreelanceDailyData(emp.id, startDate, endDate);
    let totalHours = 0, totalPay = 0, unpaidPay = 0;
    for (const [dateStr, rec] of Object.entries(dailyData)) {
      if (rec.actual > 0) {
        const pay = Math.round((emp.hourlyWage||0) * rec.actual);
        totalHours += rec.actual;
        totalPay   += pay;
        if (!rec.freelancePaid) unpaidPay += pay;
      }
    }
    return { emp, totalHours, totalPay, unpaidPay };
  });

  const rows = summaries.map(({ emp, totalHours, totalPay, unpaidPay }) => `
    <tr style="cursor:pointer" onclick="selectFreelancer(${emp.id})" id="fl-row-${emp.id}">
      <td class="tl">${emp.name}</td>
      <td>¥${(emp.hourlyWage||0).toLocaleString()}</td>
      <td>${hm(totalHours)}</td>
      <td>¥${totalPay.toLocaleString()}</td>
      <td style="color:${unpaidPay>0?'#c0392b':'#27ae60'};font-weight:700">
        ${unpaidPay>0?`¥${unpaidPay.toLocaleString()} 未払`:'全額済'}
      </td>
    </tr>`).join('');

  return `
    <div style="display:flex;gap:16px;height:calc(100vh - 120px)">
      <!-- 左：一覧 -->
      <div style="width:420px;flex-shrink:0">
        <h2 style="font-size:16px;font-weight:700;margin-bottom:12px">🤝 業務委託 — ${year}年${month}月</h2>
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <thead>
            <tr style="background:#1a3a5c;color:#fff">
              <th class="tl" style="padding:8px">氏名</th>
              <th style="padding:8px">時給</th>
              <th style="padding:8px">実働計</th>
              <th style="padding:8px">支払計</th>
              <th style="padding:8px">未払</th>
            </tr>
          </thead>
          <tbody id="freelanceList">${rows}</tbody>
        </table>
      </div>
      <!-- 右：日次明細 -->
      <div style="flex:1;overflow-y:auto" id="freelanceDetail">
        <div style="padding:40px;text-align:center;color:#999">
          左のスタッフを選択してください
        </div>
      </div>
    </div>`;
}

// 選択中のスタッフID
let _flSelectedId = null;

function selectFreelancer(empId) {
  _flSelectedId = empId;
  // 選択行ハイライト
  document.querySelectorAll('[id^="fl-row-"]').forEach(r => r.style.background = '');
  const row = document.getElementById(`fl-row-${empId}`);
  if (row) row.style.background = '#e8f0fe';

  renderFreelanceDetail(empId);
}

function renderFreelanceDetail(empId) {
  const emp = employees.find(e => e.id === empId);
  if (!emp) return;

  const y = currentYear, m = currentMonth;
  const { startDate, endDate } = getFreelancePeriod(empId, y, m);
  const start = new Date(startDate);
  const end   = new Date(endDate);
  const DOW   = ['日','月','火','水','木','金','土'];

  // 期間ラベル（半谷は月表示、その他は給与期間表示）
  const periodLabel = empId === 5
    ? `${y}年${m}月（${startDate} 〜 ${endDate}）`
    : `${y}年${m}月給与期間（${startDate} 〜 ${endDate}）`;

  let rows = '';
  let totalHours = 0, totalPay = 0;

  const dailyData = getFreelanceDailyData(empId, startDate, endDate);
  const sortedDates = Object.keys(dailyData).sort();

  for (const dateStr of sortedDates) {
    const rec = dailyData[dateStr];
    if (!rec.actual) continue;
    const [dy, dm, dd] = dateStr.split('-').map(Number);
    const dow = new Date(dateStr).getDay();

    const pay  = Math.round((emp.hourlyWage||0) * rec.actual);
    const paid = rec.freelancePaid ? true : false;
    totalHours += rec.actual;
    totalPay   += pay;

    // タイムライン（複数店舗合算の場合はその旨を表示）
    const timeline = rec._merged
      ? `<span style="color:#888">本店＋マルコ合算　計${hm(rec.actual)}</span>`
      : renderFreelanceTimeline(rec);

    rows += `<tr style="vertical-align:top">
      <td style="padding:8px;white-space:nowrap">${dm}/${dd}（${DOW[dow]}）</td>
      <td style="padding:8px">${hm(rec.actual)}</td>
      <td style="padding:8px;font-weight:700">¥${pay.toLocaleString()}</td>
      <td style="padding:8px;font-size:11px;line-height:1.7">${timeline}</td>
      <td style="padding:8px;text-align:center">
        <label style="cursor:pointer;display:flex;align-items:center;gap:4px;justify-content:center">
          <input type="checkbox" ${paid?'checked':''} onchange="toggleFreelancePaid(${empId},'${dateStr}',${dy},${dm},this.checked)"
            style="width:16px;height:16px">
          <span style="font-size:11px;color:${paid?'#27ae60':'#c0392b'}">${paid?'支払済':'未払'}</span>
        </label>
      </td>
    </tr>`;
  }

  const detail = document.getElementById('freelanceDetail');
  if (!detail) return;

  detail.innerHTML = `
    <div style="padding:4px">
      <h3 style="font-size:15px;font-weight:700;margin-bottom:4px;color:#1a3a5c">
        ${emp.name}　時給 ¥${(emp.hourlyWage||0).toLocaleString()}
      </h3>
      <div style="font-size:12px;color:#888;margin-bottom:12px">📅 ${periodLabel}</div>
      ${rows ? `
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <thead>
            <tr style="background:#1a3a5c;color:#fff">
              <th style="padding:8px">日付</th>
              <th style="padding:8px">実働</th>
              <th style="padding:8px">支払額</th>
              <th style="padding:8px;min-width:160px">打刻タイムライン</th>
              <th style="padding:8px">現金支払</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
          <tfoot>
            <tr style="background:#f8faff;font-weight:700">
              <td style="padding:8px">合計</td>
              <td style="padding:8px">${hm(totalHours)}</td>
              <td style="padding:8px">¥${totalPay.toLocaleString()}</td>
              <td colspan="2"></td>
            </tr>
          </tfoot>
        </table>` :
        '<div style="padding:20px;color:#999">この期間の勤怠データがありません</div>'
      }
    </div>`;
}

function renderFreelanceTimeline(rec) {
  if (!rec || (!rec.punchIn && !rec.actual)) return '<span style="color:#ccc">—</span>';
  const lines = [];
  if (rec.punchIn)  lines.push(`<span style="color:#1a3a5c">▶ ${rec.punchIn}</span>`);
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

function toggleFreelancePaid(empId, dateStr, dy, dm, paid) {
  const ym = getYM(dy, dm);
  // 実データがどのキー（旧ID / _enya / _marco）にあるか分からないため、
  // 存在するキー全てに freelancePaid を反映する
  const keysToCheck = [empId, String(empId), `${empId}_enya`, `${empId}_marco`];
  const updates = {};
  let found = false;
  for (const key of keysToCheck) {
    if (attendance[ym] && attendance[ym][key] && attendance[ym][key][dateStr]) {
      updates[`payroll/attendance/${ym}/${key}/${dateStr}/freelancePaid`] = paid;
      found = true;
    }
  }
  if (!found) {
    // フォールバック：従来通り数値IDに書き込む
    updates[`payroll/attendance/${ym}/${empId}/${dateStr}/freelancePaid`] = paid;
  }
  db.ref().update(updates, err => {
    if (!err) renderFreelanceDetail(empId);
  });
}
