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

const base_url = window.location.href.split(/[?#]/)[0].replace('index.html', '');

const config = {
    templateUrl: base_url + 'template.png', 
    font: 'bold 45px Arial',
    color: '#D4AF37', // Goud
    startX: 150,      
    startY: 350,      
    priceXOffset: 550, 
    rowHeight: 50      
};

const tabelBody = document.querySelector('#prijzenTabel tbody');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

materialenLijst.sort().forEach((materiaal, index) => {
    const row = `<tr>
        <td>${materiaal}</td>
        <td><input type="number" class="prijs-input" data-naam="${materiaal}" step="0.01" value="0.00"></td>
    </tr>`;
    tabelBody.innerHTML += row;
});

document.getElementById('generateBtn').addEventListener('click', function() {
    const inputs = document.querySelectorAll('.prijs-input');
    let dataVoorAfbeelding = [];

    inputs.forEach(input => {
        dataVoorAfbeelding.push({
            naam: input.getAttribute('data-naam'),
            prijs: parseFloat(input.value) || 0
        });
    });

    dataVoorAfbeelding.sort((a, b) => {
        if (b.prijs !== a.prijs) {
            return b.prijs - a.prijs; 
        }
        return a.naam.localeCompare(b.naam);
    });

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

        dataVoorAfbeelding.forEach((item, index) => {
            const prijsGeformatteerd = item.prijs.toFixed(2).replace('.', ',');
            const yPos = config.startY + (index * config.rowHeight);
            
            ctx.fillText(item.naam, config.startX, yPos);
            ctx.fillText("€ " + prijsGeformatteerd, config.startX + config.priceXOffset, yPos);
        });

        const link = document.createElement('a');
        link.download = 'Prijslijst.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    image.onerror = function() {
        alert("Fout: Kan 'template.png' niet vinden.");
    };
});
