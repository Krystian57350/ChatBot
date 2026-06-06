# Weather AI Assistant

Prosta strona internetowa z chatbotem pogodowym zbudowana w HTML, CSS i JavaScript.

## Co robi projekt

- obsługuje rozmowę w stylu czatu z jednym polem wejściowym
- rozpoznaje zapytania pogodowe i nazwy miast po polsku
- pobiera pogodę z OpenWeather dla wpisanego miasta
- analizuje temperaturę i warunki atmosferyczne
- rekomenduje ubiór, parasol lub dodatkowe warstwy
- zapisuje historię rozmowy w `localStorage`
- obsługuje ciemny i jasny tryb wyglądu
- automatycznie przewija czat do najnowszej wiadomości

## Jak korzystać

1. Otwórz `index.html` w przeglądarce.
2. W polu wpisz zapytanie, np.:
   - `Pogoda w Grudziądzu`
   - `czy będzie deszcz`
   - `Jest 10 stopni i wieje wiatr`
3. Naciśnij `Wyślij` lub `Enter`.

## Co potrafi bot

- wykrywa tekst pogodowy po polsku
- rozpoznaje temperaturę i słowa takie jak `deszcz`, `śnieg`, `wiatr`, `słonecznie`
- tworzy rekomendacje ubioru zależnie od temperatury i warunków
- pobiera aktualną pogodę z OpenWeather dla zapytań o miasto
- wyświetla status pobierania i błędy sieciowe
- obsługuje naturalną polską formę nazw miast (np. `Warszawie`, `Grudziądzu`)

## Struktura plików

- `index.html` - interfejs użytkownika
- `style.css` - stylizacja i układ strony
- `script.js` - logika czatu, analiza wiadomości i pobieranie pogody
- `README.md` - dokumentacja projektu

## Integracja z OpenWeather

Projekt używa domyślnego klucza OpenWeather do pobierania pogody dla zapytań o miasto. Jeśli chcesz, możesz rozbudować interfejs o własne pole na klucz API i zapisać go w `localStorage`.

## Użyte technologie

- HTML5
- CSS3
- JavaScript (vanilla)
- Fetch API
- LocalStorage
- Responsive Web Design

