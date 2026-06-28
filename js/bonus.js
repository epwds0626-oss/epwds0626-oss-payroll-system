// ============================================================
// bonus.js  ―  賞与（インセンティブ）明細
// ============================================================

function renderBonus(year, month) {
  const emps = employees.filter(e => e.type !== '役員');

  return `
<div style="max-width:900px;margin:0 auto;padding:16px">
  <h2 style="font-size:18px;font-weight:700;margin-bottom:4px">🎯 賞与明細（インセンティブ）</h2>
  <p style="font-size:12px;color:#6b7280;margin-bottom:16px">
    達成月の翌月末日支払い。賞与額を入力すると控除・手取りを自動計算します。
  </p>

  <!-- 年月・スタッフ選択 -->
  <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:14px;margin-bottom:16px;display:flex;flex-wrap:wrap;gap:12px;align-items:center">
    <div>
      <label style="font-size:12px;color:#6b7280">支払年月</label><br>
      <select id="bonusYear" onchange="bonusRefresh()" style="border:1px solid #d1d5db;border-radius:6px;padding:4px 8px;font-size:14px">
        ${[2024,2025,2026,2027].map(y=>`<option value="${y}" ${y===year?'selected':''}>${y}年</option>`).join('')}
      </select>
      <select id="bonusMonth" onchange="bonusRefresh()" style="border:1px solid #d1d5db;border-radius:6px;padding:4px 8px;font-size:14px;margin-left:4px">
        ${Array.from({length:12},(_,i)=>i+1).map(m=>`<option value="${m}" ${m===month?'selected':''}>${m}月</option>`).join('')}
      </select>
    </div>
    <div style="margin-left:auto;display:flex;gap:8px">
      <button onclick="bonusPrintSelected()" style="background:#374151;color:#fff;border:none;border-radius:6px;padding:6px 14px;font-size:13px;cursor:pointer">🖨 選択して印刷</button>
      <button onclick="bonusSaveAll()" style="background:#059669;color:#fff;border:none;border-radius:6px;padding:6px 14px;font-size:13px;cursor:pointer">💾 一括保存</button>
    </div>
  </div>

  <!-- スタッフ一覧テーブル -->
  <div style="overflow-x:auto">
    <table style="width:100%;border-collapse:collapse;font-size:13px">
      <thead>
        <tr style="background:#f3f4f6;text-align:left">
          <th style="padding:8px 6px;border-bottom:2px solid #e5e7eb;white-space:nowrap">☑</th>
          <th style="padding:8px 6px;border-bottom:2px solid #e5e7eb;white-space:nowrap">氏名</th>
          <th style="padding:8px 6px;border-bottom:2px solid #e5e7eb;white-space:nowrap">区分</th>
          <th style="padding:8px 6px;border-bottom:2px solid #e5e7eb;white-space:nowrap">店舗</th>
          <th style="padding:8px 6px;border-bottom:2px solid #e5e7eb;text-align:right;white-space:nowrap">賞与額（入力）</th>
          <th style="padding:8px 6px;border-bottom:2px solid #e5e7eb;text-align:right;white-space:nowrap">社保計</th>
          <th style="padding:8px 6px;border-bottom:2px solid #e5e7eb;text-align:right;white-space:nowrap">雇用保険</th>
          <th style="padding:8px 6px;border-bottom:2px solid #e5e7eb;text-align:right;white-space:nowrap">所得税</th>
          <th style="padding:8px 6px;border-bottom:2px solid #e5e7eb;text-align:right;white-space:nowrap">控除合計</th>
          <th style="padding:8px 6px;border-bottom:2px solid #e5e7eb;text-align:right;white-space:nowrap">手取額</th>
          <th style="padding:8px 6px;border-bottom:2px solid #e5e7eb;text-align:center;white-space:nowrap">明細</th>
        </tr>
      </thead>
      <tbody id="bonusTbody">
        ${emps.map(emp => renderBonusRow(emp, year, month)).join('')}
      </tbody>
    </table>
  </div>

  <p style="font-size:11px;color:#9ca3af;margin-top:12px">
    ※ 所得税は「賞与に対する源泉徴収税額算出率の表」（国税庁）による。前月給与データをFirebaseから参照。<br>
    ※ 社保は賞与額の千円未満を切り捨てた標準賞与額で計算。<br>
    ※ 住民税は賞与に課されないため控除なし。
  </p>
</div>`;
}

