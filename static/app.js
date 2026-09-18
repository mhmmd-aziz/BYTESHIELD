async function handleUpload(file, mode) {
    const loaderId = mode === 'ppe' ? 'ppe-loader' : 'smoke-loader';
    const containerId = mode === 'ppe' ? 'ppe-result-container' : 'smoke-result-container';
    
    document.getElementById(loaderId).style.display = 'block';
    document.getElementById(containerId).style.display = 'none';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', mode);

    try {
        const response = await fetch('/api/detect', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        
        document.getElementById(loaderId).style.display = 'none';
        
        if (result.success) {
            const container = document.getElementById(containerId);
            container.style.display = 'block';
            
            // Generate unique param to bust cache
            const url = result.url + "?t=" + new Date().getTime();
            
            if (result.type === 'video') {
                container.innerHTML = `<video controls autoplay loop><source src="${url}" type="video/mp4"></video>`;
            } else {
                container.innerHTML = `<img src="${url}">`;
            }
        } else {
            alert('Error processing file');
        }
    } catch (error) {
        console.error(error);
        alert('Failed to connect to the API');
        document.getElementById(loaderId).style.display = 'none';
    }
}

document.getElementById('ppe-input').addEventListener('change', (e) => {
    if(e.target.files[0]) handleUpload(e.target.files[0], 'ppe');
});

document.getElementById('smoke-input').addEventListener('change', (e) => {
    if(e.target.files[0]) handleUpload(e.target.files[0], 'smoking');
});
