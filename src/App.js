import React, { useState } from 'react';
import WorldMap from './WorldMap';

function App() {
    // State for category selection
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Event handler for category change
    const handleCategoryChange = (event) => {
        console.log('Selected Category:', event.target.value);
        setSelectedCategory(event.target.value);
    };

    // Base font style
    const fontFamily = '"Helvetica Neue", Helvetica, Arial, sans-serif';

    // Styles
    const appStyle = {
        fontFamily: fontFamily,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
    };

    const headerStyle = {
        padding: '15px 20px',
        borderBottom: '1px solid #eee',
        backgroundColor: '#f8f9fa',
    };

    const controlsContainerStyle = {
        padding: '10px 20px',
        display: 'flex',
        gap: '15px',
        alignItems: 'center',
        flexWrap: 'wrap',
        borderBottom: '1px solid #eee',
        backgroundColor: '#f8f9fa',
    };

    const selectStyle = {
        padding: '8px 10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '14px',
        minWidth: '150px',
    };

    const labelStyle = {
        marginRight: '5px',
        fontSize: '14px',
        fontWeight: '500',
    };

    const mapContainerStyle = {
        flex: 1,
        width: '100%',
        position: 'relative',
    };

    // Get category description
    const getCategoryDescription = () => {
        switch (selectedCategory) {
            case 'Brain':
                return 'Companies focused on software, AI, sensors, and computational hardware';
            case 'Body':
                return 'Companies manufacturing physical components like motors, batteries, and actuators';
            case 'Integrator':
                return 'Companies that assemble complete robotic systems and end products';
            default:
                return 'All robotics companies across categories';
        }
    };

    return (
        <div className="App" style={appStyle}>
            <header style={headerStyle}>
                <h1>Global Robotics Companies Visualization</h1>
                <p style={{ margin: '5px 0 0', color: '#666' }}>
                    Market capitalization data for individual robotics companies by category and country
                </p>
            </header>

            {/* Controls Container */}
            <div style={controlsContainerStyle}>
                <div>
                    <span style={labelStyle}>Category:</span>
                    <select
                        style={selectStyle}
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                    >
                        <option value="All">All Categories</option>
                        <option value="Brain">Brain</option>
                        <option value="Body">Body</option>
                        <option value="Integrator">Integrator</option>
                    </select>
                </div>

                <div style={{ marginLeft: 'auto', fontSize: '14px' }}>
                    <strong>Current View:</strong> {selectedCategory} - {getCategoryDescription()}
                </div>
            </div>

            {/* Information Panel */}
            <div style={{
                padding: '8px 20px',
                backgroundColor: '#f0f9ff',
                borderBottom: '1px solid #bae6fd',
                fontSize: '14px'
            }}>
                <p style={{ margin: 0 }}>
                    <strong>How to use:</strong> Hover over bubbles to see details about individual companies.
                    Each bubble represents a company, with size indicating market capitalization.
                    Colors indicate company category: <span style={{ color: '#dc2626' }}>Brain</span> (red),
                    <span style={{ color: '#16a34a' }}> Body</span> (green), or
                    <span style={{ color: '#ca8a04' }}> Integrator</span> (yellow).
                </p>
            </div>

            {/* Full Page Map Container */}
            <div style={mapContainerStyle}>
                <WorldMap selectedCategory={selectedCategory} />
            </div>
        </div>
    );
}

export default App;