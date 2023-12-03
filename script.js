import pdfjsLib from './node_modules/pdfjs-dist/build/pdf';

const lokalnyPdfPath = './resources/LEK-choroby_wewnętrzne.pdf';

async function pobierzPytaniaZLokalnegoPDF() {
  try {
    const loadingTask = pdfjsLib.getDocument(lokalnyPdfPath);
    const pdf = await loadingTask.promise;

    const liczbaStron = pdf.numPages;

    const pytania = [];

    for (let strona = 1; strona <= liczbaStron; strona++) {
      const page = await pdf.getPage(strona);
      const tekstStrony = await page.getTextContent();

      const tekstStronyPelny = tekstStrony.items.map(item => item.str).join('\n');

      const pytanieRegex = /Pytanie nr.*?(?=Pytanie nr|\n|$)/gs;
      let match;
      while ((match = pytanieRegex.exec(tekstStronyPelny)) !== null) {
        pytania.push(match[0]);
      }
    }

    return pytania;
  } catch (error) {
    console.error('Błąd podczas pobierania pytań z lokalnego pliku PDF:', error);
    return [];
  }
}

pobierzPytaniaZLokalnegoPDF()
  .then(pytania => {
    console.log('Pobrane pytania:', pytania);
  })
  .catch(error => {
    console.error('Wystąpił błąd:', error);
  });

let pytania = pobierzPytaniaZLokalnegoPDF();
console.log(pytania)