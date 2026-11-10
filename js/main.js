// EET Systems – menu, odpočet do startu EET 2.0, odeslání formuláře
(function () {
  "use strict";

  // Menu na mobilu
  var tlacitko = document.querySelector(".menu-tlacitko");
  var menu = document.getElementById("menu");
  if (tlacitko && menu) {
    tlacitko.addEventListener("click", function () {
      var otevreno = menu.classList.toggle("otevreno");
      tlacitko.setAttribute("aria-expanded", otevreno ? "true" : "false");
      tlacitko.setAttribute("aria-label", otevreno ? "Zavřít menu" : "Otevřít menu");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        menu.classList.remove("otevreno");
        tlacitko.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Stín hlavičky po odscrollování
  var hlavicka = document.querySelector(".hlavicka");
  var priScrollu = function () { hlavicka.classList.toggle("posunuto", window.scrollY > 8); };
  window.addEventListener("scroll", priScrollu, { passive: true });
  priScrollu();

  // Odpočet do 1. 1. 2027 (půlnoc v Praze = 23:00 UTC 31. 12. 2026)
  var start = Date.UTC(2026, 11, 31, 23, 0, 0);
  var dnyEl = document.getElementById("odpocet-dny");
  var jednotkaEl = document.getElementById("odpocet-jednotka");
  var odpocet = document.getElementById("odpocet");
  function dny(n) { return n === 1 ? "den" : (n >= 2 && n <= 4 ? "dny" : "dní"); }
  function aktualizuj() {
    var zbyva = start - Date.now();
    if (zbyva <= 0) {
      odpocet.querySelector(".odpocet__popis").textContent = "EET 2.0 běží";
      dnyEl.textContent = "od 1. 1. 2027";
      jednotkaEl.textContent = "";
      return;
    }
    var n = Math.ceil(zbyva / 86400000);
    dnyEl.textContent = n;
    jednotkaEl.textContent = dny(n);
  }
  if (dnyEl) { aktualizuj(); setInterval(aktualizuj, 60000); }

  // Přepínání designu: tyrkysový (výchozí) × červený v barvách PcObchodu.
  // Volba se pamatuje v prohlížeči a promítne se do adresy (?design=cervena), takže jde poslat odkazem.
  var DESIGNY = {
    tyrkys: { dalsi: "cervena", popisek: "Červený design", ikona: "img/favicon.svg", barva: "#14213D" },
    cervena: { dalsi: "tyrkys", popisek: "Tyrkysový design", ikona: "img/favicon-cervena.svg", barva: "#14141A" }
  };
  var prepinac = document.getElementById("prepinac-designu");
  function nastavDesign(d, ulozit) {
    if (!DESIGNY[d]) d = "tyrkys";
    var koren = document.documentElement;
    if (d === "tyrkys") koren.removeAttribute("data-design"); else koren.setAttribute("data-design", d);
    var nast = DESIGNY[d];
    if (prepinac) {
      prepinac.querySelector(".prepinac-designu__text").textContent = nast.popisek;
      prepinac.setAttribute("aria-label", "Přepnout na " + nast.popisek.toLowerCase());
    }
    var ikona = document.getElementById("ikona-webu");
    if (ikona) ikona.setAttribute("href", nast.ikona);
    var barva = document.getElementById("barva-motivu");
    if (barva) barva.setAttribute("content", nast.barva);
    if (ulozit) {
      try { localStorage.setItem("eet-design", d); } catch (e) { /* bez úložiště prostě nepamatujeme */ }
      try {
        var url = new URL(location.href);
        if (d === "tyrkys") url.searchParams.delete("design"); else url.searchParams.set("design", d);
        history.replaceState(null, "", url.pathname + url.search + url.hash);
      } catch (e) { /* starší prohlížeč */ }
    }
  }
  nastavDesign(document.documentElement.getAttribute("data-design") || "tyrkys", false);
  if (prepinac) {
    prepinac.addEventListener("click", function () {
      var aktualni = document.documentElement.getAttribute("data-design") || "tyrkys";
      nastavDesign(DESIGNY[aktualni].dalsi, true);
    });
  }

  // Rok v patičce
  var rok = document.getElementById("rok");
  if (rok) rok.textContent = new Date().getFullYear();

  // Formulář (Web3Forms, stejná služba jako na pcobchod.com)
  var form = document.getElementById("formular");
  if (form) {
    var stav = form.querySelector(".formular__stav");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var tl = form.querySelector('button[type="submit"]');
      stav.className = "formular__stav";
      stav.textContent = "Odesílám…";
      tl.disabled = true;
      fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (r) { return r.json().then(function (d) { return { ok: r.ok && d.success, d: d }; }); })
        .then(function (v) {
          if (v.ok) {
            form.reset();
            stav.classList.add("ok");
            stav.textContent = "Děkujeme, ozveme se vám co nejdřív.";
          } else {
            throw new Error((v.d && v.d.message) || "chyba");
          }
        })
        .catch(function () {
          stav.classList.add("chyba");
          stav.textContent = "Zprávu se nepodařilo odeslat. Zavolejte nám prosím na 777 226 328.";
        })
        .then(function () { tl.disabled = false; });
    });
  }
})();
