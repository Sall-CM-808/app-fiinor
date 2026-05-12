/* ============================================================
   FIINOR DASHBOARD – app.js
   ============================================================ */

// ── Sidebar toggle ──────────────────────────────────────────
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('open');
}

// ── Animated counters ──────────────────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4); // Quartic ease out
    el.textContent = Math.floor(ease * target).toLocaleString('fr-FR') + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

document.querySelectorAll('.kpi-value[data-target]').forEach((el, i) => {
  setTimeout(() => animateCounter(el), i * 150 + 400);
});

// ── Chart defaults ─────────────────────────────────────────
const getStyle = (prop) => getComputedStyle(document.documentElement).getPropertyValue(prop).trim();

Chart.defaults.color = '#94a3b8';
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.font.size = 12;
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(15, 23, 42, 0.9)';
Chart.defaults.plugins.tooltip.padding = 12;
Chart.defaults.plugins.tooltip.cornerRadius = 8;
Chart.defaults.plugins.tooltip.titleFont = { family: 'Outfit', size: 14, weight: '700' };

// ── Inscriptions line chart ────────────────────────────────
const inscCtx = document.getElementById('inscriptionsChart').getContext('2d');
const inscGrad = inscCtx.createLinearGradient(0, 0, 0, 200);
inscGrad.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
inscGrad.addColorStop(1, 'rgba(99, 102, 241, 0.01)');

new Chart(inscCtx, {
  type: 'line',
  data: {
    labels: ['2021','2022','2023','2024','2025'],
    datasets: [{
      label: 'Élèves',
      data: [4200, 5100, 6300, 7400, 8420],
      borderColor: '#6366f1',
      backgroundColor: inscGrad,
      borderWidth: 3,
      pointBackgroundColor: '#6366f1',
      pointBorderColor: 'rgba(255,255,255,0.1)',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 8,
      pointHoverBorderWidth: 3,
      fill: true,
      tension: 0.4,
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, border: { display: false } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, border: { display: false },
           ticks: { callback: v => v >= 1000 ? (v/1000).toFixed(1) + 'k' : v } }
    },
    interaction: { intersect: false, mode: 'index' }
  }
});

// ── Budget bar chart ────────────────────────────────────────
const budCtx = document.getElementById('budgetChart').getContext('2d');
new Chart(budCtx, {
  type: 'bar',
  data: {
    labels: ['Jan','Fév','Mar','Avr','Mai','Juin'],
    datasets: [
      { label: 'Salaires', data: [18000, 19500, 18200, 20100, 19800, 21000], backgroundColor: '#10b981', borderRadius: 6 },
      { label: 'Infrastructure', data: [7000, 8200, 6500, 9000, 7800, 8500], backgroundColor: '#6366f1', borderRadius: 6 },
      { label: 'Matériel', data: [4000, 3500, 5200, 4100, 4800, 5500], backgroundColor: '#f59e0b', borderRadius: 6 },
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { stacked: true, grid: { display: false }, border: { display: false } },
      y: { stacked: true, grid: { color: 'rgba(255,255,255,0.05)' }, border: { display: false },
           ticks: { callback: v => (v/1000).toFixed(0) + 'k' } }
    }
  }
});

// ── Donut chart ─────────────────────────────────────────────
const doCtx = document.getElementById('donutChart').getContext('2d');
new Chart(doCtx, {
  type: 'doughnut',
  data: {
    labels: ['Supérieur', 'Secondaire', 'Primaire'],
    datasets: [{
      data: [33, 42, 25],
      backgroundColor: ['#10b981', '#6366f1', '#f59e0b'],
      borderColor: '#0f172a',
      borderWidth: 4,
      hoverOffset: 12,
      borderRadius: 4
    }]
  },
  options: {
    responsive: false,
    cutout: '75%',
    plugins: {
      legend: { display: false },
      tooltip: { 
        callbacks: { 
          label: ctx => ` ${ctx.label}: ${ctx.parsed}%` 
        } 
      }
    },
    animation: { animateScale: true, animateRotate: true, duration: 1500, easing: 'easeOutQuart' }
  }
});

// ── Nav active state ────────────────────────────────────────
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', e => {
    if (item.getAttribute('href') === '#') e.preventDefault();
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    item.classList.add('active');
  });
});

// ── Map school-dot tooltips via SVG hover ──────────────────
document.querySelectorAll('.school-dot').forEach((dot, idx) => {
  const tooltips = document.querySelectorAll('.map-tooltip');
  dot.addEventListener('mouseenter', (e) => {
    if (tooltips[idx]) {
      tooltips[idx].style.opacity = '1';
      tooltips[idx].style.transform = 'translateY(0) scale(1)';
    }
  });
  dot.addEventListener('mouseleave', () => {
    if (tooltips[idx]) {
      tooltips[idx].style.opacity = '0';
      tooltips[idx].style.transform = 'translateY(10px) scale(0.95)';
    }
  });
});

// Initial tooltip state
document.querySelectorAll('.map-tooltip').forEach(t => {
  t.style.opacity = '0';
  t.style.transform = 'translateY(10px) scale(0.95)';
  t.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  t.style.pointerEvents = 'none';
});
