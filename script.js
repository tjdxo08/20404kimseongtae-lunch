const suggestions = [];
const menuOptions = [
  "김치볶음밥", "제육볶음", "떡볶이", "돈까스", "오므라이스",
  "짜장면", "짬뽕", "냉면", "카레라이스", "김밥",
  "불고기", "된장찌개", "비빔밥", "스파게티", "치킨"
];
let selectedMenus = [];
let selectedForVote = new Set();  // 메뉴 카드 클릭 시 선택 대기 상태
let menuVotes = {};               // 메뉴별 투표 수

function addSuggestion() {
  const input = document.getElementById("suggestion-input");
  const value = input.value.trim();
  if (value) {
    suggestions.push(value);
    renderSuggestions();
    input.value = "";
  }
}

function renderSuggestions() {
  const list = document.getElementById("suggestion-list");
  list.innerHTML = "";
  suggestions.forEach((text, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${text}
      <button onclick="deleteSuggestion(${index})">삭제</button>
    `;
    list.appendChild(li);
  });
}

function deleteSuggestion(index) {
  suggestions.splice(index, 1);
  renderSuggestions();
}

function getRandomMenus(n) {
  const shuffled = [...menuOptions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

function renderMenuCards() {
  const container = document.getElementById("menu-cards");
  container.innerHTML = "";
  selectedMenus.forEach(menu => {
    const card = document.createElement("div");
    card.className = "menu-card";
    card.textContent = menu;

    if (selectedForVote.has(menu)) {
      card.classList.add("selected");
    } else {
      card.classList.remove("selected");
    }

    card.onclick = () => {
      if (selectedForVote.has(menu)) {
        selectedForVote.delete(menu);
        card.classList.remove("selected");
      } else {
        selectedForVote.add(menu);
        card.classList.add("selected");
      }
    };
    container.appendChild(card);
  });
}

function submitVotes() {
  if (selectedForVote.size === 0) {
    alert("하나 이상의 메뉴를 선택한 후 투표해주세요!");
    return;
  }

  selectedForVote.forEach(menu => {
    if (menuVotes[menu]) {
      menuVotes[menu] += 1;
    } else {
      menuVotes[menu] = 1;
    }
  });

  selectedForVote.clear();

  renderMenuCards();
  renderChart();
}

function renderChart() {
  const ctx = document.getElementById("chart").getContext("2d");
  if (window.myChart) window.myChart.destroy();

  // 투표가 없는 메뉴 제외하고, 투표 수 내림차순 정렬 후 top 5
  const sortedMenus = Object.entries(menuVotes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const labels = sortedMenus.map(e => e[0]);
  const data = sortedMenus.map(e => e[1]);

  window.myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: '투표 수',
        data,
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: false,
      scales: {
        y: { beginAtZero: true, precision: 0 }
      }
    }
  });
}

function simulateMonth() {
  if (!confirm("한 달 시뮬레이션을 진행하면 모든 데이터가 초기화됩니다. 진행할까요?")) return;

  suggestions.length = 0;
  menuVotes = {};
  selectedForVote.clear();
  selectedMenus = getRandomMenus(5);

  renderSuggestions();
  renderMenuCards();
  renderChart();

  alert("데이터가 초기화 되었습니다!");
}

document.addEventListener("DOMContentLoaded", () => {
  selectedMenus = getRandomMenus(5);
  renderMenuCards();
  renderChart();
});