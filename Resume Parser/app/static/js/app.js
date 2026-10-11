document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('fileInput');
    const dropZone = document.getElementById('dropZone');
    const uploadBtn = document.getElementById('uploadBtn');
    const errorMessage = document.getElementById('errorMessage');
    const spinner = document.getElementById('spinner');
    const btnText = document.querySelector('.btn-text');

    if (!uploadForm || !fileInput || !dropZone) return;

    fileInput.addEventListener('change', handleFileSelect);

    dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', function() {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            handleFileSelect();
        }
    });

    dropZone.addEventListener('click', function(e) {
        if (e.target !== fileInput && !e.target.classList.contains('file-label')) {
            fileInput.click();
        }
    });

    uploadForm.addEventListener('submit', handleUpload);

    function handleFileSelect() {
        if (fileInput.files.length > 0) {
            uploadBtn.disabled = false;
            hideError();
        }
    }

    async function handleUpload(e) {
        e.preventDefault();

        const file = fileInput.files[0];
        if (!file) {
            showError('Please select a file to upload');
            return;
        }

        showLoading(true);
        hideError();

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/v1/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ detail: 'Upload failed' }));
                throw new Error(error.detail || 'Upload failed');
            }

            const data = await response.json();

            const parseResponse = await fetch(`/api/v1/parse/${data.resume_id}`, {
                method: 'POST'
            });

            if (!parseResponse.ok) {
                const error = await parseResponse.json().catch(() => ({ detail: 'Parsing failed' }));
                throw new Error(error.detail || 'Parsing failed');
            }

            window.location.href = `/results/${data.resume_id}`;

        } catch (error) {
            console.error('Upload error:', error);
            showError(error.message || 'Something went wrong while uploading');
        } finally {
            showLoading(false);
        }
    }

    function showError(message) {
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.classList.remove('hidden');
        }
    }

    function hideError() {
        if (errorMessage) {
            errorMessage.classList.add('hidden');
        }
    }

    function showLoading(show) {
        if (uploadBtn) {
            uploadBtn.disabled = show;
        }
        if (spinner) {
            spinner.classList.toggle('hidden', !show);
        }
        if (btnText) {
            btnText.textContent = show ? 'Uploading...' : 'Upload Resume';
        }
    }
});