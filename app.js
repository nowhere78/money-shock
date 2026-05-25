/* ===================================
   생활비 충격계산기 - 메인 로직
   =================================== */

// ── 카테고리 설정 ──────────────────────────────────────────────
const CATEGORIES = [
  { id: 'coffee',   icon: '☕', name: '커피/카페',       isMonthly: false },
  { id: 'cig',      icon: '🚬', name: '담배/전자담배',    isMonthly: false },
  { id: 'delivery', icon: '🛵', name: '배달/외식',        isMonthly: false },
  { id: 'sub',      icon: '📺', name: '구독 서비스',       isMonthly: true  },
  { id: 'alcohol',  icon: '🍺', name: '술/음주',          isMonthly: false },
  { id: 'shopping', icon: '🛍️', name: '충동 쇼핑',        isMonthly: true  },
  { id: 'star',     icon: '⭐', name: '스타벅스/디저트',  isMonthly: false },
];

// ── 비교 항목 ──────────────────────────────────────────────────
const COMPARE_ITEMS = [
  { emoji: '📱', name: '아이폰 16 Pro', price: 1550000 },
  { emoji: '✈️', name: '유럽 여행 (왕복)', price: 1800000 },
  { emoji: '🏠', name: '월세 보증금', price: 5000000 },
  { emoji: '🚗', name: '중고차 (경차)', price: 8000000 },
  { emoji: '💎', name: '명품 가방', price: 3500000 },
  { emoji: '🎓', name: '대학 등록금(1학기)', price: 4500000 },
  { emoji: '🏖️', name: '제주도 여행 5박', price: 800000 },
  { emoji: '💰', name: '비상금 저축', price: 1000000 },
];

// ── 쿠팡 파트너스 상품 ─────────────────────────────────────────
const COUPANG_PRODUCTS = [
  {
    icon: '☕', name: '홈카페 캡슐머신',
    desc: '하루 카페 1잔 → 홈카페로 연 120만원 절약',
    badge: '연 120만원 절약',
    url: 'https://link.coupang.com/a/capsule_coffee_machine'
  },
  {
    icon: '🥗', name: '간편 밀키트',
    desc: '배달 대신 밀키트로 50% 비용 절감',
    badge: '배달비 절약',
    url: 'https://link.coupang.com/a/meal_kit'
  },
  {
    icon: '🚭', name: '금연 니코틴 패치',
    desc: '1달 사용 후 담뱃값 월 15만원 절약',
    badge: '월 15만원 절약',
    url: 'https://link.coupang.com/a/nicotine_patch'
  },
  {
    icon: '📦', name: '가성비 무알콜맥주',
    desc: '술값 줄이고 건강도 챙기는 선택',
    badge: '건강 절약',
    url: 'https://link.coupang.com/a/non_alcohol_beer'
  },
  {
    icon: '🍱', name: '도시락 보온도시락',
    desc: '외식/배달 대신 집밥으로 월 30만원 절약',
    badge: '월 30만원 절약',
    url: 'https://link.coupang.com/a/lunch_box'
  },
  {
    icon: '💳', name: '절약형 신용카드',
    desc: '생활비 캐시백 최대 5% 적립',
    badge: '자동 절약',
    url: 'https://link.coupang.com/a/cashback_card'
  },
];

// ── 충격 멘트 생성 ──────────────────────────────────────────────
function getShockMessage(yearlyTotal) {
  if (yearlyTotal < 500000) {
    return { emoji: '🙂', text: '비교적 절제하고 있네요! 그래도 <span>' + fmt(yearlyTotal) + '원</span>이면 여행 한번은 가겠는데요?' };
  } else if (yearlyTotal < 1000000) {
    return { emoji: '😯', text: '연간 <span>' + fmt(yearlyTotal) + '원</span>... 아이폰 살 돈을 커피로 마시고 있어요.' };
  } else if (yearlyTotal < 2000000) {
    return { emoji: '😱', text: '헉! <span>' + fmt(yearlyTotal) + '원</span>이 소비되고 있어요. 유럽여행이 가능한 금액입니다.' };
  } else if (yearlyTotal < 4000000) {
    return { emoji: '😰', text: '연간 <span>' + fmt(yearlyTotal) + '원</span>... 당신은 지금 <span>노후자금</span>을 불태우고 있어요!' };
  } else if (yearlyTotal < 8000000) {
    return { emoji: '🤯', text: '이게 진짜라고요?! <span>' + fmt(yearlyTotal) + '원</span>이면 중고차를 살 수 있어요. 지금 당장 바꾸세요!' };
  } else {
    return { emoji: '💀', text: '당신은 1년에 <span>' + fmt(yearlyTotal) + '원</span>을 낭비 중입니다. <span>10년이면 아파트 전세금</span>이에요. 충격받으셨나요?' };
  }
}