function renderBonusRow(emp, year, month) {
  const key = `bonus_${year}_${month}_${emp.id}`;
  const saved = getBonusData(emp.id, year, month);
  const amount = saved ? saved.bonusAmount : 0;

  // 事前計算（保存済み金額があれば）
  let calc = { kenpo:0, kosei:0, shienkin:0, koyoHoken:0, incomeTax:0, totalDeduction:0, netPay:0 };
  if (amount > 0) {
    const prevNet = getPrevMonthNetShakai(emp.id, year, month);
    calc = calcBonusDeductions(emp, amount, 0, prevNet);
  }

  const shakaiTotal = calc.kenpo + calc.kosei + calc.shienkin;
  const isBoth = emp.store === '両店';

  return `<tr id="bonusRow_${emp.id}" style="border-bottom:1px solid #f3f4f6">
    <td style="padding:6px"><input type="checkbox" id="bonusChk_${emp.id}" style="width:15px;height:15px"></td>
    <td style="padding:6px;font-weight:600">${emp.name}${isBoth?'<span style="font-size:10px;color:#6366f1;margin-left:3px">両店</span>':''}</td>
    <td style="padding:6px;color:#6b7280;font-size:12px">${emp.type}</td>
    <td style="padding:6px;font-size:12px">${emp.store||''}</td>
    <td style="padding:6px;text-align:right">
      <input type="number" id="bonusAmt_${emp.id}" value="${amount||''}"
        min="0" step="1000" placeholder="0"
        oninput="bonusCalcRow(${emp.id},${year},${month})"
        style="width:110px;text-align:right;border:1px solid #d1d5db;border-radius:6px;padding:4px 8px;font-size:13px">
    </td>
    <td style="padding:6px;text-align:right" id="bonusShakai_${emp.id}">${shakaiTotal>0?'¥'+shakaiTotal.toLocaleString():'-'}</td>
    <td style="padding:6px;text-align:right" id="bonusKoyo_${emp.id}">${calc.koyoHoken>0?'¥'+calc.koyoHoken.toLocaleString():'-'}</td>
    <td style="padding:6px;text-align:right" id="bonusTax_${emp.id}">${calc.incomeTax>0?'¥'+calc.incomeTax.toLocaleString():'-'}</td>
    <td style="padding:6px;text-align:right;color:#dc2626" id="bonusDeduct_${emp.id}">${calc.totalDeduction>0?'¥'+calc.totalDeduction.toLocaleString():'-'}</td>
    <td style="padding:6px;text-align:right;font-weight:700;color:#065f46" id="bonusNet_${emp.id}">${calc.netPay>0?'¥'+calc.netPay.toLocaleString():'-'}</td>
    <td style="padding:6px;text-align:center">
      <button onclick="bonusShowSlip(${emp.id},${year},${month})"
        style="background:#3b82f6;color:#fff;border:none;border-radius:5px;padding:3px 10px;font-size:12px;cursor:pointer">明細</button>
    </td>
  </tr>`;
}

