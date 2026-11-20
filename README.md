# Daftari Langu

Notebook app ya Kiswahili (PWA). Notes na orodha za kufanya, zinafanya kazi bila intaneti, na zinabaki kwenye simu ya mtumiaji.

## Vipengele

- Notes za maandishi na orodha za kufanya (checklist)
- Lebo (#), rangi 6, kubandika juu, kumbukumbu (archive), tupio la siku 30
- Kutafuta kwa haraka (na kuonyesha maneno yaliyopatikana)
- Mandhari ya mwanga, giza au otomatiki
- Gridi au orodha, kupanga kwa tarehe au A-Z
- Kufunga app kwa PIN
- Kupakua na kuleta nakala (backup) ya notes
- Kushiriki na kunakili note, kutengeneza nakala, kugeuza maandishi <-> orodha
- Kufanya kazi bila intaneti, na kusakinishwa kama app
- Kutendua baada ya kufuta au kuweka kumbukumbu
- Tarehe ya mwisho kwa kila note, na kichujio cha "Ratiba" (zilizochelewa zinaonekana nyekundu)
- Kuchagua notes nyingi (shikilia note kwa muda mfupi, au Ctrl+bofya kwenye kompyuta) kisha kubandika, kuweka kumbukumbu au kufuta kwa pamoja
- Ukubwa wa herufi: ndogo, kawaida, kubwa
- Kufuta vipengee vilivyokamilika kwenye orodha kwa mara moja
- Kupakua note moja kama faili la .txt

## Muundo wa folder

```
notebook-app/
├── app.py                      # Seva ndogo ya Flask (haina database)
├── requirements.txt
├── templates/
│   ├── index.html              # HTML ya app
│   └── privacy.html            # Sera ya faragha (inahitajika Play Store)
└── static/
    ├── style.css               # CSS
    ├── app.js                  # JavaScript (mantiki yote ya app)
    ├── sw.js                   # Service worker (offline)
    ├── manifest.webmanifest    # Taarifa za PWA
    ├── icon-192.png
    ├── icon-512.png
    └── icon-maskable-512.png
```

Notes zote zinahifadhiwa kwenye kivinjari (localStorage) cha mtumiaji. Seva inatuma faili tu, kwa hiyo inafanya kazi vizuri kwenye Vercel au Render bila kuweka database.

## Kuendesha kwenye kompyuta

```bash
pip install -r requirements.txt
python app.py
```

Fungua http://localhost:5000

## Kuweka mtandaoni (Vercel)

Pakia faili zote kwenye GitHub, kisha unganisha repo kwenye Vercel. Hakuna mipangilio ya ziada inayohitajika.

## Kuipeleka Play Store

1. Hakikisha app iko mtandaoni kwa https (mfano `https://notebukapp.vercel.app`).
2. Fungua **pwabuilder.com**, bandika link ya app, bonyeza **Start**.
3. Chagua **Package for stores**, kisha **Android**, na ujaze:
   - Package ID: mfano `com.jinalako.daftari`
   - App name: Daftari Langu
   - Weka kisanduku cha **Signing key** kitengenezwe kwa ajili yako, na **uhifadhi faili la key na nywila yake mahali salama**. Ukilipoteza huwezi kusasisha app.
4. Pakua zip. Ndani yake kuna faili la `.aab` (la kupakia Play Store) na `assetlinks.json`.
5. Weka yaliyomo ya `assetlinks.json` kwenye `static/assetlinks.json` ya repo hii. App itaifikisha kupitia `/.well-known/assetlinks.json`.
6. Kwenye **Play Console**: tengeneza app mpya, pakia `.aab`, jaza maelezo, picha za skrini, na weka Privacy Policy URL: `https://notebukapp.vercel.app/privacy`.

## Faragha

Hakuna akaunti, matangazo wala ukusanyaji wa data. Tazama `/privacy`.
