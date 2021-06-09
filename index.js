const base_url = "https://islamic-api-indonesia.herokuapp.com/api/",
  yadi = {
    quotes: "data/quotes",
    heroText: document.getElementById("heroText"),
    imgRandom: "/data/gambar",
    ayatKursiImg: document.getElementById("thumbnailKursi"),
    imgType: true,
    ayatKursi: "data/json/ayatkursi",
    elemAyatKursi: document.getElementById("arabAyatKursi"),
    translateElemAyatKursi: document.getElementById("translateAyatKursi"),
    indoAyatKursi: document.getElementById("indoAyatKursi"),
    tafsirElemAyatKursi: document.getElementById("tafsirAyatKursi"),
  };

const getData = (url, path) => {
  return fetch(url + path)
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .then((res) => res);
};

const olahData = async () => {
  const quotes = await getData(base_url, yadi.quotes),
    ayatKursiImg = await getData(base_url, yadi.imgRandom),
    ayatKursi = await getData(base_url, yadi.ayatKursi);
  manageQuotes(
    quotes.result.text_id +
      `${
        quotes.result.author
          ? `<small class="text-muted">- ${quotes.result.author}</small>`
          : ""
      }`,
    yadi.heroText
  );
  manageQuotes(ayatKursiImg.result.image, yadi.ayatKursiImg, yadi.imgType);
  manageQuotes(ayatKursi.result.data.arabic, yadi.elemAyatKursi);
  manageQuotes(ayatKursi.result.data.latin, yadi.translateElemAyatKursi);
  manageQuotes(
    "<b>Artinya :</b> " + ayatKursi.result.data.translation,
    yadi.indoAyatKursi
  );
  manageQuotes(
    "<br> Tafsir : " + ayatKursi.result.data.tafsir,
    yadi.tafsirElemAyatKursi
  );
};

const manageQuotes = (rslt, html, type) => {
  if (type) {
    html.innerHTML = `<img
                src="${rslt}"
                alt="Asmaul Husna"
                style="width: 100%; height: 100%; max-height: 13rem"
              />
`;
  } else {
    html.innerHTML = rslt;
  }
};

olahData();

document.getElementById("searchBar").addEventListener("click", (e) => {
  alert(
    "Fitur search saat ini sedang di kembangkan mohon tunggu update selanjutnya versi saat ini v.0.0.3"
  );
  e.target.remove();
});
