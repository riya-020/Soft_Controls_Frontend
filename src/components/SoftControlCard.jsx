const SoftControlCard = ({ title, description, number }) => {
    return (
        <div className="bg-white border border-gray-200 border-t-2 border-t-transparent hover:border-t-kpmg-blue p-6 shadow-card hover:shadow-card-hover transition-all relative overflow-hidden group min-h-[160px] flex flex-col justify-between">
            <div className="absolute -right-2 -top-6 text-gray-50 opacity-40 text-[120px] font-black pointer-events-none group-hover:text-gray-100 transition-colors">
                {number}
            </div>
            <div className="relative z-10 flex-1">
                <h3 className="text-lg font-bold text-kpmg-navy mb-3">{title}</h3>
                <div className="h-px bg-gray-200 w-12 mb-3 group-hover:bg-kpmg-blue transition-colors"></div>
                <p className="text-kpmg-mediumGray text-sm leading-relaxed">{description}</p>
            </div>
        </div>
    );
};

export default SoftControlCard;
