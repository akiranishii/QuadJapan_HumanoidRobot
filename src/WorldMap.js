import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

const WorldMap = ({ theme = 'default', arrowDirection = 'us-to-jp', selectedDataset, selectedOption, connectionType = 'japan-us', onThemeChange, onConnectionTypeChange }) => {
    const svgRef = useRef(null);
    const [tooltipContent, setTooltipContent] = useState('');
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [showTooltip, setShowTooltip] = useState(false);
    const [mapError, setMapError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    // Use the connectionType prop instead of internal state
    // const [connectionType, setConnectionType] = useState('japan-us'); // 'japan-us' or 'china-us'

    // The theme is fixed to 'default' regardless of what's passed in
    const fixedTheme = 'default';

    // Re-render map when theme or arrowDirection changes
    useEffect(() => {
        console.log("Direction changed to:", arrowDirection, "Theme:", theme, "Connection:", connectionType);
        renderMap();
    }, [theme, arrowDirection, connectionType, selectedDataset, selectedOption]);

    // Expose toggle function to parent component
    useEffect(() => {
        if (onConnectionTypeChange) {
            // Provide the parent with the toggle function
            onConnectionTypeChange(toggleConnection);
        }
    }, []);

    const getThemeColors = () => {
        // Always use default theme colors regardless of theme prop
        return {
            background: '#ffffff',
            land: '#f9fafb',
            border: '#d1d5db',
            connection: '#6b7280',
            node: '#6b7280'
        };
    };

    const renderMap = async () => {
        const viewW = 960,
            viewH = 500;

        const svg = d3
            .select(svgRef.current)
            .attr('viewBox', `0 0 ${viewW} ${viewH}`)
            .attr('preserveAspectRatio', 'xMidYMid meet');

        svg.selectAll('*').remove();

        try {
            const resp = await fetch('https://unpkg.com/world-atlas@2/countries-110m.json');
            if (!resp.ok) throw new Error(`Status ${resp.status}`);
            const world = await resp.json();

            let countries = topojson
                .feature(world, world.objects.countries)
                .features
                .filter(d => {
                    // ditch Antarctica
                    if (d.id === 10 || d.id === 170) return false;
                    if (d.properties?.name?.match(/Antarct/)) return false;
                    const hasBelow = coords =>
                        Array.isArray(coords[0])
                            ? coords.some(hasBelow)
                            : coords[1] < -60;
                    return !hasBelow(d.geometry.coordinates);
                });

            // Get theme colors
            const colors = getThemeColors();

            // ─── Filters ─────────────────────────────────────────────────────────────
            const defs = svg.append('defs');

            // drop shadow
            const drop = defs
                .append('filter').attr('id', 'drop-shadow')
                .attr('x', '-20%').attr('y', '-20%')
                .attr('width', '140%').attr('height', '140%');
            drop.append('feGaussianBlur')
                .attr('in', 'SourceAlpha')
                .attr('stdDeviation', 5)
                .attr('result', 'blur');
            drop.append('feOffset')
                .attr('in', 'blur').attr('dx', 3).attr('dy', 3)
                .attr('result', 'offsetBlur');
            drop.append('feFlood')
                .attr('flood-color', '#000').attr('flood-opacity', 0.1)
                .attr('result', 'colorBlur');
            drop.append('feComposite')
                .attr('in', 'colorBlur')
                .attr('in2', 'offsetBlur')
                .attr('operator', 'in')
                .attr('result', 'shadow');
            const m1 = drop.append('feMerge');
            m1.append('feMergeNode').attr('in', 'shadow');
            m1.append('feMergeNode').attr('in', 'SourceGraphic');

            // glow
            const glow = defs
                .append('filter').attr('id', 'glow')
                .attr('x', '-50%').attr('y', '-50%')
                .attr('width', '200%').attr('height', '200%');
            glow.append('feGaussianBlur')
                .attr('stdDeviation', 3)
                .attr('result', 'coloredBlur');
            const m2 = glow.append('feMerge');
            m2.append('feMergeNode').attr('in', 'coloredBlur');
            m2.append('feMergeNode').attr('in', 'SourceGraphic');

            // Add gradient definitions for connection outlines
            const outlineGradient = defs.append("linearGradient")
                .attr("id", "outline-gradient")
                .attr("gradientUnits", "userSpaceOnUse");

            // Set gradient colors - red to blue for outline
            outlineGradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", "#ef4444"); // Red

            outlineGradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", "#3b82f6"); // Blue

            // Add marker definitions for arrows - small black arrow
            defs.append("marker")
                .attr("id", "arrow")
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 25)
                .attr("refY", 0)
                .attr("markerWidth", 10)
                .attr("markerHeight", 10)
                .attr("orient", "auto")
                .append("path")
                .attr("d", "M0,-5L10,0L0,5")
                .attr("fill", "#000000"); // Black arrow

            // ─── Background ─────────────────────────────────────────────────────────
            svg
                .append('rect')
                .attr('width', viewW)
                .attr('height', viewH)
                .attr('fill', colors.background);

            // ─── Projection ─────────────────────────────────────────────────────────
            const projection = d3
                .geoEquirectangular()
                .precision(0.1);
            projection.fitSize([viewW, viewH], {
                type: 'FeatureCollection',
                features: countries
            });
            const path = d3.geoPath().projection(projection);

            // ─── Countries ──────────────────────────────────────────────────────────
            const g = svg.append('g').attr('filter', 'url(#drop-shadow)');
            g.selectAll('path.country')
                .data(countries)
                .enter()
                .append('path')
                .attr('class', 'country')
                .attr('d', path)
                .attr('fill', colors.land)
                .attr('stroke', colors.border)
                .attr('stroke-width', 0.5)
                .on('mouseover', (e, d) => {
                    // Darken the highlighted country a bit
                    const highlightColor = theme === 'default' ? '#e5e7eb' : d3.color(colors.land).darker(0.3);
                    d3.select(e.currentTarget).attr('fill', highlightColor);
                    // Removed tooltip functionality
                })
                .on('mouseout', e => {
                    d3.select(e.currentTarget).attr('fill', colors.land);
                    // Removed tooltip functionality
                });

            // ─── Connection + Labels ─────────────────────────────────────────────────
            // Define coordinates based on arrow direction and connection type
            let sourceCoords, targetCoords, sourceLabel, targetLabel;

            console.log("Rendering map with direction:", arrowDirection, "and connection:", connectionType);

            // US coordinates
            const usCoords = projection([-95.7129, 37.0902]);
            // Japan coordinates
            const jpCoords = projection([138.2529, 36.2048]);
            // China coordinates
            const cnCoords = projection([104.1954, 35.8617]);

            if (connectionType === 'japan-us') {
                if (arrowDirection === 'us-to-jp') {
                    sourceCoords = usCoords;
                    targetCoords = jpCoords;
                    sourceLabel = "United States";
                    targetLabel = "Japan";
                } else { // jp-to-us
                    sourceCoords = jpCoords;
                    targetCoords = usCoords;
                    sourceLabel = "Japan";
                    targetLabel = "United States";
                }
            } else { // china-us connection
                if (arrowDirection === 'us-to-jp') { // we'll interpret this as us-to-cn 
                    sourceCoords = usCoords;
                    targetCoords = cnCoords;
                    sourceLabel = "United States";
                    targetLabel = "China";
                } else { // cn-to-us
                    sourceCoords = cnCoords;
                    targetCoords = usCoords;
                    sourceLabel = "China";
                    targetLabel = "United States";
                }
            }

            // Create connection points and define the connections we want to draw
            const connections = [
                {
                    source: sourceCoords,
                    target: targetCoords,
                    sourceLabel: sourceLabel,
                    targetLabel: targetLabel
                }
            ];

            // Create a group for connections
            const connectionsGroup = svg.append('g')
                .attr('class', 'connections');

            // Create curved connection paths with gradients and arrows
            connections.forEach(conn => {
                // Update gradient coordinates for this specific connection
                outlineGradient
                    .attr("x1", conn.source[0])
                    .attr("y1", conn.source[1])
                    .attr("x2", conn.target[0])
                    .attr("y2", conn.target[1]);

                // Calculate control point for the curved path
                const dx = conn.target[0] - conn.source[0];
                const dy = conn.target[1] - conn.source[1];
                const dr = Math.sqrt(dx * dx + dy * dy);

                // Determine if we should curve up or down based on connection direction
                const curveDirection = dx > 0 ? -1 : 1; // Curve up if going east, down if going west

                // Calculate control points for a quadratic curve
                const cpX = (conn.source[0] + conn.target[0]) / 2;
                const cpY = (conn.source[1] + conn.target[1]) / 2 + (curveDirection * dr * 0.2);

                // Create the SVG path for a quadratic Bezier curve
                const pathData = `M${conn.source[0]},${conn.source[1]} Q${cpX},${cpY} ${conn.target[0]},${conn.target[1]}`;

                // Generate points for the tapered path
                const generateTaperedPath = () => {
                    const segments = 100; // Number of segments to create smooth taper
                    const startWidth = 1; // Width at the source (thinner)
                    const endWidth = 10;   // Width at the target (thicker)
                    const path = [];

                    // Generate points for the top edge of the path
                    for (let i = 0; i <= segments; i++) {
                        const t = i / segments;
                        // Quadratic Bezier equation: (1-t)²P₀ + 2(1-t)tP₁ + t²P₂
                        const x = Math.pow(1 - t, 2) * conn.source[0] +
                            2 * (1 - t) * t * cpX +
                            Math.pow(t, 2) * conn.target[0];
                        const y = Math.pow(1 - t, 2) * conn.source[1] +
                            2 * (1 - t) * t * cpY +
                            Math.pow(t, 2) * conn.target[1];

                        // Calculate the current width based on position
                        const width = startWidth + (endWidth - startWidth) * t;

                        // Calculate normal vector to the curve at this point
                        // Derivative of quadratic Bezier curve: 2(1-t)(P₁-P₀) + 2t(P₂-P₁)
                        const dx = 2 * (1 - t) * (cpX - conn.source[0]) + 2 * t * (conn.target[0] - cpX);
                        const dy = 2 * (1 - t) * (cpY - conn.source[1]) + 2 * t * (conn.target[1] - cpY);

                        // Normalize the derivative
                        const length = Math.sqrt(dx * dx + dy * dy);
                        const nx = -dy / length; // Normal x component (perpendicular to tangent)
                        const ny = dx / length;  // Normal y component

                        // Points for top and bottom edges
                        const halfWidth = width / 2;
                        path.push({
                            t: t,
                            top: [x + nx * halfWidth, y + ny * halfWidth],
                            bottom: [x - nx * halfWidth, y - ny * halfWidth],
                            center: [x, y]
                        });
                    }

                    return path;
                };

                const taperedPoints = generateTaperedPath();

                // Create SVG path commands for the tapered shape
                let taperedPathData = `M${taperedPoints[0].top[0]},${taperedPoints[0].top[1]}`;

                // Add all points for the top side
                for (let i = 1; i < taperedPoints.length; i++) {
                    taperedPathData += ` L${taperedPoints[i].top[0]},${taperedPoints[i].top[1]}`;
                }

                // Reverse through points for bottom side
                for (let i = taperedPoints.length - 1; i >= 0; i--) {
                    taperedPathData += ` L${taperedPoints[i].bottom[0]},${taperedPoints[i].bottom[1]}`;
                }

                // Close the path
                taperedPathData += ' Z';

                // Create the tapered path with gradient fill
                const taperedPath = connectionsGroup.append('path')
                    .attr('d', taperedPathData)
                    .attr('fill', 'url(#outline-gradient)')
                    .attr('stroke', 'none')
                    .attr('opacity', 0.7);

                // Create the center line - thinner black line along the center of the tapered path
                const centerLineData = taperedPoints.map(p => `${p.center[0]},${p.center[1]}`).join(' L');
                const centerLine = connectionsGroup.append('path')
                    .attr('d', `M${centerLineData}`)
                    .attr('fill', 'none')
                    .attr('stroke', '#000000')
                    .attr('stroke-width', 1.5)
                    .attr('marker-end', 'url(#arrow)');

                // Add country labels with seamless white background
                const addCountryLabel = (x, y, text) => {
                    // Create a group for the text and background
                    const labelGroup = connectionsGroup.append('g');

                    // Create a background measurement text element to calculate width
                    const measureText = labelGroup.append('text')
                        .attr('font-family', 'Helvetica, Arial, sans-serif')
                        .attr('font-size', '12px')
                        .attr('font-weight', 'bold')
                        .text(text)
                        .attr('visibility', 'hidden'); // Hide it, just for measurement

                    // Calculate text dimensions
                    let textWidth, textHeight;
                    try {
                        const bbox = measureText.node().getBBox();
                        textWidth = bbox.width;
                        textHeight = bbox.height;
                        measureText.remove(); // Remove the measurement element
                    } catch (e) {
                        // Fallback if getBBox fails
                        textWidth = text.length * 7;
                        textHeight = 12;
                        if (measureText) measureText.remove();
                    }

                    // Add extra padding
                    const padding = 4;

                    // Create white background with no border and slight blur for a smoother effect
                    labelGroup.append('rect')
                        .attr('x', x - (textWidth / 2) - padding)
                        .attr('y', y - (textHeight / 2) - padding)
                        .attr('width', textWidth + (padding * 2))
                        .attr('height', textHeight + (padding * 2))
                        .attr('rx', 4) // Rounded corners
                        .attr('ry', 4)
                        .attr('fill', 'white')
                        .attr('stroke', 'none') // No border
                        .attr('filter', 'blur(1px)'); // Slight blur for softer edges

                    // Create text element with Helvetica font
                    labelGroup.append('text')
                        .attr('x', x)
                        .attr('y', y) // Exactly at the connection point where node was
                        .attr('text-anchor', 'middle')
                        .attr('dominant-baseline', 'middle') // Center vertically too
                        .attr('font-family', 'Helvetica, Arial, sans-serif')
                        .attr('font-size', '12px')
                        .attr('font-weight', 'bold')
                        .attr('pointer-events', 'none') // Prevent interfering with mouse events
                        .attr('fill', '#000')
                        .text(text);
                };

                // Add labels for source and target at exact connection points
                addCountryLabel(conn.source[0], conn.source[1], conn.sourceLabel);
                addCountryLabel(conn.target[0], conn.target[1], conn.targetLabel);
            });

            // Removed connection info text that was previously displayed at the bottom of the map

            setIsLoading(false);
        } catch (err) {
            setMapError(err.message);
            setIsLoading(false);
        }
    };

    // ─── Styles ───────────────────────────────────────────────────────────────
    const containerStyle = {
        width: '100%',
        aspectRatio: '960 / 500',  // ensures correct aspect
        position: 'relative'
    };
    const svgStyle = {
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '100%'
    };
    const loadingStyle = {
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)'
    };
    const errorStyle = {
        ...loadingStyle, backgroundColor: '#f3f4f6'
    };
    const errorContent = {
        color: '#b91c1c', textAlign: 'center', padding: '16px'
    };
    const tooltipStyle = {
        position: 'absolute',
        left: tooltipPosition.x + 10,
        top: tooltipPosition.y - 10,
        backgroundColor: 'rgba(0,0,0,0.75)',
        color: '#fff',
        padding: '5px 10px',
        borderRadius: '4px',
        fontSize: '14px',
        pointerEvents: 'none',
        opacity: 0, // Always hide tooltip
        transition: 'opacity 0.2s',
        zIndex: 1000
    };

    // Toggle connection function - simply notify parent instead of managing internal state
    const toggleConnection = () => {
        if (onConnectionTypeChange) {
            const newType = connectionType === 'japan-us' ? 'china-us' : 'japan-us';
            // We don't update state here anymore, just notify the parent
            onConnectionTypeChange(newType);
            console.log("Notifying parent to toggle connection type to:", newType);
        }
    };

    return (
        <div style={containerStyle}>
            {isLoading && <div style={loadingStyle}>Loading map…</div>}
            {mapError && (
                <div style={errorStyle}>
                    <div style={errorContent}>
                        <strong>Error:</strong> {mapError}
                    </div>
                </div>
            )}
            <svg ref={svgRef} style={svgStyle} />
            <div style={tooltipStyle}>{tooltipContent}</div>
        </div>
    );
};

export default WorldMap;