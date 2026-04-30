// targeting the main elements of the DOM
const image = document.getElementById('image-node');
const upload = document.getElementById('upload');
const download = document.getElementById('download');
const reset = document.getElementById('reset');
const modeBtn = document.getElementById('mode-toggle');
const sliders = document.querySelectorAll('.sliders input');

/**
 * a function to combine filters and apply them to the image
 */
function runFilters() {
    image.style.filter = `
        brightness(${document.getElementById('brightness').value}%)
        contrast(${document.getElementById('contrast').value}%)
        saturate(${document.getElementById('saturate').value}%)
        hue-rotate(${document.getElementById('hue').value}deg)
        grayscale(${document.getElementById('gray').value}%)
        blur(${document.getElementById('blur').value}px)
        sepia(${document.getElementById('sepia').value}%)
    `;
}

// Handling image upload and file reading processes
upload.onchange = () => {
    let reader = new FileReader();
    
    reader.readAsDataURL(upload.files[0]);
    
    reader.onload = () => {
        image.src = reader.result;
    };
    
    // Enabling control buttons after image selection and processing
    download.disabled = false;
    reset.disabled = false;
};

// Adding event listeners to each slider for real-time filter updates
sliders.forEach(s => {
    s.addEventListener('input', runFilters);
});

// Reset button logic to restore default values
reset.onclick = () => {
    sliders.forEach(s => {
        if (s.id === 'brightness' || s.id === 'contrast' || s.id === 'saturate') {
            s.value = 100;
        } else {
            s.value = 0;
        }
    });
    runFilters();
};

// Toggling between Dark and Light mode by updating the Body class and button text.
modeBtn.onclick = () => {
    if (document.body.classList.contains('dark-mode')) {
        document.body.classList.replace('dark-mode', 'light-mode');
        modeBtn.innerText = "Dark Mode";
    } else {
        document.body.classList.replace('light-mode', 'dark-mode');
        modeBtn.innerText = "Light Mode";
    }
};

/**
 * save the editing image(canvas)
 */
download.onclick = () => {
    const canvas = document.getElementById('export-canvas');
    const ctx = canvas.getContext('2d');
    
    // Adjusting Canvas dimensions to match the original image size
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    
    // applying filters to the Canvas context before rendering
    ctx.filter = image.style.filter;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    
    // Creating a virtual link to trigger the download of the processed image
    let link = document.createElement('a');
    link.download = 'edited_image.png';
    link.href = canvas.toDataURL();
    link.click();
};