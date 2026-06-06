const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const themeToggle = document.getElementById('theme-toggle');

const STORAGE_KEY = 'weatherChatbotHistory';
const THEME_KEY = 'weatherChatbotTheme';
const OPENWEATHER_KEY_NAME = 'openWeatherApiKey';
const DEFAULT_OPENWEATHER_KEY = 'abcfeea61d04caf2b69a2865402a1035';

function saveOpenWeatherKey(key) {
    if (!key) return localStorage.removeItem(OPENWEATHER_KEY_NAME);
    localStorage.setItem(OPENWEATHER_KEY_NAME, key);
}

function loadOpenWeatherKey() {
    return localStorage.getItem(OPENWEATHER_KEY_NAME) || DEFAULT_OPENWEATHER_KEY;
}

async function fetchWeather(city, key) {
    const encoded = encodeURIComponent(city.trim());
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encoded}&units=metric&lang=pl&appid=${key}`;
    return timeoutFetch(url, { method: 'GET' }, 15000);
}

async function timeoutFetch(resource, options = {}, timeout = 15000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(resource, { signal: controller.signal, ...options });
        clearTimeout(id);
        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || `HTTP ${response.status}`);
        }
        return response.json();
    } catch (error) {
        clearTimeout(id);
        if (error.name === 'AbortError') {
            throw new Error('Żądanie przekroczyło limit czasu. Sprawdź połączenie internetowe.');
        }
        throw error;
    }
}

function requestApiKeyRetry() {
    const defaultKey = loadOpenWeatherKey();
    const newKey = window.prompt('OpenWeather: klucz API jest nieprawidłowy. Wprowadź poprawny klucz API:', defaultKey);
    if (!newKey) return null;
    const trimmed = newKey.trim();
    if (!trimmed) return null;
    saveOpenWeatherKey(trimmed);
    return trimmed;
}

function addMessage(text, sender) {
    const message = document.createElement('div');
    message.classList.add('message', sender);
    message.textContent = text;
    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function addStatus(text) {
    const status = document.createElement('div');
    status.classList.add('message', 'status-message');
    status.textContent = text;
    chatBox.appendChild(status);
    chatBox.scrollTop = chatBox.scrollHeight;
    return status;
}

function parseTemperature(text) {
    const match = text.match(/(-?\d{1,2})(?:\s?°|\s?stopni|\s?st|\s?c|\s?C)?/i);
    if (!match) return null;
    return Number(match[1]);
}

function containsKeyword(text, keywords) {
    return keywords.some(keyword => text.includes(keyword));
}

function extractCityFromText(text) {
    const patterns = [
        /pogoda(?:\s+na)?\s+(?:w|dla)\s+([a-ząćęłńóśżźA-ZĄĆĘŁŃÓŚŻŹ\s\-]+)/i,
        /(?:jak jest|jaka jest|pogoda)\s+(?:w|na|dla)\s+([a-ząćęłńóśżźA-ZĄĆĘŁŃÓŚŻŹ\s\-]+)/i,
        /\b(?:w|dla)\s+([a-ząćęłńóśżźA-ZĄĆĘŁŃÓŚŻŹ\s\-]+)$/i
    ];
    for (const regex of patterns) {
        const match = text.match(regex);
        if (match && match[1]) {
            return match[1].trim();
        }
    }
    return null;
}

function buildRecommendation(temp, conditions, styles) {
    const pieces = [];

    if (temp !== null) {
        if (temp <= 0) {
            pieces.push('Załóż grubą zimową kurtkę, czapkę i rękawice.');
        } else if (temp <= 10) {
            pieces.push('Ubierz ciepłą kurtkę i warstwową odzież.');
        } else if (temp <= 18) {
            pieces.push('Wybierz lekki płaszcz lub sweter.');
        } else if (temp <= 25) {
            pieces.push('Postaw na koszulkę z długim rękawem lub oversize.');
        } else {
            pieces.push('Wybierz lekką koszulkę i przewiewne spodnie.');
        }
    } else {
        pieces.push('Opisz temperaturę lub pogodę dokładniej, bym mógł podpowiedzieć najlepszy strój.');
    }

    if (conditions.rain) {
        pieces.push('Dodaj kurtkę przeciwdeszczową, parasol i wodoodporne buty.');
    }
    if (conditions.snow) {
        pieces.push('Wybierz ciepłe, nieprzemakalne buty oraz czapkę.');
    }
    if (conditions.windy) {
        pieces.push('Weź ze sobą wiatrówkę lub lekki płaszcz.');
    }
    if (conditions.sunny) {
        pieces.push('Okulary przeciwsłoneczne i krem z filtrem będą dobrą ochroną.');
    }
    if (conditions.cool) {
        pieces.push('Warstwowy outfit jest dobrym wyborem na zmienną pogodę.');
    }
    if (styles.elegant) {
        pieces.push('Postaw na elegancki płaszcz i skórzane dodatki.');
    }
    if (styles.sport) {
        pieces.push('Sportowy look z lekką kurtką i sneakersami sprawdzi się świetnie.');
    }
    if (styles.casual) {
        pieces.push('Casualowa stylizacja z jeansami i miękkim swetrem to bezpieczny wybór.');
    }

    return pieces.join(' ');
}

function botResponse(rawText) {
    const lowerText = rawText.toLowerCase();

    const temperature = parseTemperature(lowerText);
    const conditions = {
        rain: containsKeyword(lowerText, ['deszcz', 'pada', 'mokro', 'pogoda deszczowa']),
        snow: containsKeyword(lowerText, ['śnieg', 'śnieży', 'mroźno', 'śnieżnie']),
        windy: containsKeyword(lowerText, ['wiatr', 'wietrznie', 'wietrznie']),
        sunny: containsKeyword(lowerText, ['słonecznie', 'słońce', 'upal', 'gorąco']),
        cool: containsKeyword(lowerText, ['chłodno', 'zimno', 'rześko', 'frost'])
    };

    const styles = {
        elegant: containsKeyword(lowerText, ['elegancko', 'elegancki', 'styl elegancki', 'office']),
        sport: containsKeyword(lowerText, ['sport', 'sportowy', 'trening', 'bieganie']),
        casual: containsKeyword(lowerText, ['casual', 'luźno', 'codziennie', 'na co dzień'])
    };

    if (containsKeyword(lowerText, ['cześć', 'hej', 'witaj', 'dzień dobry'])) {
        return 'Cześć! Napisz, jaka jest temperatura i warunki pogodowe, a doradzę strój.';
    }

    if (containsKeyword(lowerText, ['pogoda w', 'proszę o pogodę', 'pogoda dla', 'sprawdź pogodę', 'openweather', 'czy będzie', 'czy dzisiaj', 'czy będzie dzisiaj'])) {
        if (!extractCityFromText(lowerText) && !temperature) {
            return 'Aby sprawdzić pogodę, wpisz miasto w polu powyżej lub napisz np. "pogoda w Warszawie".';
        }
    }

    const recommendation = buildRecommendation(temperature, conditions, styles);

    if (!containsKeyword(rawText, 'stopni') && temperature === null && !Object.values(conditions).some(Boolean)) {
        return 'Podaj temperaturę lub przynajmniej jedno słowo związane z pogodą, np. „deszcz”, „zimno” lub „słonecznie”.';
    }

    return recommendation;
}

function saveHistory() {
    const history = Array.from(chatBox.children).map(item => ({ text: item.textContent, sender: item.classList.contains('user-message') ? 'user' : item.classList.contains('bot-message') ? 'bot' : 'status' }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function restoreHistory() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    const history = JSON.parse(saved);
    history.forEach(entry => {
        if (entry.sender === 'status') {
            addStatus(entry.text);
        } else {
            addMessage(entry.text, entry.sender === 'user' ? 'user-message' : 'bot-message');
        }
    });
}

function applyTheme(savedTheme) {
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        themeToggle.textContent = 'Light mode';
    } else {
        document.body.classList.remove('dark');
        themeToggle.textContent = 'Dark mode';
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
    applyTheme(savedTheme);
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark');
    const theme = isDark ? 'dark' : 'light';
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
}

function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, 'user-message');
    userInput.value = '';
    saveHistory();

    const status = addStatus('Asystent analizuje dane...');

    setTimeout(() => {
        status.remove();
        const weatherCity = extractCityFromText(text);
        if (weatherCity) {
            handleFetchWeatherFromText(weatherCity, text);
            return;
        }
        const response = botResponse(text);
        addMessage(response, 'bot-message');
        saveHistory();
    }, 700);
}

const cityInput = document.getElementById('city-input');

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
});

if (cityInput) {
    cityInput.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleFetchWeather();
        }
    });
}

themeToggle.addEventListener('click', toggleTheme);

async function handleFetchWeather() {
    const city = cityInput?.value?.trim();
    if (!city) {
        addStatus('Wpisz nazwę miasta, np. Warszawa.');
        return;
    }
    await fetchWeatherByCity(city);
}

async function handleFetchWeatherFromText(city, originalText) {
    const status = addStatus(`Sprawdzam pogodę dla ${city}...`);
    try {
        const data = await fetchWeatherByCity(city);
        status.remove();
        addStatus(`Pobrano: ${Math.round(data.main.temp)}°C, ${data.weather[0].description}`);
        const text = `Jest ${Math.round(data.main.temp)} stopni i ${data.weather[0].description}`;
        const response = botResponse(text);
        addMessage(response, 'bot-message');
        saveHistory();
    } catch (err) {
        status.remove();
        addStatus('Błąd pobierania pogody: ' + err.message);
    }
}

async function fetchWeatherByCity(city) {
    let key = loadOpenWeatherKey();
    try {
        return await fetchWeather(city, key);
    } catch (err) {
        if (err.message.toLowerCase().includes('invalid api key')) {
            const newKey = requestApiKeyRetry();
            if (!newKey) {
                throw new Error('Nie podano poprawnego klucza API. Spróbuj ponownie.');
            }
            key = newKey;
            return await fetchWeather(city, key);
        }
        throw err;
    }
}

window.addEventListener('load', () => {
    loadTheme();
    restoreHistory();
    userInput.focus();
});