// -------- リアルタイム計算 --------
function bonusCalcRow(empId, year, month) {
  const emp = employees.find(e => e.id === empId);
  if (!emp) return;

  const amtEl = document.getElementById(`bonusAmt_${empId}`);
  const amount = parseInt(amtEl?.value) || 0;

  let calc = { kenpo:0, kosei:0, shienkin:0, koyoHoken:0, incomeTax:0, totalDeduction:0, netPay:0 };
  if (amount > 0) {
    const prevNet = getPrevMonthNetShakai(empId, year, month);
    calc = calcBonusDeductions(emp, amount, 0, prevNet);
  }

  const shakaiTotal = calc.kenpo + calc.kosei + calc.shienkin;
  const fmt = v => v > 0 ? '¥' + v.toLocaleString() : '-';

  document.getElementById(`bonusShakai_${empId}`).textContent  = fmt(shakaiTotal);
  document.getElementById(`bonusKoyo_${empId}`).textContent    = fmt(calc.koyoHoken);
  document.getElementById(`bonusTax_${empId}`).textContent     = fmt(calc.incomeTax);
  document.getElementById(`bonusDeduct_${empId}`).textContent  = fmt(calc.totalDeduction);
  document.getElementById(`bonusNet_${empId}`).textContent     = fmt(calc.netPay);
}

// -------- Firebase 保存・読込 --------
function saveBonusData(empId, year, month, data) {
  const key = `bonus/${year}/${String(month).padStart(2,'0')}/${empId}`;
  if (typeof db !== 'undefined') {
    db.ref(key).set(data);
  }
  // LocalStorage fallback
  localStorage.setItem(`bonus_${year}_${month}_${empId}`, JSON.stringify(data));
}

function getBonusData(empId, year, month) {
  const ls = localStorage.getItem(`bonus_${year}_${month}_${empId}`);
  return ls ? JSON.parse(ls) : null;
}

async function loadBonusFromFirebase(year, month) {
  if (typeof db === 'undefined') return;
  const key = `bonus/${year}/${String(month).padStart(2,'0')}`;
  try {
    const snap = await db.ref(key).once('value');
    const data = snap.val() || {};
    Object.entries(data).forEach(([empId, val]) => {
      localStorage.setItem(`bonus_${year}_${month}_${empId}`, JSON.stringify(val));
    });
  } catch(e) { console.warn('Firebase bonus load error:', e); }
}

// -------- 一括保存 --------
function bonusSaveAll() {
  const year  = parseInt(document.getElementById('bonusYear')?.value)  || new Date().getFullYear();
  const month = parseInt(document.getElementById('bonusMonth')?.value) || new Date().getMonth()+1;
  const emps = employees.filter(e => e.type !== '役員');

  let count = 0;
  emps.forEach(emp => {
    const amtEl = document.getElementById(`bonusAmt_${emp.id}`);
    const amount = parseInt(amtEl?.value) || 0;
    if (amount > 0) {
      const prevNet = getPrevMonthNetShakai(emp.id, year, month);
      const calc = calcBonusDeductions(emp, amount, 0, prevNet);
      saveBonusData(emp.id, year, month, { bonusAmount: amount, prevMonthNetShakai: prevNet, ...calc, savedAt: new Date().toISOString() });
      count++;
    }
  });
  alert(`${count}件 保存しました。`);
}

// -------- ページ更新 --------
function bonusRefresh() {
  const year  = parseInt(document.getElementById('bonusYear')?.value)  || new Date().getFullYear();
  const month = parseInt(document.getElementById('bonusMonth')?.value) || new Date().getMonth()+1;
  loadBonusFromFirebase(year, month).then(() => {
    document.getElementById('pageContent').innerHTML = renderBonus(year, month);
  });
}

