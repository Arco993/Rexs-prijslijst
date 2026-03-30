// 1. DEFINIEER JE MATERIALEN HIER
const materialen = [
    "Staal S235 (10mm)",
    "Aluminium Profiel",
    "RVS 304 Plaat",
    "Koper Buis 15mm",
    "Hout (Eiken)"
];

// 2. CONFIGURATIE VOOR DE AFBEELDING (WAAR MOET DE TEKST KOMEN?)
const config = {
    templateUrl: 'template.png', // De naam van je basis-afbeelding
    font: 'bold 36px Arial',      // Lettertype en grootte
    color: '#000000',             // Tekstkleur (Zwart)
    startX: 300,                  // X-positie (hoeveel van links)
    startY: 400,                  // Y-positie (hoeveel van boven voor de eerste rij)
    priceXOffset: 800,            // Hoeveel pixels naar rechts staat de prijs?
    rowHeight: 60                 // Ruimte tussen de rijen
};


// --- Logica (niet aanpassen tenzij je weet wat je doet) ---

const tabelBody = document.querySelector('#prijzenTabel tbody');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Vul de tabel op de webpagina
materialen.forEach((materiaal, index) => {
    const row = `<tr>
        <td>${materiaal}</td>
        <td><input type="number" class="prijs-input" data-index="${index}" step="0.01" placeholder="10.00"></td>
    </tr>`;
    tabelBody.innerHTML += row;
});

document.getElementById('generateBtn').addEventListener('click', generateImage);

function generateImage() {
    const inputs = document.querySelectorAll('.prijs-input');
    const image = new Image();
    image.src = config.templateUrl;

    image.onload = () => {
        // Stel canvas grootte in gelijk aan de afbeelding
        canvas.width = image.width;
        canvas.height = image.height;

        // Teken de basis-afbeelding
        ctx.drawImage(image, 0, 0);

        // Stel tekststijl in
        ctx.font = config.font;
        ctx.fillStyle = config.color;
        ctx.textBaseline = 'top';

        // Teken Datum
        const datum = new Date().toLocaleDateString('nl-NL');
        ctx.fillText(`Datum: ${datum}`, config.startX, config.startY - 100);

        // Loop door materialen en typ prijzen
        inputs.forEach((input, index) => {
            const prijs = parseFloat(input.value).toFixed(2);
            const yPos = config.startY + (index * config.rowHeight);

            // Teken de naam
            ctx.fillText(materialen[index], config.startX, yPos);
            
            // Teken de prijs (met Euro-teken)
            if (!isNaN(prijs)) {
                ctx.fillText(`€ ${prijs.replace('.', ',')}`, config.startX + config.priceXOffset, yPos);
            }
        });

        // Download de afbeelding
        const link = document.createElement('a');
        link.download = `Prijslijst_${datum}.png`;
        link.href = canvas.toDataURL();
        link.click();
    };
      }
