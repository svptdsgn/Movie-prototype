// ===== ДАННЫЕ =====
const movies = [
    { id: 1259195, title: "Война искусств", year: 2019,
      genres: ["документальный", "искусство"], rating: 7.4, runtime: 102,
      logline: "Художники приезжают в Северную Корею ради культурного обмена и сталкиваются с несовпадающими представлениями об искусстве и свободе.",
      poster: "posters/iskustv.jpg" },
    { id: 5237750, title: "Не хороните меня без Ивана", year: 2022,
      genres: ["драма", "комедия", "исторический"], rating: 8.0, runtime: 124,
      logline: "Якутский крестьянин, страдающий приступами летаргического сна, следует за художником в экспедицию.",
      poster: "posters/ivan.jpg" },
    { id: 225011, title: "Изгнание", year: 2007,
      genres: ["драма"], rating: 7.3, runtime: 150,
      logline: "Поездка семьи в загородный дом превращается в испытание близости.",
      poster: "posters/izgnanie.jpg" },
    { id: 1347315, title: "Книготорговцы", year: 2019,
      genres: ["документальный", "культура"], rating: 7.6, runtime: 99,
      logline: "Нью-йоркские букинисты рассказывают, почему редкая книга остаётся чем-то большим, чем товар.",
      poster: "posters/knogo.jpg" },
    { id: 425, title: "Седьмая печать", year: 1957,
      genres: ["драма", "фэнтези"], rating: 8.0, runtime: 96,
      logline: "Вернувшийся из крестового похода рыцарь предлагает Смерти шахматную партию.",
      poster: "posters/pechat.jpg" },
    { id: 714248, title: "Песнь моря", year: 2014,
      genres: ["анимация", "фэнтези", "семейный"], rating: 8.0, runtime: 93,
      logline: "Брат и сестра отправляются через мир ирландских преданий, чтобы найти дорогу домой.",
      poster: "posters/pesn.jpg" },
    { id: 425400, title: "Пожары", year: 2010,
      genres: ["драма", "детектив", "военный"], rating: 8.1, runtime: 131,
      logline: "Завещание матери отправляет канадских близнецов на Ближний Восток.",
      poster: "posters/pozhari.jpg" },
    { id: 1040690, title: "Середина 90-х", year: 2018,
      genres: ["драма", "комедия"], rating: 7.4, runtime: 85,
      logline: "Подросток из Лос-Анджелеса находит компанию скейтбордистов.",
      poster: "posters/seredina.jpg" },
    { id: 677566, title: "Великая красота", year: 2013,
      genres: ["драма", "комедия"], rating: 7.8, runtime: 141,
      logline: "Римский писатель ищет смысл за чередой вечеринок.",
      poster: "posters/velikaya.jpg" },
    { id: 6553389, title: "Новая волна", year: 2025,
      genres: ["драма", "комедия", "биографический"], rating: 7.6, runtime: 105,
      logline: "Молодой Жан-Люк Годар снимает свой первый полнометражный фильм.",
      poster: "posters/volna.jpg" }
];

const PLACEHOLDER = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">' +
    '<rect width="100%" height="100%" fill="#1A1A1A"/>' +
    '<text x="50%" y="50%" fill="#666666" font-family="Arial, sans-serif" font-size="14" text-anchor="middle">Нет постера</text>' +
    '</svg>'
);

// ===== СОСТОЯНИЕ =====
let currentDuration = 'all';
let currentGenre = 'all';

