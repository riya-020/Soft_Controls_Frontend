import { useState } from 'react';
import { UploadCloud, File, CheckCircle2, AlertCircle, Download } from 'lucide-react';

const AdminDashboard = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setSuccess(false);
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError('');
        setSuccess(false);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8000/process', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Processing failed');
            }

            setSuccess(true);

        } catch (err) {
            if (err.message === 'Failed to fetch') {
                setError('Cannot connect to backend. Make sure uvicorn is running on port 8000.');
            } else {
                setError(err.message);
            }
        } finally {
            setUploading(false);
        }
    };

    const handleDownload = async (filename) => {
        try {
            const response = await fetch(`http://localhost:8000/download/${filename}`);
            if (!response.ok) throw new Error('File not found');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            alert('Download failed: ' + err.message);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">

            {/* Upload Card */}
            <div className="bg-white border border-gray-200 border-t-4 border-t-kpmg-blue shadow-card p-8">

                <h2 className="text-2xl font-bold text-kpmg-navy mb-6 tracking-tight">
                    Upload Transcript
                </h2>

                <div className="border border-kpmg-lightBlue p-10 flex flex-col items-center justify-center bg-gray-50 hover:bg-white transition-colors">
                    <UploadCloud size={48} className="text-kpmg-blue mb-4" />
                    <p className="text-lg font-semibold text-kpmg-navy mb-2">
                        Drag and drop file here
                    </p>
                    <p className="text-sm text-kpmg-mediumGray mb-6 font-medium">
                        Supported format: .txt
                    </p>
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept=".txt"
                        onChange={handleFileChange}
                    />
                    <label
                        htmlFor="file-upload"
                        className="bg-white border text-kpmg-navy px-8 py-3 font-semibold cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        Browse Files
                    </label>
                </div>

                {file && (
                    <div className="mt-6 flex items-center justify-between bg-blue-50 border border-blue-200 p-4">
                        <div className="flex items-center gap-4">
                            <File size={28} className="text-kpmg-blue" />
                            <div>
                                <p className="text-sm font-bold text-kpmg-navy">{file.name}</p>
                                <p className="text-xs text-kpmg-mediumGray font-medium">
                                    {(file.size / 1024).toFixed(2)} KB
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className={`px-6 py-3 font-semibold text-white transition-colors shadow-solid ${
                                uploading
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-kpmg-blue hover:bg-kpmg-navy'
                            }`}
                        >
                            {uploading ? 'Analyzing with AI...' : 'Upload & Analyze'}
                        </button>
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="mt-4 flex items-center gap-3 bg-green-50 border-l-4 border-l-green-600 text-green-800 p-4">
                        <CheckCircle2 size={24} />
                        <p className="font-semibold">
                            Transcript processed successfully. CSV files generated in backend outputs folder.
                        </p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mt-4 flex items-center gap-3 bg-red-50 border-l-4 border-l-red-600 text-red-800 p-4">
                        <AlertCircle size={24} />
                        <p className="font-semibold">{error}</p>
                    </div>
                )}
            </div>

            {/* Download Buttons — only show after success */}
            {success && (
                <div className="flex gap-4">
                    <button
                        onClick={() => handleDownload('leadership_scores.csv')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-kpmg-blue text-white font-semibold hover:bg-kpmg-navy transition-colors"
                    >
                        <Download size={16} />
                        Download Leadership Scores CSV
                    </button>
                    <button
                        onClick={() => handleDownload('sentences_scored.csv')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border border-kpmg-blue text-kpmg-blue font-semibold hover:bg-blue-50 transition-colors"
                    >
                        <Download size={16} />
                        Download Sentences CSV
                    </button>
                </div>
            )}

        </div>
    );
};

export default AdminDashboard;