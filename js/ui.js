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

// -------- 通勤手当方式トグル --------
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
