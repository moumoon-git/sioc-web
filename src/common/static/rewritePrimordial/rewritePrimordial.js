function Image(width, height) {
    const img = document.createElement('img');
    img.setAttribute('crossOrigin', 'anonymous');
    img.style.width = width;
    img.style.height = height;
    return img;
}
