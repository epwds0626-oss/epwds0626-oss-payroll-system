// hm: 時間数(小数)を "Xh Ym" 形式に変換
function hm_a36(h) {
  if (!h || isNaN(h)) return '';
  const total = Math.round(Number(h) * 60);
  if (total === 0) return '';
  const hh = Math.floor(total / 60);
  const mm = total % 60;
  return mm ? `${hh}h${mm}m` : `${hh}h`;
}

// ============================================================
// article36.js  ―  ３６協定管理
// ============================================================

function renderArticle36(year, month) {
  const a36 = article36[year] || { limit36: 45, specialLimit: 80, yearLimit: 720 };

  // 全員の年間残業集計
  const summaries = activeEmployees().map(emp => {
    const monthlyOTs = [];
    let yearlyOT = 0;
    for (let m = 1; m <= 12; m++) {
      const _eid36 = emp.store === '両店' ? `${emp.id}_enya` : emp.id; const s = getMonthSummary(_eid36, year, m);
      monthlyOTs.push(s.monthOT);
      yearlyOT += s.monthOT;
    }
    const maxMonth = Math.max(...monthlyOTs);
    const alerts = [];
    if (monthlyOTs[month-1] > a36.specialLimit) alerts.push({ level:'danger', msg:`当月${hm_a36(monthlyOTs[month-1])} 特別条項超過` });
    else if (monthlyOTs[month-1] > a36.limit36) alerts.push({ level:'warn', msg:`当月${hm_a36(monthlyOTs[month-1])} 一般条項超（特別条項適用）` });
    if (yearlyOT > a36.yearLimit) alerts.push({ level:'danger', msg:`年間${hm_a36(yearlyOT)} 年間上限超過` });
    return { emp, monthlyOTs, yearlyOT: Math.round(yearlyOT*60)/60, maxMonth: Math.round(maxMonth*60)/60, alerts };
  });

  const MONTHS = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];

  return `
  <div class="section-header">
    <div class="section-title">⚖️ ３６協定管理 ― ${year}年</div>
    <div style="display:flex;gap:8px">
      <button class="btn-primary" onclick="open36Settings(${year})">⚙ 協定上限設定</button>
      <button class="btn-outline" onclick="export36CSV(${year})">CSV出力</button>
    </div>
  </div>

  <div class="card">
    <div class="card-title">現在の３６協定設定（${year}年）</div>
    <div style="display:flex;gap:24px;flex-wrap:wrap">
      <div><span style="color:var(--text-muted)">一般条項（月）：</span><strong>${a36.limit36}h</strong></div>
      <div><span style="color:var(--text-muted)">特別条項（月）：</span><strong>${a36.specialLimit}h</strong></div>
      <div><span style="color:var(--text-muted)">年間上限：</span><strong>${a36.yearLimit}h</strong></div>
    </div>
    <div class="alert alert-info" style="margin-top:12px;margin-bottom:0">
      <span>📋</span>
      <div>
        <strong>法定ルール（2019年改正）</strong><br>
        ・通常：月45h、年360h<br>
        ・特別条項（繁忙期等）：月100h未満、年720h以内、複数月平均80h以内、特別条項適用は年6回まで<br>
        ・違反：6ヶ月以下の懲役または30万円以下の罰金
      </div>
    </div>
  </div>

  ${summaries.some(s=>s.alerts.length) ? `
  <div class="alert alert-danger">
    <span>🚨</span>
    <div><strong>アラート（要対応）</strong><br>
    ${summaries.filter(s=>s.alerts.length).map(s=>`<strong>${s.emp.name}</strong>：${s.alerts.map(a=>a.msg).join(' ／ ')}`).join('<br>')}
    </div>
  </div>` : `
  <div class="alert alert-success">
    <span>✅</span>
    <div>全従業員が３６協定の範囲内です（${year}年 現時点）</div>
  </div>`}

  <div class="card">
    <div class="card-title">年間残業時間一覧（${year}年）</div>
    <div class="table-wrap" style="overflow-x:auto"><table>
      <thead><tr>
        <th class="tl">氏名</th>
        ${MONTHS.map((m,i)=>`<th style="min-width:48px;${i===month-1?'background:#e8a020':''}">${m}</th>`).join('')}
        <th>年計</th><th>最大月</th><th>状態</th>
      </tr></thead>
      <tbody>
      ${summaries.map(({ emp, monthlyOTs, yearlyOT, maxMonth, alerts }) => {
        const cls = alerts.some(a=>a.level==='danger') ? 'danger-row'
                  : alerts.some(a=>a.level==='warn') ? 'warning-row' : '';
        return `<tr class="${cls}">
          <td class="tl">${emp.name}</td>
          ${monthlyOTs.map((ot,i)=>{
            const cellCls = ot > a36.specialLimit ? 'style="color:var(--danger);font-weight:700"'
                          : ot > a36.limit36       ? 'style="color:var(--warning);font-weight:700"'
                          : '';
            const bg = i===month-1 ? 'style="background:#fffde7"' : '';
            return `<td ${bg}><span ${cellCls}>${ot>0?hm_a36(ot):''}</span></td>`;
          }).join('')}
          <td>${hm_a36(yearlyOT)}</td>
          <td ${maxMonth>a36.specialLimit?'style="color:var(--danger);font-weight:700"':maxMonth>a36.limit36?'style="color:var(--warning)"':''}>${hm_a36(maxMonth)}</td>
          <td>${alerts.some(a=>a.level==='danger')
            ? '<span class="badge badge-red">超過</span>'
            : alerts.some(a=>a.level==='warn')
            ? '<span class="badge badge-yellow">注意</span>'
            : '<span class="badge badge-green">正常</span>'}</td>
        </tr>`;
      }).join('')}
      </tbody>
    </table></div>
  </div>

  <div class="card">
    <div class="card-title">特別条項適用チェック（${year}年）</div>
    <div class="alert alert-warn"><span>⚠️</span>
    <div>特別条項は年6回までしか適用できません。月残業が一般条項（${a36.limit36}h）を超えた月数を集計します。</div></div>
    <div class="table-wrap"><table>
      <thead><tr><th class="tl">氏名</th><th>特別条項適用月数</th><th>残り適用可能回数</th><th>状態</th></tr></thead>
      <tbody>
      ${summaries.map(({ emp, monthlyOTs }) => {
        const specialMonths = monthlyOTs.filter(ot=>ot>a36.limit36).length;
        const remaining     = Math.max(0, 6 - specialMonths);
        const cls = specialMonths > 6 ? 'danger-row' : specialMonths >= 5 ? 'warning-row' : '';
        return `<tr class="${cls}">
          <td class="tl">${emp.name}</td>
          <td>${specialMonths}回</td>
          <td>${remaining}回</td>
          <td>${specialMonths>6?'<span class="badge badge-red">超過</span>':specialMonths>=5?'<span class="badge badge-yellow">残り僅か</span>':'<span class="badge badge-green">正常</span>'}</td>
        </tr>`;
      }).join('')}
      </tbody>
    </table></div>
  </div>`;
}