// ── 숫자 포맷 ──────────────────────────────────────────────────
function fmt(n) {
  if (n >= 100000000) return Math.round(n / 10000000) / 10 + '억';
  if (n >= 10000)    return Math.round(n / 10000) / 1 + '만';
  return n.toLocaleString('ko-KR');
}
function fmtFull(n) {
  return Math.round(n).toLocaleString('ko-KR');
}

// ── 카운터 애니메이션 ──────────────────────────────────────────
function animateCounter(el, target, duration = 1200) {
  const start = performance.now();
  const startVal = 0;
  const format = (v) => {
    if (v >= 100000000) return (v / 100000000).toFixed(1) + '억';
    if (v >= 10000)     return Math.round(v / 10000) + '만';
    return Math.round(v).toLocaleString('ko-KR');
  };
  function update(ts) {
    const elapsed = ts - start;
    const progress = Math.min(elapsed / duration, 1);
    // easeOutExpo
    const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const current = startVal + (target - startVal) * ease;
    el.textContent = format(current);
    el.classList.add('counting');
    setTimeout(() => el.classList.remove('counting'), 100);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = format(target);
  }
  requestAnimationFrame(update);
}

// ── 하루 지출 계산 (빈도 포함) ─────────────────────────────────
function getDailyAmount(cat) {
  const input = document.getElementById(cat.id);
  const val = parseFloat(input?.value) || 0;
  if (cat.isMonthly) {
    return val / 30;
  } else {
    const freqEl = document.getElementById(cat.id + '-freq');
    const daysPerWeek = parseFloat(freqEl?.value || 7);
    return val * (daysPerWeek / 7);
  }
}

// ── 메인 계산 함수 ─────────────────────────────────────────────
function calculate() {
  // 버튼 로딩 상태
  const btn = document.getElementById('calcBtn');
  btn.innerHTML = '<span class="btn-icon">⏳</span><span>계산 중...</span>';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '<span class="btn-icon">💥</span><span>충격적인 결과 보기</span><span class="btn-arrow">→</span>';
    btn.disabled = false;

    // 각 카테고리 하루 합산
    let totalDaily = 0;
    const catAmounts = {};

    CATEGORIES.forEach(cat => {
      const daily = getDailyAmount(cat);
      catAmounts[cat.id] = daily;
      totalDaily += daily;
    });

    const totalMonth   = totalDaily * 30;
    const totalYear    = totalDaily * 365;
    const total10Year  = totalYear * 10;

    // 결과 섹션 표시
    const resultSection = document.getElementById('resultSection');
    resultSection.classList.remove('hidden');

    // 부드럽게 스크롤
    setTimeout(() => {
      resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    // 충격 메세지
    const shock = getShockMessage(totalYear);
    document.getElementById('shockEmoji').textContent = shock.emoji;
    document.getElementById('shockText').innerHTML = shock.text;

    // 기간별 카운터 애니메이션
    setTimeout(() => animateCounter(document.getElementById('amt-day'),    totalDaily,    800),  200);
    setTimeout(() => animateCounter(document.getElementById('amt-month'),  totalMonth,   1000),  400);
    setTimeout(() => animateCounter(document.getElementById('amt-year'),   totalYear,    1200),  600);
    setTimeout(() => animateCounter(document.getElementById('amt-10year'), total10Year,  1500),  800);

    // 카테고리 분석 바
    renderBreakdown(catAmounts, totalYear);

    // 비교 항목
    renderCompare(total10Year);

    // 공유 카드
    renderShareCard(catAmounts, totalYear, shock);

    // 쿠팡 섹션
    renderCoupang();

    // fade-in 클래스들
    resultSection.querySelectorAll('.glass-card, .period-card, .share-buttons, .recalc-btn').forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      setTimeout(() => {
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 300 + i * 80);
    });

    // 바 애니메이션
    setTimeout(() => {
      document.querySelectorAll('.breakdown-bar').forEach(bar => {
        const w = bar.getAttribute('data-width');
        bar.style.width = w + '%';
      });
    }, 800);

  }, 600);
}

