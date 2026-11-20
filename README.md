# 📓 Daftari Langu

Notebook app ya Kiswahili: tengeneza, hariri, tafuta na futa notes. Inahifadhi kiotomatiki.

## Muundo wa folder

```
notebook-app/
├── app.py              # Python (Flask) + database
├── requirements.txt
├── templates/
│   └── index.html      # HTML
└── static/
    ├── style.css       # CSS
    └── app.js          # JavaScript
```

## Jinsi ya kuendesha

```bash
pip install -r requirements.txt
python app.py
```

Kisha fungua http://localhost:5000

## Vipengele

- Notes mpya, hariri, futa
- Kuhifadhi kiotomatiki (sekunde 0.5 baada ya kuacha kuandika)
- Rangi 6 za notes
- Kubandika (pin) notes muhimu juu
- Kutafuta kichwa na maandishi
- Mandhari ya giza / mwanga
- Inafanya kazi vizuri kwenye simu
- Ctrl+S kuhifadhi mara moja

## API

| Njia | Kazi |
|------|------|
| GET `/api/notes?q=` | Orodha / tafuta |
| POST `/api/notes` | Tengeneza |
| PUT `/api/notes/<id>` | Hariri |
| DELETE `/api/notes/<id>` | Futa |
