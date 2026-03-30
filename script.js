// 1. LIJST MET MATERIALEN
const materialen = [
    "Staal S235 (10mm)",
    "Aluminium Profiel",
    "RVS 304 Plaat",
    "Koper Buis 15mm",
    "Hout (Eiken)"
];

// 2. INSTELLINGEN VOOR DE AFBEELDING
const config = {
    templateUrl: './template.png', // De ./ zorgt dat hij in de huidige map zoekt
    font: 'bold 40px Arial',
    color: '#D4AF37',
    startX: 100,      // Pas dit aan om tekst naar links/rechts te verplaatsen
    startY: 250,      // Pas dit aan om tekst naar boven/beneden te verplaatsen
    priceXOffset: 500, // Afstand tussen naam en prijs
    rowHeight: 60      // Ruimte tussen de regels
};

// 3. KOPPELING MET DE PAGINA
const tabelBody = document.querySelector('#prijzenTabel tbody');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Vul de tabel op de website bij het laden
materialen.forEach((materiaal, index) => {
    const row = `<tr>
        <td>${materiaal}</td>
        <td><input type="number" class="prijs-input" data-index="${index}" step="0.01" value="0.00"></td>
    </tr>`;
    tabelBody.innerHTML += row;
});

// 4. DE GENERATOR FUNCTIE
document.getElementById('generateBtn').addEventListener('click', function() {
    console.log("Systeem: Starten met genereren...");
    
    const image = new Image();
    
    // Belangrijk voor GitHub Pages beveiliging:
    image.crossOrigin = "anonymous"; 
    
    // Voeg een uniek nummer toe aan de URL om de browser-cache te omzeilen
    image.src = config.templateUrl + '?t=' + new Date().getTime();

    image.onload = function() {
        console.log("Systeem: Template succesvol geladen.");
        
        // Canvas klaarmaken
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        // Tekststijl instellen
        ctx.font = config.font;
        ctx.fillStyle = config.color;
        ctx.textBaseline = 'top';

        // Prijzen ophalen en op de afbeelding tekenen
        const inputs = document.querySelectorAll('.prijs-input');
        inputs.forEach((input, index) => {
            const prijs = parseFloat(input.value).toFixed(2).replace('.', ',');
            const yPos = config.startY + (index * config.rowHeight);
            
            // Teken de naam van het materiaal
            ctx.fillText(materialen[index], config.startX, yPos);
            
            // Teken de prijs
            ctx.fillText("€ " + prijs, config.startX + config.priceXOffset, yPos);
        });

        // Huidige datum toevoegen (optioneel)
        const datum = new Date().toLocaleDateString('nl-NL');
        ctx.fillText("Datum: " + datum, config.startX, config.startY - 80);

        // De afbeelding downloaden
        console.log("Systeem: Afbeelding klaar voor download.");
        const link = document.createElement('a');
        link.download = 'Prijslijst_' + datum + '.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    image.onerror = function() {
        console.error("FOUT: Kan 'template.png' niet vinden. Controleer of het bestand exact zo heet in GitHub!");
        alert("Fout: De achtergrondafbeelding (template.png) kon niet worden geladen.");
    };
});
