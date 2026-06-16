// ============================================================
// ui.js  ―  最終的な attachPageEvents の統合（上書き）
// ============================================================

// 各モジュールが個別に attachPageEvents を定義しているため
// 最後に読み込まれるこのファイルで一元管理する

function attachPageEvents(page) {
  const y = parseInt(document.getElementById('targetYear').value);
  const m = parseInt(document.getElementById('targetMonth').value);

  switch (page) {
    case 'attendance':
      setTimeout(() => renderAttendanceTable(y, m), 0);
      break;
    case 'weekly':
      setTimeout(() => {
        const s = document.getElementById('weekEmpSel');
        if (s) renderWeekDetail(y, m);
      }, 0);
      break;
    case 'payslip':
      setTimeout(() => renderPayslipDetail(y, m), 0);
      break;
    case 'paid_leave':
      // nothing extra; the page renders fully from renderPaidLeave()
      break;
  }
}

// -------- 従業員並び替え --------
let _dragId = null;

function moveEmp(id, dir) {
  // 現在表示中リスト（在籍中 or 退職）
  const isActive = (window._empTab || 'active') === 'active';
  const list = isActive
    ? employees.filter(e => e.status !== 'inactive' && e.status !== 'leave')
    : employees.filter(e => e.status === 'inactive' || e.status === 'leave');

  const idx = list.findIndex(e => e.id === id);
  const swapIdx = idx + dir;
  if (swapIdx < 0 || swapIdx >= list.length) return;

  // employees 配列内での実際のインデックスを取得して入れ替え
  const ai = employees.findIndex(e => e.id === list[idx].id);
  const bi = employees.findIndex(e => e.id === list[swapIdx].id);
  [employees[ai], employees[bi]] = [employees[bi], employees[ai]];

  // Firebaseに保存
  const empObj = {};
  employees.forEach(e => { empObj[e.id] = e; });
  FB.employees().set(empObj);
}

// ドラッグ＆ドロップ
function empDragStart(e, id) {
  _dragId = id;
  e.currentTarget.style.opacity = '0.4';
}
function empDragOver(e) {
  e.preventDefault();
  e.currentTarget.style.background = '#e8f0ff';
}
function empDragEnd(e) {
  e.currentTarget.style.opacity = '';
  document.querySelectorAll('#empTbody tr').forEach(r => r.style.background = '');
}
function empDrop(e, targetId) {
  e.preventDefault();
  e.currentTarget.style.background = '';
  if (_dragId === targetId) return;

  const fromIdx = employees.findIndex(emp => emp.id === _dragId);
  const toIdx   = employees.findIndex(emp => emp.id === targetId);
  if (fromIdx < 0 || toIdx < 0) return;

  const moved = employees.splice(fromIdx, 1)[0];
  employees.splice(toIdx, 0, moved);

  const empObj = {};
  employees.forEach(emp => { empObj[emp.id] = emp; });
  FB.employees().set(empObj);
  _dragId = null;
}
function toggleCommuteType() {
  const type = document.querySelector('input[name="commuteType"]:checked')?.value;
  const fixedGroup = document.getElementById('ef_commuteFixedGroup');
  const dailyGroup = document.getElementById('ef_commuteDailyGroup');
  if (!fixedGroup || !dailyGroup) return;
  if (type === 'daily') {
    fixedGroup.style.display = 'none';
    dailyGroup.style.display = 'block';
  } else {
    fixedGroup.style.display = 'block';
    dailyGroup.style.display = 'none';
  }
}

// フォームを開いた直後に初期表示を合わせる
function initCommuteTypeDisplay() {
  const type = document.querySelector('input[name="commuteType"]:checked')?.value;
  if (type === 'daily') {
    const fixedGroup = document.getElementById('ef_commuteFixedGroup');
    const dailyGroup = document.getElementById('ef_commuteDailyGroup');
    if (fixedGroup) fixedGroup.style.display = 'none';
    if (dailyGroup) dailyGroup.style.display = 'block';
  }
}
function togglePayFields() {
  const type = document.getElementById('ef_payType')?.value;
  const baseG  = document.getElementById('ef_baseSalaryGroup');
  const hourG  = document.getElementById('ef_hourlyGroup');
  if (!baseG || !hourG) return;
  if (type === '月給') {
    baseG.style.opacity = '1';
    hourG.style.opacity = '0.4';
  } else {
    baseG.style.opacity = '0.4';
    hourG.style.opacity = '1';
  }
}

// モーダル閉じる（外側クリック）
document.getElementById('modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});
