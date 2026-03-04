const SoftControlCard = ({ title, description, number }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 text-gray-50 opacity-50 text-[100px] font-black pointer-events-none group-hover:scale-110 transition-transform">
                {number}
            </div>
            <div className="relative z-10">
                <h3 className="text-lg font-bold text-kpmg-blue mb-2 pb-2 border-b border-gray-100">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
            </div>
        </div>
    );
};

export default SoftControlCard;
