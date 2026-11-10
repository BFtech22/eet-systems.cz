# EET Systems – web pro EET 2.0

Jednostránkový statický web EET Systems (součást PcObchodu): jak funguje EET 2.0, co nabízíme, historie od roku 2016 a kontakty.

- Náhled: https://bftech22.github.io/eet-systems.cz/ (GitHub Pages z větve `main`, kořen repozitáře)
- Soubory: `index.html`, `css/style.css`, `js/main.js`, `img/`, `fonts/` (písmo Outfit, SIL Open Font License – `fonts/OFL.txt`)
- Při každé změně `css/style.css` nebo `js/main.js` zvýšit v `index.html` číslo `?v=…`, jinak prohlížeče až 10 minut drží starý styl (GitHub Pages: max-age=600).
- Formulář odesílá přes Web3Forms (stejný klíč jako pcobchod.com).

Před spuštěním na doméně eet-systems.cz:
1. zaregistrovat doménu a přidat soubor `CNAME` s `eet-systems.cz`,
2. v `index.html` smazat řádek `<meta name="robots" content="noindex, nofollow">`,
3. případně zřídit e-mail obchod@eet-systems.cz a doplnit ho do kontaktů.
