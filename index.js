const colorPicker = document.getElementById('seed-color')
const generateBtn = document.getElementById('generate-btn');
const colorPalette = document.getElementById('color-palette');
const copyFeedback = document.getElementById('copy-feedback');

function renderColors(colors) {
    colorPalette.innerHTML = '';
    
    for (const color of colors) {
        const colorColumn = document.createElement('div');
        colorColumn.className = 'color-column';
        colorColumn.style.backgroundColor = color.hex.value;
        colorColumn.dataset.color = color.hex.value;
        
        colorColumn.innerHTML = `
            <div class="color-content">
                <span class="hex-code">${color.hex.value}</span>
                <i class="fa-regular fa-copy copy-icon"></i>
            </div>
             <div class="copy-feedback-popup">Copied!</div>
        `;
        colorPalette.appendChild(colorColumn);
    }
}

generateBtn.addEventListener('click', () => {
    const seedColor = colorPicker.value.replace('#', '')
    const schemeType = document.getElementById('scheme-type').value

    
    generateBtn.textContent = 'Generating...';
    generateBtn.disabled = true;
    
    fetch(`https://www.thecolorapi.com/scheme?hex=${seedColor}&mode=${schemeType}&count=5`)
        .then(response => {
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Check if response is actually JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Response is not JSON');
            }
            
            return response.json();
        })
        .then(data => {
            console.log('API data received:', data);
            renderColors(data.colors);
        })
        .catch(error => {
            console.error('Error details:', error);
            console.log('Using fallback colors...');
            
            // Fallback colors in the same format as API response
            const fallbackColors = [
                { hex: { value: '#F55A5A' } },
                { hex: { value: '#2B283A' } },
                { hex: { value: '#FBF3AB' } },
                { hex: { value: '#AAD1B6' } },
                { hex: { value: '#A626D3' } }
            ];
            renderColors(fallbackColors);
        })
        .finally(() => {
            generateBtn.textContent = 'Get color scheme';
            generateBtn.disabled = false;
        });
});

colorPalette.addEventListener('click', (event) => {
    const colorColumn = event.target.closest('.color-column');
    if (colorColumn) {
        const hexValue = colorColumn.dataset.color;
        navigator.clipboard.writeText(hexValue).then(() => {
            const copyFeedback = colorColumn.querySelector('.copy-feedback-popup');
            if (copyFeedback) {
                copyFeedback.classList.add('show');
                setTimeout(() => {
                    copyFeedback.classList.remove('show');
                }, 1000); 
            }
            colorPicker.value = hexValue;
        });
    }
});


// Generate initial color scheme
generateBtn.click();