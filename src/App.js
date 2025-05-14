import React, { useState } from 'react';
import WorldMap from './WorldMap';
import robotSketch from './assets/robotsketch.png'; // update path if needed

function App() {
    // --- State for Dropdown Selection ---
    const [selectedOption, setSelectedOption] = useState('option1');
    const [selectedDataset, setSelectedDataset] = useState('datasetA');

    // Keep theme for UI consistency
    const [mapTheme, setMapTheme] = useState('default');

    // --- Event Handlers ---
    const handleOptionChange = (event) => {
        console.log('Selected Option:', event.target.value);
        setSelectedOption(event.target.value);
    };

    const handleDatasetChange = (event) => {
        console.log('Selected Dataset:', event.target.value);
        setSelectedDataset(event.target.value);
    };

    // Robot part click handlers - modified for bubble chart functionality
    const handleHeadClick = () => {
        // Toggle dataset
        const newDataset = selectedDataset === 'datasetA' ? 'datasetB' : 'datasetA';
        setSelectedDataset(newDataset);
        console.log(`Robot head clicked! Changed dataset to ${newDataset}`);
    };

    const handleBodyClick = () => {
        // Cycle through different options/metrics
        const options = ['option1', 'option2', 'option3'];
        const currentIndex = options.indexOf(selectedOption);
        const nextIndex = (currentIndex + 1) % options.length;
        setSelectedOption(options[nextIndex]);
        console.log(`Robot body clicked! Changed metric to ${options[nextIndex]}`);
    };

    // --- Base font style ---
    const fontFamily = '"Helvetica Neue", Helvetica, Arial, sans-serif';

    // --- Styles ---
    const headerStyle = {
        textAlign: 'left',
        padding: '20px',
        borderBottom: '1px solid #eee',
        fontFamily: fontFamily,
    };

    const controlsContainerStyle = {
        padding: '15px 20px',
        display: 'flex',
        gap: '15px',
        alignItems: 'center',
        flexWrap: 'wrap',
        borderBottom: '1px solid #eee',
        backgroundColor: '#f8f9fa',
        fontFamily: fontFamily,
    };

    const selectStyle = {
        padding: '8px 10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '14px',
        minWidth: '150px',
        fontFamily: fontFamily,
    };

    const labelStyle = {
        marginRight: '5px',
        fontSize: '14px',
        fontWeight: '500',
        fontFamily: fontFamily,
    };

    const mainContentStyle = {
        width: '90%',
        maxWidth: '1400px',
        padding: '20px',
        margin: '20px auto',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '30px',
        fontFamily: fontFamily,
    };

    const imageContainerStyle = {
        flex: '0 0 300px',
        textAlign: 'center',
        position: 'relative',
        fontFamily: fontFamily,
    };

    const imageStyle = {
        maxWidth: '100%',
        height: 'auto',
        borderRadius: '8px',
        display: 'block',
        margin: '0 auto',
        transform: 'scaleX(-1)',
        opacity: 0.6,
    };

    // Robot clickable areas styles
    const robotHeadStyle = {
        position: 'absolute',
        top: '5%',
        left: '0%',
        width: '100%',
        height: '30%',
        border: '2px dashed rgba(128, 128, 128, 0.5)',
        borderRadius: '15px',
        cursor: 'pointer',
        backgroundColor: 'rgba(128, 128, 128, 0.15)',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: '10px',
        color: 'rgba(128, 128, 128, 0.7)',
        fontWeight: 'bold',
        fontSize: '14px',
        transition: 'all 0.3s ease',
        fontFamily: fontFamily,
    };

    const robotBodyStyle = {
        position: 'absolute',
        top: '40%',
        left: '0%',
        width: '100%',
        height: '55%',
        border: '2px dashed rgba(128, 128, 128, 0.5)',
        borderRadius: '10px',
        cursor: 'pointer',
        backgroundColor: 'rgba(128, 128, 128, 0.15)',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: '10px',
        color: 'rgba(128, 128, 128, 0.7)',
        fontWeight: 'bold',
        fontSize: '14px',
        transition: 'all 0.3s ease',
        fontFamily: fontFamily,
    };

    const mapContainerStyle = {
        flex: 1,
        minWidth: 0,
        fontFamily: fontFamily,
    };

    const appStyle = {
        fontFamily: fontFamily,
    };

    // Info panel style
    const infoPanelStyle = {
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #eee',
        fontSize: '14px',
        lineHeight: '1.5',
        fontFamily: fontFamily,
    };

    // Get the current metric name based on selection
    const getMetricName = () => {
        switch (selectedOption) {
            case 'option1': return 'Robot Production';
            case 'option2': return 'AI Development';
            case 'option3': return 'Market Size';
            default: return 'Value';
        }
    };

    // Get the current dataset name based on selection
    const getDatasetName = () => {
        switch (selectedDataset) {
            case 'datasetA': return '2024 Data';
            case 'datasetB': return '2025 Projections';
            default: return 'Current Data';
        }
    };

    return (
        <div className="App" style={appStyle}>
            <header style={headerStyle}>
                <h1>Global Humanoid Robot Market</h1>
            </header>

            {/* Controls Container */}
            <div style={controlsContainerStyle}>
                <div>
                    <span style={labelStyle}>Metric:</span>
                    <select
                        style={selectStyle}
                        value={selectedOption}
                        onChange={handleOptionChange}
                    >
                        <option value="option1">Robot Production</option>
                        <option value="option2">AI Development</option>
                        <option value="option3">Market Size</option>
                    </select>
                </div>

                <div>
                    <span style={labelStyle}>Dataset:</span>
                    <select
                        style={selectStyle}
                        value={selectedDataset}
                        onChange={handleDatasetChange}
                    >
                        <option value="datasetA">2024 Data</option>
                        <option value="datasetB">2025 Projections</option>
                    </select>
                </div>
            </div>

            {/* Main Content Area (Image + Map) */}
            <div style={mainContentStyle}>
                {/* Image Container with Interactive Regions */}
                <div style={imageContainerStyle}>
                    <img
                        src={robotSketch}
                        alt="Robot Assistant"
                        style={imageStyle}
                    />

                    {/* Clickable Robot Head Area */}
                    <div
                        style={robotHeadStyle}
                        onClick={handleHeadClick}
                        title="Click to change dataset"
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 100, 100, 0.3)';
                            e.currentTarget.style.color = 'rgba(255, 100, 100, 1)';
                            e.currentTarget.style.border = '2px dashed rgba(255, 100, 100, 0.9)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(128, 128, 128, 0.15)';
                            e.currentTarget.style.color = 'rgba(128, 128, 128, 0.7)';
                            e.currentTarget.style.border = '2px dashed rgba(128, 128, 128, 0.5)';
                        }}
                    >
                        Head: Toggle Dataset
                    </div>

                    {/* Clickable Robot Body Area */}
                    <div
                        style={robotBodyStyle}
                        onClick={handleBodyClick}
                        title="Click to change metric"
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(100, 100, 255, 0.3)';
                            e.currentTarget.style.color = 'rgba(100, 100, 255, 1)';
                            e.currentTarget.style.border = '2px dashed rgba(100, 100, 255, 0.9)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(128, 128, 128, 0.15)';
                            e.currentTarget.style.color = 'rgba(128, 128, 128, 0.7)';
                            e.currentTarget.style.border = '2px dashed rgba(128, 128, 128, 0.5)';
                        }}
                    >
                        Body: Change Metric
                    </div>

                    {/* Information Panel */}
                    <div style={infoPanelStyle}>
                        <h3 style={{ margin: '0 0 10px 0' }}>Current View</h3>
                        <p><strong>Metric:</strong> {getMetricName()}</p>
                        <p><strong>Dataset:</strong> {getDatasetName()}</p>
                        <p>
                            Hover over bubbles to see exact values. The size of each bubble
                            represents the relative value for that country.
                        </p>
                    </div>
                </div>

                {/* Map Container */}
                <div style={mapContainerStyle}>
                    <WorldMap
                        theme={mapTheme}
                        selectedDataset={selectedDataset}
                        selectedOption={selectedOption}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;