// ===== КАРТОЧКА =====
function createCard(movie) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="card-poster">
            <img src="${movie.poster}" alt="${movie.title}" onerror="this.src='${PLACEHOLDER}'">
            <div class="card-rating">${movie.rating}</div>
        </div>
        <div class="card-info">
            <div class="card-title">${movie.title}</div>
            <div class="card-meta">${movie.year} · ${movie.genres.slice(0,2).join(', ')} · ${movie.runtime} мин</div>
            <div class="card-logline">${movie.logline}</div>
        </div>`;
    card.addEventListener('click', () => {
        window.location.href = `movie.html?id=${movie.id}`;
    });
    return card;
}

// ===== ТОП-3 =====
function renderTop() {
    const row = document.getElementById('top-row');
    if (!row) { console.warn('top-row не найден'); return; }
    const top = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 3);
    top.forEach((movie, i) => {
        const card = document.createElement('div');
        card.className = 'top-card';
        card.innerHTML = `
            <div class="top-rank">${i + 1}</div>
            <img src="${movie.poster}" alt="${movie.title}" onerror="this.src='${PLACEHOLDER}'">
            <div class="top-info">
                <div class="top-title">${movie.title}</div>
                <div class="top-meta">${movie.year} · Рейтинг ${movie.rating}</div>
            </div>`;
        card.addEventListener('click', () => {
            window.location.href = `movie.html?id=${movie.id}`;
        });
        row.appendChild(card);
    });
}

// ===== СКЛОНЕНИЕ =====
function declOfNum(n, titles) {
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[(n % 100 > 4 && n % 100 < 20) ? 2 : cases[(n % 10 < 5) ? n % 10 : 5]];
}

// ===== КАТАЛОГ =====
function renderCatalog(searchQuery = '') {
    const catalog = document.getElementById('catalog');
    const status = document.getElementById('catalog-status');
    const resetBtn = document.getElementById('reset-btn');
    if (!catalog) { console.warn('catalog не найден'); return; }

    catalog.innerHTML = '';
    const q = (searchQuery || '').toLowerCase().trim();

    const filtered = movies.filter(m => {
        if (currentDuration === 'short' && m.runtime >= 90) return false;
        if (currentDuration === 'medium' && (m.runtime < 90 || m.runtime > 120)) return false;
        if (currentDuration === 'long' && m.runtime <= 120) return false;
        if (currentGenre !== 'all' && !m.genres.includes(currentGenre)) return false;
        if (q && !m.title.toLowerCase().includes(q) &&
                 !m.genres.join(' ').toLowerCase().includes(q)) return false;
        return true;
    });

    if (resetBtn) {
        resetBtn.style.display = (currentDuration !== 'all' || currentGenre !== 'all' || q)
            ? 'inline-block' : 'none';
    }

    if (status) {
        status.textContent = `${filtered.length} ${declOfNum(filtered.length, ['фильм', 'фильма', 'фильмов'])} в каталоге`;
    }

    if (!filtered.length) {
        catalog.innerHTML = '<div class="empty">Ничего не нашлось. Попробуйте другой фильтр.</div>';
        return;
    }

    filtered.forEach(m => catalog.appendChild(createCard(m)));
}

// ===== ЧИПСЫ =====
function initTimeChips() {
    const chips = document.querySelectorAll('#time-chips .chip');
    if (!chips.length) console.warn('time-chips не найдены');
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const dur = chip.dataset.duration;
            if (currentDuration === dur) {
                currentDuration = 'all';
                chip.classList.remove('active');
            } else {
                chips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                currentDuration = dur;
            }
            const search = document.getElementById('search-input');
            renderCatalog(search ? search.value : '');
        });
    });
}

function initGenreChips() {
    const chips = document.querySelectorAll('#genre-chips .chip');
    if (!chips.length) console.warn('genre-chips не найдены');
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const genre = chip.dataset.genre;
            if (currentGenre === genre) {
                currentGenre = 'all';
                chip.classList.remove('active');
            } else {
                chips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                currentGenre = genre;
            }
            const search = document.getElementById('search-input');
            renderCatalog(search ? search.value : '');
        });
    });
}

// ===== ПОИСК =====
function initSearch() {
    const input = document.getElementById('search-input');
    if (!input) return;
    input.addEventListener('input', (e) => renderCatalog(e.target.value));
}

// ===== СБРОС =====
function initReset() {
    const btn = document.getElementById('reset-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
        currentDuration = 'all';
        currentGenre = 'all';
        document.querySelectorAll('#time-chips .chip, #genre-chips .chip')
            .forEach(c => c.classList.remove('active'));
        const input = document.getElementById('search-input');
        if (input) input.value = '';
        renderCatalog();
    });
}

// ===== МОДАЛКА =====
function openAI() {
    const m = document.getElementById('ai-modal');
    if (m) m.classList.add('open');
}
function closeAI() {
    const m = document.getElementById('ai-modal');
    if (m) m.classList.remove('open');
}

window.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('ai-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'ai-modal') closeAI();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAI();
    });
    document.querySelectorAll('.modal .chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const parent = chip.parentElement;
            parent.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
        });
    });
});

function submitAI() {
    const pick = movies[Math.floor(Math.random() * movies.length)];
    closeAI();
    alert(`Подобран фильм: «${pick.title}» (${pick.year})\n\n${pick.logline}`);
    setTimeout(() => {
        window.location.href = `movie.html?id=${pick.id}`;
    }, 300);
}

// ===== ЗАПУСК =====
function init() {
    try { renderTop(); } catch (e) { console.error('renderTop:', e); }
    try { renderCatalog(); } catch (e) { console.error('renderCatalog:', e); }
    try { initTimeChips(); } catch (e) { console.error('initTimeChips:', e); }
    try { initGenreChips(); } catch (e) { console.error('initGenreChips:', e); }
    try { initSearch(); } catch (e) { console.error('initSearch:', e); }
    try { initReset(); } catch (e) { console.error('initReset:', e); }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}


// ===== СОРТИРОВКА =====
var currentSort = 'popular';

function sortMovies(list) {
    var sorted = list.slice();
    if (currentSort === 'popular') {
        // условная «популярность» — по количеству попаданий в подборки,
        // затем по рейтингу
        sorted.sort(function (a, b) {
            var aPop = (a.collections || []).length;
            var bPop = (b.collections || []).length;
            if (bPop !== aPop) return bPop - aPop;
            return b.rating - a.rating;
        });
    } else if (currentSort === 'fresh') {
        sorted.sort(function (a, b) { return b.year - a.year; });
    } else if (currentSort === 'rating') {
        sorted.sort(function (a, b) { return b.rating - a.rating; });
    }
    return sorted;
}

function initSort() {
    var btn = document.getElementById('sort-btn');
    var menu = document.getElementById('sort-menu');
    var label = document.getElementById('sort-label');
    if (!btn || !menu) return;

    btn.addEventListener('click', function (e) {
        e.stopPropagation();
        menu.classList.toggle('open');
    });

    document.addEventListener('click', function () {
        menu.classList.remove('open');
    });

    menu.querySelectorAll('.sort-option').forEach(function (opt) {
        opt.addEventListener('click', function (e) {
            e.stopPropagation();
            var value = opt.dataset.sort;
            currentSort = value;

            // активный пункт
            menu.querySelectorAll('.sort-option').forEach(function (o) {
                o.classList.remove('active');
            });
            opt.classList.add('active');

            // текст на кнопке
            if (label) label.textContent = opt.textContent.trim();

            // кнопка становится активной (жёлтой)
            btn.classList.add('active');

            // перерисовка каталога
            renderCatalog();
            menu.classList.remove('open');
        });
    });
}