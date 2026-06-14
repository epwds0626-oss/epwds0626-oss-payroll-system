// ============================================================
// paid_leave.js  ―  有給管理簿（労基法39条準拠）
// ============================================================

function renderPaidLeave() {
  const year = currentYear;

  return `
  <div class="section-header">
    <div class="section-title">🌿 有給管理簿 ― ${year}年度</div>
    <div style="display:flex;gap:8px">
      <button class="btn-accent" onclick="grantPaidLeaveAll()">一括付与チェック</button>
      <button class="btn-outline" onclick="exportPaidLeaveCSV(${year})">CSV出力（労基提出用）</button>
    </div>
  </div>

  <div class="alert alert-info">
    <span>📌</span>
    <div><strong>有給管理の法的義務（労基法39条）</strong><br>
    ① 年10日以上付与の労働者には年5日の有給取得が義務（違反は30万円以下の罰金）<br>
    ② 有給管理簿は<strong>3年間保存義務</strong>あり<br>
    ③ 付与日から2年で時効消滅</div>
  </div>

  <div class="card">
    <div class="card-title">有給取得状況（全員）</div>
    <div class="table-wrap"><table>
      <thead><tr>
        <th class="tl">氏名</th><th>雇用区分</th><th>入社日</th>
        <th>付与累計</th><th>取得済</th><th>残日数</th>
        <th>${year}年度<br>取得日数</th><th>5日義務</th><th>操作</th>
      </tr></thead>
      <tbody>
      ${activeEmployees().map(emp => {
        const pl   = getPaidLeaveBalance(emp.id);
        const used5 = ((paidLeave[emp.id]?.used)||[])
          .filter(u => {
            const uy = parseInt(u.date.slice(0,4));
            // 年度（4月〜3月）で判定
            const uyear = u.date.slice(5,7) >= '04' ? uy : uy - 1;
            return uyear === year;
          })
          .reduce((s,u)=>s+u.days, 0);
        const totalGrant = pl.grants.reduce((s,g)=>s+g.days,0);
        const need5 = totalGrant >= 10;
        const ok5   = used5 >= 5;
        const badge = !need5 ? '' : ok5
          ? '<span class="badge badge-green">✓ 達成</span>'
          : `<span class="badge badge-red">未達（あと${5-used5}日）</span>`;
        return `<tr class="${need5&&!ok5?'warning-row':''}">
          <td class="tl">${emp.name}</td>
          <td>${emp.type}</td>
          <td>${emp.hireDate||'—'}</td>
          <td>${totalGrant}日</td>
          <td>${pl.used.reduce((s,u)=>s+u.days,0)}日</td>
          <td><strong>${pl.balance}日</strong></td>
          <td>${used5}日</td>
          <td>${badge}</td>
          <td>
            <button class="btn-primary btn-sm" onclick="openPLDetail(${emp.id})">詳細/記録</button>
            <button class="btn-success btn-sm" onclick="openGrantModal(${emp.id})">付与</button>
          </td>
        </tr>`;
      }).join('')}
      </tbody>
    </table></div>
  </div>

  <div class="card">
    <div class="card-title">有給付与スケジュール（入社日ベース自動計算）</div>
    <div class="table-wrap"><table>
      <thead><tr>
        <th class="tl">氏名</th><th>入社日</th><th>継続勤務</th>
        <th>付与回</th><th>付与日</th><th>付与日数</th><th>状態</th>
      </tr></thead>
      <tbody>
      ${activeEmployees().filter(e=>e.hireDate).flatMap(emp => {
        const grants = calcPaidLeaveGrant(emp.hireDate);
        const monthLabels = ['6ヶ月','1年6ヶ月','2年6ヶ月','3年6ヶ月','4年6ヶ月','5年6ヶ月','6年6ヶ月以上'];
        return grants.map((g,i)=>{
          const today = new Date();
          const gDate = new Date(g.date);
          const isPast = gDate <= today;
          const existing = (paidLeave[emp.id]?.grants||[]).find(x=>x.date===g.date);
          return `<tr>
            <td class="tl">${i===0?emp.name:''}</td>
            <td>${i===0?emp.hireDate:''}</td>
            <td>${monthLabels[i]||''}</td>
            <td>${i+1}回目</td>
            <td>${g.date}</td>
            <td>${g.days}日</td>
            <td>${isPast
              ? existing
                ? '<span class="badge badge-green">付与済</span>'
                : '<span class="badge badge-red">未付与</span>'
              : '<span class="badge badge-gray">未到来</span>'}</td>
          </tr>`;
        });
      }).join('')}
      </tbody>
    </table></div>
  </div>`;
}

function openPLDetail(empId) {
  const emp = employees.find(e=>e.id===empId);
  if (!emp) return;
  const pl  = getPaidLeaveBalance(empId);

  const usedRows = (pl.used||[]).map((u,i)=>`
    <tr>
      <td>${u.date}</td>
      <td>${u.days}日</td>
      <td>${u.reason||'—'}</td>
      <td><button class="btn-danger btn-sm" onclick="deleteUsed(${empId},${i})">削除</button></td>
    </tr>`).join('');

  openModal(`
  <div class="modal-title">🌿 ${emp.name} の有給記録</div>
  <div style="display:flex;gap:16px;margin-bottom:12px;font-size:13px">
    <div>付与累計：<strong>${pl.grants.reduce((s,g)=>s+g.days,0)}日</strong></div>
    <div>取得済：<strong>${pl.used.reduce((s,u)=>s+u.days,0)}日</strong></div>
    <div>残：<strong style="color:var(--success)">${pl.balance}日</strong></div>
  </div>
  <div style="font-weight:700;margin-bottom:8px;color:var(--primary)">取得記録</div>
  <table><thead><tr><th>日付</th><th>日数</th><th>理由</th><th></th></tr></thead>
  <tbody>${usedRows||'<tr><td colspan="4" style="text-align:center">取得記録なし</td></tr>'}</tbody></table>
  <div style="margin-top:16px;font-weight:700;color:var(--primary)">取得を記録</div>
  <div class="form-row" style="margin-top:8px">
    <div class="form-group"><label>日付</label><input type="date" id="pl_date"></div>
    <div class="form-group"><label>日数</label><input type="number" id="pl_days" min="0.5" max="20" step="0.5" value="1"></div>
  </div>
  <div class="form-group"><label>理由・備考</label><input type="text" id="pl_reason" placeholder="例：私傷病、育児、計画付与 等"></div>
  <div class="modal-footer">
    <button class="btn-outline" onclick="closeModal()">閉じる</button>
    <button class="btn-primary" onclick="addUsed(${empId})">記録追加</button>
  </div>`);
}

