const { invoke } = window.__TAURI__.tauri;
const { message } = window.__TAURI__.dialog;

let greetInputEl;
let greetMsgEl;

async function handleWordClick(target) {
  await message(`
    Clicked on element:
          Tag Name: ${target.tagName}
          Text Content: ${target.textContent}
          ID: ${target.getAttribute('id') || 'No ID'}
  `);
}

window.addEventListener("DOMContentLoaded", () => {

  const tauri = window.__TAURI__;

  tauri.invoke('enumerate_paragraphs').then(paragraphs => {
    // Update each paragraph with the enumerated numbers
    paragraphs.forEach((paragraph, index) => {
      const paragraphElement = document.querySelectorAll('.container p.is-text')[index];
      if (paragraphElement) {
        paragraphElement.innerText = `${paragraph.number}. ${paragraph.text}`;
        let words = paragraph.text.split(' ');
        paragraphElement.innerHTML = '';

        words.forEach((word) => {
          const wordElement = document.createElement('span');
          wordElement.classList.add("hovered");
          wordElement.innerText = `${word} `;
          
          wordElement.addEventListener('mouseenter', (event) => {
            event.target.classList.add('hover-effect');
          });
          
          wordElement.addEventListener('mouseleave', (event) => {
            event.target.classList.remove('hover-effect');
          });

          wordElement.addEventListener('click', (event) => {
            const target = event.target;
            if (target.tagName === 'SPAN') {
              handleWordClick(target);
            }
          });

          paragraphElement.appendChild(wordElement);
        });
      }
    });
  });

});
