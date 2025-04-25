import React, { useState, useRef } from 'react'; // Added useRef
import WorldMap from './WorldMap';
import robotSketch from './assets/robotsketch.png'; // update path if needed

function App() {
    // --- State for Dropdown Selection (Example) ---
    const [selectedOption, setSelectedOption] = useState('option1');
    const [selectedDataset, setSelectedDataset] = useState('datasetA');

    // Add states for robot interaction features
    const [arrowDirection, setArrowDirection] = useState('us-to-jp');
    const [mapTheme, setMapTheme] = useState('default');

    // State to track the current connection type
    const [connectionType, setConnectionType] = useState('japan-us');

    // Reference to store the toggle function from the WorldMap component
    const toggleConnectionRef = useRef(null);

    // --- Event Handlers (Example) ---
    const handleButtonClick = (buttonName) => {
        alert(`Button "${buttonName}" clicked!`);
        // Add logic here for what the button should do
    };

    const handleOptionChange = (event) => {
        console.log('Selected Option:', event.target.value);
        setSelectedOption(event.target.value);
        // Add logic here based on dropdown selection
    };

    const handleDatasetChange = (event) => {
        console.log('Selected Dataset:', event.target.value);
        setSelectedDataset(event.target.value);
        // Add logic here to potentially reload or filter map data
    };

    // Robot part click handlers
    const handleHeadClick = () => {
        // Toggle connection direction
        console.log("Current direction:", arrowDirection);
        const newDirection = arrowDirection === 'us-to-jp' ? 'jp-to-us' : 'us-to-jp';
        setArrowDirection(newDirection);
        console.log(`Robot head clicked! Changed connection direction to ${newDirection}`);
    };

    // Modified to directly toggle the connection type
    const handleBodyClick = () => {
        console.log("Body clicked - toggling connection");

        // Toggle the connection type directly in App component
        const newType = connectionType === 'japan-us' ? 'china-us' : 'japan-us';
        setConnectionType(newType);
        console.log(`Robot body clicked! Toggled connection type to ${newType}`);
    };

    // Handler for connection type changes from WorldMap
    const handleConnectionTypeChange = (callbackOrValue) => {
        if (typeof callbackOrValue === 'function') {
            // Store the toggle function
            toggleConnectionRef.current = callbackOrValue;
            console.log("Received toggle function from WorldMap");
        } else if (typeof callbackOrValue === 'string') {
            // Update our state with the new connection type
            setConnectionType(callbackOrValue);
            console.log("Connection type changed to:", callbackOrValue);
        }
    };

    // --- Base font style ---
    const fontFamily = '"Helvetica Neue", Helvetica, Arial, sans-serif';

    // --- Styles ---
    const headerStyle = {
        textAlign: 'left',
        padding: '20px',
        borderBottom: '1px solid #eee', // Add a separator
        fontFamily: fontFamily,
    };

    const controlsContainerStyle = {
        padding: '15px 20px',
        display: 'flex',
        gap: '15px', // Space between control items
        alignItems: 'center', // Vertically align items
        flexWrap: 'wrap', // Allow controls to wrap on smaller screens
        borderBottom: '1px solid #eee', // Add a separator
        backgroundColor: '#f8f9fa', // Light background for controls area
        fontFamily: fontFamily,
    };

    const buttonStyle = {
        padding: '8px 15px',
        cursor: 'pointer',
        border: '1px solid #ccc',
        borderRadius: '4px',
        backgroundColor: '#fff',
        fontSize: '14px',
        transition: 'background-color 0.2s',
        fontFamily: fontFamily,
    };

    const selectStyle = {
        padding: '8px 10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '14px',
        minWidth: '150px', // Give dropdowns some minimum width
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
        flex: '0 0 300px', // Fixed width for the image container
        textAlign: 'center', // Center image if container is wider
        position: 'relative', // Add this to allow absolute positioning within
        fontFamily: fontFamily,
    };

    const imageStyle = {
        maxWidth: '100%',      // Make image responsive within its container
        height: 'auto',
        borderRadius: '8px',
        display: 'block',      // Remove extra space below image
        margin: '0 auto',      // Center image within its container
        transform: 'scaleX(-1)', // ← flip horizontally so the character faces right
        opacity: 0.6,             // Drop opacity (0.0 to 1.0)
    };

    // New styles for robot clickable areas
    const robotHeadStyle = {
        position: 'absolute',
        top: '5%',            // ← Adjust this value to move up/down
        left: '0%',           // ← Adjust this value to move left/right
        width: '100%',          // ← Adjust width of the clickable area
        height: '30%',         // ← Adjust height of the clickable area
        border: '2px dashed rgba(128, 128, 128, 0.5)',
        borderRadius: '15px',
        cursor: 'pointer',     // Show pointing hand on hover
        backgroundColor: 'rgba(128, 128, 128, 0.15)', // Very light grey background
        display: 'flex',
        justifyContent: 'flex-start', // Align to start (left)
        alignItems: 'flex-start', // Align to start (top)
        padding: '10px', // Add padding to prevent text touching the border
        color: 'rgba(128, 128, 128, 0.7)',
        fontWeight: 'bold',
        fontSize: '14px',
        transition: 'all 0.3s ease', // Smooth transition for hover effect
        fontFamily: fontFamily,
    };

    const robotBodyStyle = {
        position: 'absolute',
        top: '40%',            // ← Adjust this value to move up/down
        left: '0%',           // ← Adjust this value to move left/right
        width: '100%',          // ← Adjust width of the clickable area
        height: '55%',         // ← Adjust height of the clickable area
        border: '2px dashed rgba(128, 128, 128, 0.5)',
        borderRadius: '10px',
        cursor: 'pointer',     // Show pointing hand on hover
        backgroundColor: 'rgba(128, 128, 128, 0.15)', // Very light grey background
        display: 'flex',
        justifyContent: 'flex-start', // Align to start (left)
        alignItems: 'flex-start', // Align to start (top)
        padding: '10px', // Add padding to prevent text touching the border
        color: 'rgba(128, 128, 128, 0.7)',
        fontWeight: 'bold',
        fontSize: '14px',
        transition: 'all 0.3s ease', // Smooth transition for hover effect
        fontFamily: fontFamily,
    };

    const mapContainerStyle = {
        flex: 1,      // Map takes remaining space
        minWidth: 0,  // Prevent map from overflowing flex container
        fontFamily: fontFamily,
    };

    // Add a global style for app-wide font family
    const appStyle = {
        fontFamily: fontFamily,
    };

    // Update connection type info style
    const connectionInfoStyle = {
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '5px 10px',
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: fontFamily,
    };

    return (
        <div className="App" style={appStyle}>
            <header style={headerStyle}>
                <h1>Humanoid Robot Supply Chain</h1>
            </header>

            {/* --- Main Content Area (Image + Map) --- */}
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
                        title="Click to change arrow direction"
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
                        Head: Direction
                    </div>

                    {/* Clickable Robot Body Area */}
                    <div
                        style={robotBodyStyle}
                        onClick={handleBodyClick}
                        title="Click to change map theme and connection"
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
                        Body: Theme & Connection
                    </div>

                    {/* Removed connection type info that was displayed */}

                </div>

                {/* Map Container */}
                <div style={mapContainerStyle}>
                    <WorldMap
                        // Pass the new state variables to control the map
                        theme={mapTheme}
                        arrowDirection={arrowDirection}
                        selectedDataset={selectedDataset}
                        selectedOption={selectedOption}
                        connectionType={connectionType} // Pass the connectionType directly as a prop
                        onConnectionTypeChange={handleConnectionTypeChange}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;