function addUsed(empId) {
  const date   = document.getElementById('pl_date').value;
  const days   = parseFloat(document.getElementById('pl_days').value)||0;
  const reason = document.getElementById('pl_reason').value;
  if (!date||!days) { showToast('日付と日数を入力してください','error'); return; }
  if (!paidLeave[empId]) paidLeave[empId] = { grants:[], used:[] };
  paidLeave[empId].used.push({ date, days, reason });
  saveLS('paidLeave', paidLeave);
  showToast('取得記録を追加しました');
  closeModal();
  renderPage('paid_leave');
}

function deleteUsed(empId, idx) {
  if (!confirm('この記録を削除しますか？')) return;
  paidLeave[empId].used.splice(idx, 1);
  saveLS('paidLeave', paidLeave);
  showToast('削除しました');
  closeModal();
  renderPage('paid_leave');
}

function openGrantModal(empId) {
  const emp  = employees.find(e=>e.id===empId);
  const auto = calcPaidLeaveGrant(emp.hireDate||'');
  openModal(`
  <div class="modal-title">🌿 ${emp.name} 有給付与</div>
  ${auto.length?`
  <div style="margin-bottom:12px"><strong>自動計算された付与スケジュール</strong></div>
  ${auto.map(g=>`
    <div style="display:flex;align-items:center;gap:12px;padding:6px 0;border-bottom:1px solid #eee">
      <span>${g.date}</span><span>${g.days}日</span>
      <button class="btn-success btn-sm" onclick="grantAuto(${empId},'${g.date}',${g.days})">この日付で付与</button>
    </div>`).join('')}`:'<p>入社日が未設定です</p>'}
  <div style="margin-top:16px;font-weight:700;color:var(--primary)">手動付与</div>
  <div class="form-row" style="margin-top:8px">
    <div class="form-group"><label>付与日</label><input type="date" id="pg_date"></div>
    <div class="form-group"><label>付与日数</label><input type="number" id="pg_days" min="1" max="40" value="10"></div>
  </div>
  <div class="modal-footer">
    <button class="btn-outline" onclick="closeModal()">閉じる</button>
    <button class="btn-primary" onclick="grantManual(${empId})">手動付与</button>
  </div>`);
}

function grantAuto(empId, date, days) {
  doGrant(empId, date, days);
}
function grantManual(empId) {
  const date = document.getElementById('pg_date').value;
  const days = parseInt(document.getElementById('pg_days').value)||0;
  if (!date||!days) { showToast('日付と日数を入力してください','error'); return; }
  doGrant(empId, date, days);
}
function doGrant(empId, date, days) {
  if (!paidLeave[empId]) paidLeave[empId] = { grants:[], used:[] };
  if (paidLeave[empId].grants.find(g=>g.date===date)) {
    showToast('この付与日は既に登録されています','error'); return;
  }
  paidLeave[empId].grants.push({ date, days });
  saveLS('paidLeave', paidLeave);
  showToast(`${days}日付与しました`);
  closeModal();
  renderPage('paid_leave');
}

function grantPaidLeaveAll() {
  let count = 0;
  for (const emp of activeEmployees()) {
    if (!emp.hireDate) continue;
    const grants = calcPaidLeaveGrant(emp.hireDate);
    for (const g of grants) {
      if (!paidLeave[emp.id]) paidLeave[emp.id] = { grants:[], used:[] };
      if (!paidLeave[emp.id].grants.find(x=>x.date===g.date)) {
        paidLeave[emp.id].grants.push({ date: g.date, days: g.days });
        count++;
      }
    }
  }
  saveLS('paidLeave', paidLeave);
  showToast(`${count}件の付与レコードを追加しました`);
  renderPage('paid_leave');
}

function exportPaidLeaveCSV(year) {
  const header = ['氏名','入社日','付与累計(日)','取得済(日)','残(日)',`${year}年度取得(日)`, '5日義務達成'];
  const rows = activeEmployees().map(emp => {
    const pl    = getPaidLeaveBalance(emp.id);
    const used5 = ((paidLeave[emp.id]?.used)||[])
      .filter(u=>{ const uy=parseInt(u.date.slice(0,4)); const uyear=u.date.slice(5,7)>='04'?uy:uy-1; return uyear===year; })
      .reduce((s,u)=>s+u.days,0);
    const totalGrant = pl.grants.reduce((s,g)=>s+g.days,0);
    return [emp.name, emp.hireDate||'', totalGrant, pl.used.reduce((s,u)=>s+u.days,0), pl.balance, used5, totalGrant>=10?(used5>=5?'達成':'未達'):'—'];
  });
  const csv = [header,...rows].map(r=>r.join(',')).join('\n');
  dlFile(`有給管理簿_${year}年度.csv`, csv, 'text/csv');
}