// -------- 賞与明細モーダル --------
function bonusShowSlip(empId, year, month) {
  const emp = employees.find(e => e.id === empId);
  if (!emp) return;

  const amtEl  = document.getElementById(`bonusAmt_${empId}`);
  const amount = parseInt(amtEl?.value) || 0;

  let calc = { kenpo:0, kosei:0, shienkin:0, koyoHoken:0, incomeTax:0, totalDeduction:0, netPay:0 };
  let prevNet = 0;
  if (amount > 0) {
    prevNet = getPrevMonthNetShakai(empId, year, month);
    calc = calcBonusDeductions(emp, amount, 0, prevNet);
  }

  const shakaiTotal = calc.kenpo + calc.kosei + calc.shienkin;
  const payDate = new Date(year, month, 0); // 末日
  const payDateStr = `${year}年${month}月${payDate.getDate()}日`;

  const html = `
<div id="bonusSlipModal" style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center" onclick="if(event.target===this)this.remove()">
  <div style="background:#fff;border-radius:12px;width:480px;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3)">

    <!-- ヘッダー -->
    <div style="background:#1e3a5f;color:#fff;padding:16px 20px;border-radius:12px 12px 0 0;display:flex;justify-content:space-between;align-items:center">
      <div>
        <div style="font-size:15px;font-weight:700">🎯 賞与明細書</div>
        <div style="font-size:11px;opacity:0.8;margin-top:2px">${OTD.company}</div>
      </div>
      <button onclick="document.getElementById('bonusSlipModal').remove()" style="background:rgba(255,255,255,0.2);border:none;color:#fff;border-radius:6px;padding:4px 10px;cursor:pointer;font-size:13px">✕</button>
    </div>

    <!-- 明細本文 -->
    <div style="padding:20px" id="bonusSlipContent">

      <!-- 基本情報 -->
      <div style="display:flex;justify-content:space-between;margin-bottom:16px;font-size:13px">
        <div>
          <div style="font-size:16px;font-weight:700">${emp.name}</div>
          <div style="color:#6b7280;font-size:12px">${emp.type} ／ ${emp.store||''}</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:12px;color:#6b7280">支払日</div>
          <div style="font-weight:600">${payDateStr}</div>
        </div>
      </div>

      <hr style="border:none;border-top:1px solid #e5e7eb;margin:12px 0">

      <!-- 支給 -->
      <div style="margin-bottom:14px">
        <div style="font-size:11px;font-weight:700;color:#374151;background:#f3f4f6;padding:4px 8px;border-radius:4px;margin-bottom:6px">支　給</div>
        <div style="display:flex;justify-content:space-between;padding:5px 8px;background:#ecfdf5;border-radius:4px">
          <span style="font-weight:700">🎯 インセンティブ賞与</span>
          <span style="font-weight:700;font-size:16px">¥${amount.toLocaleString()}</span>
        </div>
      </div>

      <!-- 控除 -->
      <div style="margin-bottom:14px">
        <div style="font-size:11px;font-weight:700;color:#374151;background:#f3f4f6;padding:4px 8px;border-radius:4px;margin-bottom:6px">控　除</div>
        ${emp.shakai==='加入'?`
        <div style="display:flex;justify-content:space-between;padding:4px 8px;border-bottom:1px solid #f9fafb">
          <span style="color:#6b7280">健康保険料</span><span>¥${calc.kenpo.toLocaleString()}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:4px 8px;border-bottom:1px solid #f9fafb">
          <span style="color:#6b7280">厚生年金保険料</span><span>¥${calc.kosei.toLocaleString()}</span>
        </div>
        ${calc.shienkin>0?`<div style="display:flex;justify-content:space-between;padding:4px 8px;border-bottom:1px solid #f9fafb"><span style="color:#6b7280">子育て支援金</span><span>¥${calc.shienkin.toLocaleString()}</span></div>`:''}
        `:''}
        ${emp.koyo==='加入'?`
        <div style="display:flex;justify-content:space-between;padding:4px 8px;border-bottom:1px solid #f9fafb">
          <span style="color:#6b7280">雇用保険料（0.5%）</span><span>¥${calc.koyoHoken.toLocaleString()}</span>
        </div>`:''}
        <div style="display:flex;justify-content:space-between;padding:4px 8px;border-bottom:1px solid #f9fafb">
          <span style="color:#6b7280">所得税<span style="font-size:10px;margin-left:4px">（前月社保控除後給与 ¥${prevNet.toLocaleString()}）</span></span>
          <span>¥${calc.incomeTax.toLocaleString()}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:5px 8px;background:#fef2f2;border-radius:4px;margin-top:4px">
          <span style="font-weight:700;color:#dc2626">控除合計</span>
          <span style="font-weight:700;color:#dc2626">¥${calc.totalDeduction.toLocaleString()}</span>
        </div>
      </div>

      <!-- 手取 -->
      <div style="background:#1e3a5f;color:#fff;border-radius:8px;padding:12px 16px;display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:14px;font-weight:600">差引支給額（手取）</span>
        <span style="font-size:22px;font-weight:700">¥${calc.netPay.toLocaleString()}</span>
      </div>

      <p style="font-size:10px;color:#9ca3af;margin-top:10px;text-align:center">
        住民税は賞与に課されません。インセンティブ達成おめでとうございます！
      </p>
    </div>

    <!-- フッターボタン -->
    <div style="padding:12px 20px;border-top:1px solid #e5e7eb;display:flex;gap:8px;justify-content:flex-end">
      <button onclick="bonusSlipPrint(${empId})" style="background:#374151;color:#fff;border:none;border-radius:6px;padding:7px 16px;font-size:13px;cursor:pointer">🖨 印刷</button>
      <button onclick="bonusSaveOne(${empId},${year},${month})" style="background:#059669;color:#fff;border:none;border-radius:6px;padding:7px 16px;font-size:13px;cursor:pointer">💾 保存</button>
    </div>
  </div>
</div>`;

  document.body.insertAdjacentHTML('beforeend', html);
}