// ── 카테고리 분석 렌더 ─────────────────────────────────────────
function renderBreakdown(catAmounts, totalYear) {
  const list = document.getElementById('breakdownList');
  list.innerHTML = '';

  const yearAmounts = CATEGORIES.map(cat => ({
    ...cat,
    yearly: catAmounts[cat.id] * 365
  })).filter(c => c.yearly > 0).sort((a,b) => b.yearly - a.yearly);

  const maxVal = yearAmounts[0]?.yearly || 1;

  yearAmounts.forEach(cat => {
    const pct = (cat.yearly / maxVal * 100).toFixed(1);
    const div = document.createElement('div');
    div.className = 'breakdown-item';
    div.innerHTML = `
      <span class="breakdown-icon">${cat.icon}</span>
      <span class="breakdown-name">${cat.name}</span>
      <div class="breakdown-bar-wrap">
        <div class="breakdown-bar" data-width="${pct}" style="width:0"></div>
      </div>
      <span class="breakdown-amt">${fmtFull(cat.yearly)}원</span>
    `;
    list.appendChild(div);
  });
}

// ── 비교 항목 렌더 ─────────────────────────────────────────────
function renderCompare(total10Year) {
  const grid = document.getElementById('compareGrid');
  grid.innerHTML = '';

  COMPARE_ITEMS.forEach(item => {
    const count = total10Year / item.price;
    const canAfford = count >= 1;
    const div = document.createElement('div');
    div.className = 'compare-item' + (canAfford ? ' can-afford' : '');
    const countStr = count >= 10
      ? `<span class="compare-count big">${Math.floor(count)}개</span>`
      : count >= 1
        ? `<span class="compare-count">${count.toFixed(1)}개</span>`
        : `<span class="compare-count" style="color:var(--green)">${(count * 100).toFixed(0)}%</span>`;
    div.innerHTML = `
      <span class="compare-emoji">${item.emoji}</span>
      <div class="compare-name">${item.name}</div>
      <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">${(item.price/10000)}만원</div>
      ${countStr}
    `;
    grid.appendChild(div);
  });
}

// ── 공유 카드 렌더 ────────────────────────────────────────────
function renderShareCard(catAmounts, totalYear, shock) {
  // 날짜
  const now = new Date();
  document.getElementById('shareDate').textContent =
    `${now.getFullYear()}.${String(now.getMonth()+1).padStart(2,'0')}.${String(now.getDate()).padStart(2,'0')}`;

  // 연간 총액
  document.getElementById('shareAmount').textContent = fmtFull(totalYear) + '원';

  // 카테고리 breakdown
  const bd = document.getElementById('shareBreakdown');
  bd.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const yearly = catAmounts[cat.id] * 365;
    if (yearly <= 0) return;
    const item = document.createElement('div');
    item.className = 'share-breakdown-item';
    item.innerHTML = `<span>${cat.icon}</span><span>${cat.name}: ${fmtFull(yearly)}원</span>`;
    bd.appendChild(item);
  });

  // 메세지
  document.getElementById('shareMessage').textContent =
    shock.text.replace(/<[^>]*>/g, '');
}

// ── 쿠팡 섹션 렌더 ───────────────────────────────────────────
function renderCoupang() {
  const grid = document.getElementById('coupangGrid');
  grid.innerHTML = '';
  COUPANG_PRODUCTS.forEach(p => {
    const a = document.createElement('a');
    a.className = 'coupang-item';
    a.href = p.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.innerHTML = `
      <span class="coupang-item-icon">${p.icon}</span>
      <span class="coupang-item-name">${p.name}</span>
      <span class="coupang-item-desc">${p.desc}</span>
      <span class="coupang-item-badge">${p.badge}</span>
    `;
    grid.appendChild(a);
  });
}

