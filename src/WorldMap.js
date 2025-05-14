import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

const WorldMap = ({ theme = 'default', selectedDataset, selectedOption }) => {
    const svgRef = useRef(null);
    const [tooltipContent, setTooltipContent] = useState('');
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [showTooltip, setShowTooltip] = useState(false);
    const [mapError, setMapError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // The theme is fixed to 'default' regardless of what's passed in
    const fixedTheme = 'default';

    // Re-render map when theme or dataset changes
    useEffect(() => {
        console.log("Dataset changed to:", selectedDataset, "Option:", selectedOption);
        renderMap();
    }, [theme, selectedDataset, selectedOption]);

    const getThemeColors = () => {
        // Always use default theme colors regardless of theme prop
        return {
            background: '#ffffff',
            land: '#f9fafb',
            border: '#d1d5db',
            bubbleStroke: '#3b82f6', // Blue outline
            bubbleFill: 'rgba(59, 130, 246, 0.5)' // Semi-transparent blue fill
        };
    };

    // Sample data for bubble chart - replace with your actual data
    // Each country should have a value that determines bubble size
    const getBubbleData = () => {
        // This function would ideally fetch or process real data
        // For now, we'll use sample data

        // Different datasets based on selection
        if (selectedDataset === 'datasetA') {
            return [
                { country: "United States", value: 100, code: "USA", coordinates: [-95.7129, 37.0902] },
                { country: "Japan", value: 65, code: "JPN", coordinates: [138.2529, 36.2048] },
                { country: "China", value: 140, code: "CHN", coordinates: [104.1954, 35.8617] },
                { country: "Germany", value: 50, code: "DEU", coordinates: [10.4515, 51.1657] },
                { country: "Brazil", value: 45, code: "BRA", coordinates: [-53.0, -10.0] },
                { country: "India", value: 90, code: "IND", coordinates: [78.9629, 20.5937] },
                { country: "Australia", value: 35, code: "AUS", coordinates: [133.7751, -25.2744] },
                { country: "South Korea", value: 40, code: "KOR", coordinates: [127.7669, 35.9078] },
                { country: "United Kingdom", value: 55, code: "GBR", coordinates: [-3.4360, 55.3781] },
                { country: "France", value: 45, code: "FRA", coordinates: [2.2137, 46.2276] }
            ];
        } else {
            return [
                { country: "United States", value: 85, code: "USA", coordinates: [-95.7129, 37.0902] },
                { country: "Japan", value: 95, code: "JPN", coordinates: [138.2529, 36.2048] },
                { country: "China", value: 110, code: "CHN", coordinates: [104.1954, 35.8617] },
                { country: "Germany", value: 75, code: "DEU", coordinates: [10.4515, 51.1657] },
                { country: "Brazil", value: 25, code: "BRA", coordinates: [-53.0, -10.0] },
                { country: "India", value: 60, code: "IND", coordinates: [78.9629, 20.5937] },
                { country: "Australia", value: 55, code: "AUS", coordinates: [133.7751, -25.2744] },
                { country: "South Korea", value: 80, code: "KOR", coordinates: [127.7669, 35.9078] },
                { country: "United Kingdom", value: 40, code: "GBR", coordinates: [-3.4360, 55.3781] },
                { country: "France", value: 70, code: "FRA", coordinates: [2.2137, 46.2276] }
            ];
        }
    };

    // Get the metric label based on the selected option
    const getMetricLabel = () => {
        switch (selectedOption) {
            case 'option1':
                return 'Robot Production';
            case 'option2':
                return 'AI Development';
            case 'option3':
                return 'Market Size';
            default:
                return 'Value';
        }
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

            // glow effect for bubbles
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
                })
                .on('mouseout', e => {
                    d3.select(e.currentTarget).attr('fill', colors.land);
                });

            // ─── Bubble Chart Overlay ────────────────────────────────────────────────
            // Get bubble data
            const bubbleData = getBubbleData();

            // Calculate bubble sizes - scale values to reasonable bubble sizes
            const valueExtent = d3.extent(bubbleData, d => d.value);
            const bubbleScale = d3.scaleSqrt()
                .domain(valueExtent)
                .range([10, 40]); // Increased min and max bubble radius for better visibility

            // Create a new group for bubbles
            const bubbleGroup = svg.append('g')
                .attr('class', 'bubbles');

            // Add bubbles with animations
            bubbleGroup.selectAll('circle')
                .data(bubbleData)
                .enter()
                .append('circle')
                .attr('cx', d => projection(d.coordinates)[0])
                .attr('cy', d => projection(d.coordinates)[1])
                .attr('r', 0) // Start with radius 0 for animation
                .attr('fill', d => {
                    // Use different colors based on value ranges
                    const normalized = (d.value - valueExtent[0]) / (valueExtent[1] - valueExtent[0]);
                    if (normalized < 0.33) return 'rgba(74, 222, 128, 0.6)'; // Green for low values
                    if (normalized < 0.66) return 'rgba(250, 204, 21, 0.6)'; // Yellow for medium values
                    return 'rgba(248, 113, 113, 0.6)'; // Red for high values
                })
                .attr('stroke', d => {
                    // Matching darker stroke colors
                    const normalized = (d.value - valueExtent[0]) / (valueExtent[1] - valueExtent[0]);
                    if (normalized < 0.33) return '#16a34a'; // Darker green
                    if (normalized < 0.66) return '#ca8a04'; // Darker yellow
                    return '#dc2626'; // Darker red
                })
                .attr('stroke-width', 2)
                .attr('filter', 'url(#glow)')
                .attr('opacity', 0.8)
                .on('mouseover', function (e, d) {
                    // Highlight bubble on hover
                    d3.select(this)
                        .attr('stroke-width', 3)
                        .attr('opacity', 1);

                    // Show tooltip
                    setTooltipContent(`${d.country}: ${d.value} ${getMetricLabel()}`);
                    setTooltipPosition({ x: e.pageX, y: e.pageY });
                    setShowTooltip(true);
                })
                .on('mouseout', function () {
                    // Reset bubble appearance
                    d3.select(this)
                        .attr('stroke-width', 2)
                        .attr('opacity', 0.8);

                    // Hide tooltip
                    setShowTooltip(false);
                })
                .transition()
                .duration(1000)
                .attr('r', d => bubbleScale(d.value));

            // Add country labels near bubbles
            bubbleGroup.selectAll('text')
                .data(bubbleData)
                .enter()
                .append('text')
                .attr('x', d => projection(d.coordinates)[0])
                .attr('y', d => projection(d.coordinates)[1] + bubbleScale(d.value) + 10)
                .attr('text-anchor', 'middle')
                .attr('font-family', 'Helvetica, Arial, sans-serif')
                .attr('font-size', '10px')
                .attr('font-weight', 'bold')
                .attr('fill', '#333')
                .text(d => d.country)
                .each(function (d) {
                    // Create a background for the text for better readability
                    const bbox = this.getBBox();
                    const padding = 2;

                    const rect = bubbleGroup.insert('rect', 'text')
                        .attr('x', bbox.x - padding)
                        .attr('y', bbox.y - padding)
                        .attr('width', bbox.width + (padding * 2))
                        .attr('height', bbox.height + (padding * 2))
                        .attr('fill', 'white')
                        .attr('opacity', 0.7)
                        .attr('rx', 2);
                });

            // Add legend
            const legendGroup = svg.append('g')
                .attr('class', 'legend')
                .attr('transform', `translate(20, ${viewH - 120})`);

            // Legend background
            legendGroup.append('rect')
                .attr('x', -10)
                .attr('y', -15)
                .attr('width', 250)
                .attr('height', 110)
                .attr('fill', 'white')
                .attr('opacity', 0.9)
                .attr('rx', 5)
                .attr('ry', 5)
                .attr('stroke', '#d1d5db')
                .attr('stroke-width', 1);

            // Legend title
            legendGroup.append('text')
                .attr('x', 0)
                .attr('y', 0)
                .attr('font-family', 'Helvetica, Arial, sans-serif')
                .attr('font-size', '14px')
                .attr('font-weight', 'bold')
                .text(getMetricLabel());

            // Legend bubbles - use the same color scheme as the bubbles
            const legendValues = [valueExtent[0], (valueExtent[0] + valueExtent[1]) / 2, valueExtent[1]];

            legendValues.forEach((value, i) => {
                const cy = 40;
                const cx = i * 80 + 30;

                // Calculate normalized value for color
                const normalized = (value - valueExtent[0]) / (valueExtent[1] - valueExtent[0]);
                let fillColor, strokeColor;

                if (normalized < 0.33) {
                    fillColor = 'rgba(74, 222, 128, 0.6)';
                    strokeColor = '#16a34a';
                } else if (normalized < 0.66) {
                    fillColor = 'rgba(250, 204, 21, 0.6)';
                    strokeColor = '#ca8a04';
                } else {
                    fillColor = 'rgba(248, 113, 113, 0.6)';
                    strokeColor = '#dc2626';
                }

                // Add bubble
                legendGroup.append('circle')
                    .attr('cx', cx)
                    .attr('cy', cy)
                    .attr('r', bubbleScale(value))
                    .attr('fill', fillColor)
                    .attr('stroke', strokeColor)
                    .attr('stroke-width', 2);

                // Add value label
                legendGroup.append('text')
                    .attr('x', cx)
                    .attr('y', cy + bubbleScale(value) + 15)
                    .attr('text-anchor', 'middle')
                    .attr('font-family', 'Helvetica, Arial, sans-serif')
                    .attr('font-size', '12px')
                    .text(value);
            });

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
        opacity: showTooltip ? 1 : 0,
        transition: 'opacity 0.2s',
        zIndex: 1000
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