function bonusSaveOne(empId, year, month) {
  const emp = employees.find(e => e.id === empId);
  if (!emp) return;
  const amtEl = document.getElementById(`bonusAmt_${empId}`);
  const amount = parseInt(amtEl?.value) || 0;
  if (amount <= 0) { alert('賞与額を入力してください'); return; }
  const prevNet = getPrevMonthNetShakai(empId, year, month);
  const calc = calcBonusDeductions(emp, amount, 0, prevNet);
  saveBonusData(empId, year, month, { bonusAmount: amount, prevMonthNetShakai: prevNet, ...calc, savedAt: new Date().toISOString() });
  alert('保存しました。');
}

function bonusSlipPrint(empId) {
  const content = document.getElementById('bonusSlipContent')?.innerHTML;
  if (!content) return;
  const win = window.open('', '_blank', 'width=550,height=750');
  win.document.write(`<!DOCTYPE html><html><head><title>賞与明細</title>
  <style>body{font-family:'Noto Sans JP',sans-serif;font-size:13px;color:#111;margin:20px}hr{border:none;border-top:1px solid #e5e7eb}</style>
  </head><body>${content}<script>window.onload=()=>{window.print();window.close();}<\/script></body></html>`);
  win.document.close();
}

// -------- 選択印刷 --------
function bonusPrintSelected() {
  const year  = parseInt(document.getElementById('bonusYear')?.value)  || new Date().getFullYear();
  const month = parseInt(document.getElementById('bonusMonth')?.value) || new Date().getMonth()+1;
  const emps = employees.filter(e => e.type !== '役員');

  const selected = emps.filter(emp => document.getElementById(`bonusChk_${emp.id}`)?.checked);
  if (selected.length === 0) { alert('印刷するスタッフを選択してください'); return; }

  const payDate = new Date(year, month, 0);
  const payDateStr = `${year}年${month}月${payDate.getDate()}日`;

  const slips = selected.map(emp => {
    const amtEl = document.getElementById(`bonusAmt_${emp.id}`);
    const amount = parseInt(amtEl?.value) || 0;
    let calc = { kenpo:0, kosei:0, shienkin:0, koyoHoken:0, incomeTax:0, totalDeduction:0, netPay:0 };
    let prevNet = 0;
    if (amount > 0) {
      prevNet = getPrevMonthNetShakai(emp.id, year, month);
      calc = calcBonusDeductions(emp, amount, 0, prevNet);
    }
    return `
    <div style="page-break-after:always;max-width:460px;margin:0 auto 40px;padding:20px;border:1px solid #ccc;border-radius:8px">
      <div style="background:#1e3a5f;color:#fff;padding:10px 14px;border-radius:6px 6px 0 0;margin:-20px -20px 16px">
        <div style="font-size:14px;font-weight:700">🎯 賞与明細書</div>
        <div style="font-size:10px;opacity:0.8">${OTD.company} ／ 支払日：${payDateStr}</div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:12px">
        <div style="font-size:15px;font-weight:700">${emp.name}</div>
        <div style="font-size:11px;color:#555">${emp.type} ／ ${emp.store||''}</div>
      </div>
      <div style="display:flex;justify-content:space-between;padding:6px 10px;background:#ecfdf5;border-radius:4px;margin-bottom:10px">
        <span style="font-weight:700">インセンティブ賞与</span>
        <span style="font-weight:700;font-size:15px">¥${amount.toLocaleString()}</span>
      </div>
      <div style="font-size:12px;margin-bottom:10px">
        ${emp.shakai==='加入'?`
        <div style="display:flex;justify-content:space-between;padding:3px 8px;border-bottom:1px solid #f0f0f0"><span style="color:#555">健康保険料</span><span>¥${calc.kenpo.toLocaleString()}</span></div>
        <div style="display:flex;justify-content:space-between;padding:3px 8px;border-bottom:1px solid #f0f0f0"><span style="color:#555">厚生年金保険料</span><span>¥${calc.kosei.toLocaleString()}</span></div>
        ${calc.shienkin>0?`<div style="display:flex;justify-content:space-between;padding:3px 8px;border-bottom:1px solid #f0f0f0"><span style="color:#555">子育て支援金</span><span>¥${calc.shienkin.toLocaleString()}</span></div>`:''}
        `:''}
        ${emp.koyo==='加入'?`<div style="display:flex;justify-content:space-between;padding:3px 8px;border-bottom:1px solid #f0f0f0"><span style="color:#555">雇用保険料（0.5%）</span><span>¥${calc.koyoHoken.toLocaleString()}</span></div>`:''}
        <div style="display:flex;justify-content:space-between;padding:3px 8px;border-bottom:1px solid #f0f0f0"><span style="color:#555">所得税</span><span>¥${calc.incomeTax.toLocaleString()}</span></div>
        <div style="display:flex;justify-content:space-between;padding:5px 8px;background:#fef2f2;border-radius:4px;margin-top:4px">
          <span style="font-weight:700;color:#dc2626">控除合計</span>
          <span style="font-weight:700;color:#dc2626">¥${calc.totalDeduction.toLocaleString()}</span>
        </div>
      </div>
      <div style="background:#1e3a5f;color:#fff;border-radius:6px;padding:10px 14px;display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:13px;font-weight:600">差引支給額（手取）</span>
        <span style="font-size:20px;font-weight:700">¥${calc.netPay.toLocaleString()}</span>
      </div>
    </div>`;
  }).join('');

  const win = window.open('', '_blank', 'width=700,height=900');
  win.document.write(`<!DOCTYPE html><html><head><title>賞与明細</title>
  <style>body{font-family:'Noto Sans JP',sans-serif;font-size:13px;color:#111;margin:20px}@media print{body{margin:0}}</style>
  </head><body>${slips}<script>window.onload=()=>{window.print();}<\/script></body></html>`);
  win.document.close();
}

// BOTH_STORE_IDS が data.js に定義されていない場合のフォールバック
if (typeof BOTH_STORE_IDS === 'undefined') {
  var BOTH_STORE_IDS = [5, 7, 10]; // 半谷・仲田・勘田
}