// ── 이미지 저장 ──────────────────────────────────────────────
async function saveImage() {
  const card = document.getElementById('shareCard');
  try {
    const canvas = await html2canvas(card, {
      backgroundColor: '#1a0533',
      scale: 2,
      useCORS: true,
      logging: false
    });
    const link = document.createElement('a');
    link.download = '생활비충격계산기_결과.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('📸 이미지가 저장되었어요!');
  } catch (e) {
    showToast('이미지 저장 중 오류가 발생했어요.');
    console.error(e);
  }
}

// ── 카카오톡 공유 ────────────────────────────────────────────
function shareKakao() {
  const yearlyTotal = getYearlyTotal();
  const text = `나의 연간 생활비 충격 결과: ${fmtFull(yearlyTotal)}원!\n10년이면 ${fmtFull(yearlyTotal*10)}원... 나도 계산해봐!`;
  const url = encodeURIComponent(window.location.href);
  const kakaoUrl = `https://sharer.kakao.com/talk/friends/picker/easylink?app_key=YOUR_APP_KEY&text=${encodeURIComponent(text)}&url=${url}`;

  // 카카오 SDK가 없으면 클립보드 복사로 대체
  const fallback = `${text}\n\n🔗 ${window.location.href}`;
  navigator.clipboard.writeText(fallback).then(() => {
    showToast('💬 링크가 복사되었어요! 카카오톡에 붙여넣기 해보세요.');
  }).catch(() => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      '_blank'
    );
  });
}

// ── 도전장 보내기 ────────────────────────────────────────────
function sendChallenge() {
  const yearlyTotal = getYearlyTotal();
  const challengeText =
    `🎯 생활비 도전장!\n\n` +
    `나는 연간 ${fmtFull(yearlyTotal)}원을 쓰고 있어.\n` +
    `너는 얼마야? 계산해봐 👇\n\n` +
    `🔗 ${window.location.href}`;

  navigator.clipboard.writeText(challengeText).then(() => {
    showToast('🎯 도전장이 복사되었어요! 친구에게 붙여넣기 해보세요.');
  }).catch(() => {
    showToast('도전장 텍스트를 복사해주세요.');
  });
}

// ── 헬퍼 ────────────────────────────────────────────────────
function getYearlyTotal() {
  let total = 0;
  CATEGORIES.forEach(cat => total += getDailyAmount(cat) * 365);
  return total;
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function trackClick(category) {
  console.log('[쿠팡 클릭]', category, new Date().toISOString());
  // GA4 이벤트 추가 위치
  // gtag('event', 'coupang_click', { category });
}

// ── 토스트 알림 ──────────────────────────────────────────────
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `
      position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
      background: rgba(139,92,246,0.95); color: white;
      padding: 12px 24px; border-radius: 50px; font-size: 14px; font-weight: 600;
      backdrop-filter: blur(10px); z-index: 9999;
      box-shadow: 0 8px 24px rgba(0,0,0,0.3);
      transition: opacity 0.3s ease;
      font-family: 'Pretendard', sans-serif;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}

// ── 실시간 입력 미리보기 ──────────────────────────────────────
document.querySelectorAll('.expense-input, .freq-select').forEach(el => {
  el.addEventListener('input', () => {
    // 입력 중 하이라이트
    const cat = el.closest('.category-item');
    if (cat) {
      cat.style.borderColor = 'rgba(139,92,246,0.6)';
      setTimeout(() => { cat.style.borderColor = ''; }, 1000);
    }
  });
});

// ── Enter 키로 계산 ──────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) calculate();
});

// ── 페이지 로드 시 초기화 ────────────────────────────────────
window.addEventListener('load', () => {
  // 입력 필드에 포커스 효과
  document.querySelectorAll('.input-wrap').forEach(wrap => {
    const input = wrap.querySelector('input');
    input?.addEventListener('focus', () => {
      wrap.style.borderColor = 'rgba(139,92,246,0.6)';
      wrap.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.15)';
    });
    input?.addEventListener('blur', () => {
      wrap.style.borderColor = '';
      wrap.style.boxShadow = '';
    });
  });

  console.log('💸 생활비 충격계산기 v1.0 — 안티그래비티 제작');
});
