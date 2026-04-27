import FunctionRadarProfile from '../FunctionRadarProfile';

const FunctionWiseSection = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1F2937', margin: '0 0 4px' }}>Function Analysis</h2>
                <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>
                    Explore soft control scores broken down by organisational function and compare against the overall average.
                </p>
            </div>
            <FunctionRadarProfile />
        </div>
    );
};

export default FunctionWiseSection;
