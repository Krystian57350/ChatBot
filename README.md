# Weather AI Assistant

Prosta strona internetowa z inteligentnym chatbotem pogodowym zbudowana w HTML, CSS i JavaScript.

## Co robi projekt

- obsługuje rozmowę przez interfejs czatu
- analizuje tekst wpisany przez użytkownika
- rekomenduje ubiór, dodatki i ochronę przed deszczem lub zimnem
- posiada responsywny i nowoczesny interfejs
- zapisuje historię rozmowy w `localStorage`
- wspiera tryb ciemny

## Struktura plików

- `index.html` - strona główna
- `style.css` - wygląd i animacje
- `script.js` - logika czatu i analiza wiadomości
- `README.md` - dokumentacja projektu

## Jak uruchomić

1. Otwórz `index.html` w przeglądarce.
2. Wpisz dane pogodowe, np. `Jest 7 stopni i pada deszcz`.
3. Naciśnij `Wyślij` lub `Enter`.

## Użyte technologie

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Responsive Web Design

## Ulepszenia

- automatyczne przewijanie czatu
- przycisk trybu ciemnego
- animacje pojawiania wiadomości
- analiza temperatury i warunków pogodowych
- lokalne przechowywanie historii rozmów

## Integracja z OpenWeather (opcjonalnie)

1. Zarejestruj się na https://openweathermap.org/ i zdobądź klucz API.
2. Wpisz klucz w polu `OpenWeather API Key` i kliknij `Zapisz klucz`.
3. Wpisz nazwę miasta i kliknij `Pobierz pogodę` lub naciśnij `Enter` w polu miasta — bot pobierze aktualną pogodę i poda rekomendację ubioru.

Uwaga: jeśli nie wpiszesz klucza, aplikacja użyje wbudowanego domyślnego klucza API. Jeśli ten klucz okaże się nieprawidłowy, strona poprosi o wpisanie poprawnego klucza API.

