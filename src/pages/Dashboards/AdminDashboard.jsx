import { useState } from 'react';
import { UploadCloud, File, CheckCircle2 } from 'lucide-react';

const AdminDashboard = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setSuccess(false);
        }
    };

    const handleUpload = () => {
        if (!file) return;
        setUploading(true);

        // Simulate upload delay
        setTimeout(() => {
            setUploading(false);
            setSuccess(true);
            setFile(null);
        }, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Transcript</h2>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                    <UploadCloud size={48} className="text-kpmg-blue mb-4" />
                    <p className="text-lg font-medium text-gray-700 mb-2">Drag and drop file here</p>
                    <p className="text-sm text-gray-500 mb-6">Supported formats: .txt, .docx</p>

                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept=".txt,.docx"
                        onChange={handleFileChange}
                    />
                    <label
                        htmlFor="file-upload"
                        className="bg-white border text-gray-700 px-6 py-2.5 rounded-lg font-medium cursor-pointer hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        Browse Files
                    </label>
                </div>

                {file && (
                    <div className="mt-6 flex items-center justify-between bg-blue-50 border border-blue-100 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <File size={24} className="text-kpmg-blue" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                        </div>
                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className={`px-4 py-2 rounded-lg font-medium text-white transition-colors ${uploading ? 'bg-blue-400 cursor-not-allowed' : 'bg-kpmg-blue hover:bg-blue-800'
                                }`}
                        >
                            {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                )}

                {success && (
                    <div className="mt-6 flex items-center gap-3 bg-green-50 border border-green-100 text-green-700 p-4 rounded-lg">
                        <CheckCircle2 size={24} />
                        <p className="font-medium">File uploaded successfully! No backend processing required.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
