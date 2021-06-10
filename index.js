const base_url = "https://islamic-api-indonesia.herokuapp.com/api/";
let yadi = {
  quotes: "data/quotes",
  heroText: document.getElementById("heroText"),
  imgRandom: "/data/gambar",
  ayatKursiImg: document.getElementById("thumbnailKursi"),
  imgType: "image",
  ayatKursi: "data/json/ayatkursi",
  elemAyatKursi: document.getElementById("arabAyatKursi"),
  translateElemAyatKursi: document.getElementById("translateAyatKursi"),
  indoAyatKursi: document.getElementById("indoAyatKursi"),
  tafsirElemAyatKursi: document.getElementById("tafsirAyatKursi"),
  innerAsmaulHusna: document.getElementById("asmaul_husna"),
  asmaulHusna: "data/json/asmaulhusna",
  loading: `<button class="btn btn-primary" type="button" disabled>
  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  Loading...
</button>`,
  templateAsmaul: (
    title,
    text,
    secText,
    isArab
  ) => `<div class="card mb-3 col-md-6">
  <div class="card-body">
    <h5 class="card-title${isArab ? " text-end" : ""}">${
    title ? title : ""
  }</h5>
    <p class="card-text">${text ? text : secText}</p>
    ${
      text
        ? `<p class="card-text"><small class="text-muted">${secText}</small></p>`
        : ""
    }
  </div>
</div>`,
  kisahNabi: {
    elemen: document.getElementById("kisah_nabi"),
    path: "data/json/kisahnabi",
    checkUrl: (url, data) => {
      const base = url.split("?");
      if (decodeURIComponent(base[1]) == data) {
        console.log("Okee");
      }
      console.log(url, data);
    },
    execute: (data, elem) => {
      const nabi = data.result;
      let saf = "";
      nabi.forEach((item) => {
        saf += yadi.kisahNabi.template(
          item.image_url,
          item.name,
          item.description.substr(0, 70) +
            ` ...<a href='/?${item.name}'>Baca selengkapnya</a>`,
          item.tmp,
          item.thn_kelahiran,
          item.usia
        );
      });
      elem.innerHTML = saf;
      document.querySelectorAll(".reff").forEach((item) => {
        item.addEventListener("click", (e) => {
          e.preventDefault();
          window.location.href = e.target.href;
        });
      });
    },
    template: (
      img,
      nama,
      desc,
      tmpt,
      thLahir,
      usia
    ) => `<div class="card" style="width: 21rem;">
        <img src="${
          img ? img : "./logo.jpg"
        }" class="card-img-top" alt="Thumbnail Nabi">
        <div class="card-body">
          <h5 class="card-title">${nama ? nama : ""}</h5>
          <p class="card-text reff">${desc ? desc : ""}</p>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Tempat : ${
            tmpt ? tmpt : "Tidak Diketahui"
          }</li>
          <li class="list-group-item">Lahir : ${
            thLahir ? thLahir : "Tidak diketahui"
          }</li>
          <li class="list-group-item">Usia : ${
            usia ? usia : "Tidak Diketahui"
          }</li>
        </ul>
        <div class="card-body">
          <a class="btn btn-primary reff" href="/?${nama}">Baca Selengkapnya</a>
        </div>
      </div>`,
  },
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

//Mencetak ketika di klik
const clickCetak = (elemen, url, path, execute) => {
  elemen.addEventListener("click", async function () {
    this.innerHTML = yadi.loading;
    const data = await getData(url, path);
    execute(data, this);
  });
};

const executeAsmaul = (data, elem) => {
  const saf = data.result.data;
  let hl = "";
  saf.forEach((item) => {
    hl += yadi.templateAsmaul(item.arabic, item.latin, item.translation_id);
  });
  elem.innerHTML = hl;
};

//Mengolah data
const olahData = async () => {
  const quotes = await getData(base_url, yadi.quotes),
    ayatKursiImg = await getData(base_url, yadi.imgRandom),
    ayatKursi = await getData(base_url, yadi.ayatKursi),
    kisahNabi = await getData(base_url, yadi.kisahNabi.path);
  try {
    let data = {
      imgRandom: ayatKursiImg.result.image,
      type: "arab",
      title: ayatKursi.result.data.arabic,
      text: ayatKursi.result.data.latin,
      body: "<b>Artinya :</b> " + ayatKursi.result.data.translation,
      indo: yadi.indoAyatKursi,
      footer: "<br> Tafsir : " + ayatKursi.result.data.tafsir,
    };

    let uri = window.location.href.split("?");
    uri = decodeURIComponent(uri[1]);

    kisahNabi.result.forEach((item) => {
      if (uri === item.name) {
        data = {
          imgRandom: item.image_url,
          type: "latin",
          title: `${
            item.name.includes("Nabi") ? item.name : `Nabi ${item.name}`
          } lahir pada tahun ${item.thn_kelahiran}, dan wafat pada usia ${
            item.usia
          } tahun`,
          text: "",
          body: item.description,
          indo: yadi.indoAyatKursi,
          footer: "<br>" + quotes.result.text_id,
        };
        const headerTitle = document.getElementById("header_title");
        headerTitle.innerText = item.name;
        //console.log(item);
      }
      console.log(uri, item.name);
    });

    //Cetakan quotes
    manageQuotes(
      quotes.result.text_id +
        `${
          quotes.result.author
            ? `<small class="text-muted">- ${quotes.result.author}</small>`
            : ""
        }`,
      yadi.heroText
    );
    manageQuotes(data.imgRandom, yadi.ayatKursiImg, yadi.imgType);
    manageQuotes(data.title, yadi.elemAyatKursi, data.type);
    manageQuotes(data.text, yadi.translateElemAyatKursi);
    manageQuotes(data.body, data.indo);
    manageQuotes(data.footer, yadi.tafsirElemAyatKursi);
  } catch (e) {
    console.log(
      "Maaf data gagal dimuat, kemungkinan server down atau jaringan lelet" + e
    );
    alert(
      "Maaf data gagal dimuat, kemungkinan server down atau jaringan lelet" + e
    );
  }
};

const manageQuotes = (rslt, html, type) => {
  const xtype = {
    img: "image",
    arab: "arab",
    latin: "latin",
  };
  if (type == xtype.img) {
    html.innerHTML = `<img
                src="${rslt}"
                alt="Asmaul Husna"
                class="card-img"
                style="width: 100%; height: 100%; max-height: 30rem"
              />
`;
  } else if (type == xtype.arab) {
    html.classList.add("text-end");
    html.innerHTML = rslt;
  } else if (type == xtype.latin) {
    html.classList.add("text-start");
    html.innerHTML = rslt;
  } else {
    html.innerHTML = rslt;
  }
};

olahData();
clickCetak(yadi.innerAsmaulHusna, base_url, yadi.asmaulHusna, executeAsmaul);
clickCetak(
  yadi.kisahNabi.elemen,
  base_url,
  yadi.kisahNabi.path,
  yadi.kisahNabi.execute
);

document.getElementById("searchBar").addEventListener("click", (e) => {
  alert(
    "Fitur search saat ini sedang di kembangkan mohon tunggu update selanjutnya versi saat ini v.0.0.4"
  );
  e.target.remove();
});
