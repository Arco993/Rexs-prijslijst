const materialen = [
    "Staal S235 (10mm)",
    "Aluminium Profiel",
    "RVS 304 Plaat",
    "Koper Buis 15mm",
    "Hout (Eiken)"
];

const config = {
    templateUrl: './template.png',
    font: 'bold 30px Arial',
    color: '#000000',
    startX: 50,
    startY: 100,
    priceXOffset: 400,
    rowHeight: 50
};

const tabelBody = document.querySelector('#prijzenTabel tbody');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Vul de tabel
materialen.forEach((materiaal, index) => {
    const row = `<tr>
        <td>${materiaal}</td>
        <td><input type="number" class="prijs-input" data-index="${index}" step="0.01"></td>
    </tr>`;
    tabelBody.innerHTML += row;
});

// De knop-functie
document.getElementById('generateBtn').addEventListener('click', function() {
    console.log("Stap 1: Er is op de knop geklikt!");
    
    const image = new Image();
    image.src = config.templateUrl;
    console.log("Stap 2: Bezig met laden van: " + config.templateUrl);

    image.onload = function() {
        console.log("Stap 3: Afbeelding succesvol geladen! Formaat: " + image.width + "x" + image.height);
        
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        ctx.font = config.font;
        ctx.fillStyle = config.color;

        const inputs = document.querySelectorAll('.prijs-input');
        inputs.forEach((input, index) => {
            const prijs = input.value;
            const yPos = config.startY + (index * config.rowHeight);
            ctx.fillText(materialen[index], config.startX, yPos);
            ctx.fillText("€ " + prijs, config.startX + config.priceXOffset, yPos);
        });

        console.log("Stap 4: Tekenen klaar, download starten...");
        const link = document.createElement('a');
        link.download = 'prijslijst.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    image.onerror = function() {
        console.error("FOUT: De afbeelding kon niet worden gevonden of geladen. Check de bestandsnaam!");
    };
});