function open36Settings(year) {
  const a36 = article36[year] || { limit36: 45, specialLimit: 80, yearLimit: 720 };
  openModal(`
  <div class="modal-title">⚙ ３６協定上限設定（${year}年）</div>
  <div class="alert alert-warn"><span>⚠️</span>
  <div>労基法の上限を超える設定はできません。特別条項でも月100h未満・年720h以内が法的上限です。</div></div>
  <div class="form-group"><label>一般条項 月上限（h）※法定上限 45h</label>
    <input type="number" id="a36_limit" value="${a36.limit36}" min="1" max="45"></div>
  <div class="form-group"><label>特別条項 月上限（h）※法定上限 100h未満</label>
    <input type="number" id="a36_special" value="${a36.specialLimit}" min="1" max="99"></div>
  <div class="form-group"><label>年間上限（h）※法定上限 720h</label>
    <input type="number" id="a36_year" value="${a36.yearLimit}" min="1" max="720"></div>
  <div class="modal-footer">
    <button class="btn-outline" onclick="closeModal()">キャンセル</button>
    <button class="btn-primary" onclick="save36Settings(${year})">保存</button>
  </div>`);
}

function save36Settings(year) {
  const limit36      = parseInt(document.getElementById('a36_limit').value)||45;
  const specialLimit = parseInt(document.getElementById('a36_special').value)||80;
  const yearLimit    = parseInt(document.getElementById('a36_year').value)||720;
  if (limit36>45||specialLimit>=100||yearLimit>720) {
    showToast('法定上限を超えています','error'); return;
  }
  db.ref(`payroll/article36/${year}`).set({ limit36, specialLimit, yearLimit }, err => {
    if (err) { showToast('保存エラー','error'); return; }
    closeModal();
    showToast('設定を保存しました');
  });
}

function export36CSV(year) {
  const MONTHS = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
  const header = ['氏名', ...MONTHS, '年計(h)', '最大月(h)', '特別条項適用回数'];
  const rows = activeEmployees().map(emp => {
    const monthlyOTs = [];
    let yearlyOT = 0;
    for (let m=1;m<=12;m++) {
      const _eid36 = emp.store === '両店' ? `${emp.id}_enya` : emp.id; const s = getMonthSummary(_eid36, year, m);
      monthlyOTs.push(s.monthOT);
      yearlyOT += s.monthOT;
    }
    const a36 = article36[year]||{limit36:45};
    const specialMonths = monthlyOTs.filter(ot=>ot>a36.limit36).length;
    return [emp.name, ...monthlyOTs, Math.round(yearlyOT*60)/60, Math.max(...monthlyOTs), specialMonths];
  });
  const csv = [header,...rows].map(r=>r.join(',')).join('\n');
  dlFile(`36協定管理_${year}年.csv`, csv, 'text/csv');
}
