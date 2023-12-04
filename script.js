async function getQuestionsFromPDF(pdfPath) {
  try {
    const loadingTask = pdfjsLib.getDocument(pdfPath);
    const pdf = await loadingTask.promise;
    const questions = [];

    const numPages = pdf.numPages;

    for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const textContent = await page.getTextContent();
      const pageQuestions = textContent.items
        .map(item => item.str)
        .filter(text => text.toLowerCase().startsWith('pytanie nr'));

      questions.push(...pageQuestions);
    }

    return questions;
  } catch (error) {
    console.error('Błąd podczas pobierania pytań z pliku PDF:', error);
    return [];
  }
}

async function displayQuestions() {
  const pdfPath = 'sciezka/do/twojego/pliku.pdf'; 
  const questions = await getQuestionsFromPDF(pdfPath);

  const questionsContainer = document.getElementById('questions-container');

  questions.forEach((question, index) => {
    const div = document.createElement('div');
    div.className = 'question';
    div.textContent = question;
    questionsContainer.appendChild(div);

    setTimeout(() => {
      div.style.display = 'block';

      setTimeout(() => {
        div.style.display = 'none';
      }, 20000 * (index + 1)); 
    }, 20000 * index); 
  });
}

displayQuestions();