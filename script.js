// 1. BIJGEWERKTE LIJST MET MATERIALEN
const materialenLijst = [
    "Aluminium",
    "Car parts",
    "Craft parts",
    "Elektronisch Schroot",
    "Glas",
    "Ijzer",
    "Koper",
    "Metaalschroot",
    "Plastic",
    "Rubber",
    "Staal"
];

// Automatische pad-vinder voor GitHub Pages
const base_url = window.location.href.split(/[?#]/)[0].replace('index.html', '');

const config = {
    templateUrl: base_url + 'template.png', 
    font: 'bold 30px Arial',
    color: '#D4AF37', // Chique goudkleur
    startX: 100,      // Pas dit aan om tekst naar links/rechts te schuiven op je PNG
    startY: 250,      // Pas dit aan om tekst naar boven/beneden te schuiven op je PNG
    priceXOffset: 500, // Afstand tussen materiaalnaam en de prijs
    rowHeight: 50      // Ruimte tussen de regels (iets kleiner omdat de lijst langer is)
};

const tabelBody = document.querySelector('#prijzenTabel tbody');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Vul de tabel op de website (alfabetisch bij opstarten)
materialenLijst.sort().forEach((materiaal, index) => {
    const row = `<tr>
        <td>${materiaal}</td>
        <td><input type="number" class="prijs-input" data-naam="${materiaal}" step="0.01" value="0.00"></td>
    </tr>`;
    tabelBody.innerHTML += row;
});

document.getElementById('generateBtn').addEventListener('click', function() {
    console.log("Systeem: Data verzamelen...");
    
    // 1. Verzamel alle ingevulde data
    const inputs = document.querySelectorAll('.prijs-input');
    let dataVoorAfbeelding = [];

    inputs.forEach(input => {
        dataVoorAfbeelding.push({
            naam: input.getAttribute('data-naam'),
            prijs: parseFloat(input.value) || 0
        });
    });

    // 2. SORTEREN: Eerst op prijs (hoog naar laag), dan alfabetisch bij gelijke prijs
    dataVoorAfbeelding.sort((a, b) => {
        if (b.prijs !== a.prijs) {
            return b.prijs - a.prijs; 
        }
        return a.naam.localeCompare(b.naam);
    });

    // 3. Tekenproces op de afbeelding
    const image = new Image();
    image.crossOrigin = "anonymous"; 
    image.src = config.templateUrl + '?t=' + new Date().getTime();

    image.onload = function() {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        ctx.font = config.font;
        ctx.fillStyle = config.color;
        ctx.textBaseline = 'top';

        // 4. Teken de gesorteerde lijst
        dataVoorAfbeelding.forEach((item, index) => {
            const prijsGeformatteerd = item.prijs.toFixed(2).replace('.', ',');
            const yPos = config.startY + (index * config.rowHeight);
            
            ctx.fillText(item.naam, config.startX, yPos);
            ctx.fillText("€ " + prijsGeformatteerd, config.startX + config.priceXOffset, yPos);
        });

        // Datum toevoegen
        const datum = new Date().toLocaleDateString('nl-NL');
        ctx.fillText("Datum: " + datum, config.startX, config.startY - 70);

        // Downloaden
        const link = document.createElement('a');
        link.download = 'Prijslijst_' + datum + '.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    image.onerror = function() {
        alert("Fout: Kan 'template.png' niet vinden. Zorg dat de afbeelding in GitHub staat!");
    };
});
