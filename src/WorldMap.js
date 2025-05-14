import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import Papa from 'papaparse';

const WorldMap = ({ selectedCategory }) => {
    const svgRef = useRef(null);
    const [tooltipContent, setTooltipContent] = useState('');
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [showTooltip, setShowTooltip] = useState(false);
    const [mapError, setMapError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);

    // Format market cap values for display
    const formatMarketCap = (value) => {
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}T`;
        } else if (value >= 1000) {
            return `${(value / 1000).toFixed(1)}B`;
        } else {
            return `$${value}M`;
        }
    };

    // Load the CSV data once on component mount
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);

            try {
                // Try multiple possible paths for the CSV file
                const paths = [
                    './public/data/full_dataset.csv',
                    '../data/full_dataset.csv',
                    './data/full_dataset.csv',
                    '/data/full_dataset.csv',
                    'full_dataset.csv',
                    // Add the path that matches your project structure
                    '/public/data/full_dataset.csv'
                ];

                let fileContent = null;
                let loadError = null;
                let successPath = null;

                // Try each path until we successfully load the file
                for (const path of paths) {
                    try {
                        console.log(`Attempting to load from: ${path}`);
                        fileContent = await window.fs.readFile(path, { encoding: 'utf8' });
                        successPath = path;
                        console.log(`Successfully loaded from: ${path}`);
                        break; // Exit the loop if successful
                    } catch (err) {
                        loadError = err;
                        console.warn(`Failed to load from ${path}:`, err.message);
                    }
                }

                if (!fileContent) {
                    console.warn('Using fallback data as CSV could not be loaded');
                    // Create sample fallback data so the visualization still works
                    const fallbackData = [
                        { "Company": "Palantir", "Country": "USA", "Mkt Cap ($mn)": 236526, "Category": "Brain" },
                        { "Company": "Oracle", "Country": "USA", "Mkt Cap ($mn)": 469582, "Category": "Brain" },
                        { "Company": "Microsoft", "Country": "USA", "Mkt Cap ($mn)": 3065550, "Category": "Brain" },
                        { "Company": "NVIDIA", "Country": "USA", "Mkt Cap ($mn)": 2905739, "Category": "Brain" },
                        { "Company": "TSMC", "Country": "Taiwan", "Mkt Cap ($mn)": 1058181, "Category": "Brain" },
                        { "Company": "Samsung", "Country": "Korea", "Mkt Cap ($mn)": 244701, "Category": "Brain" },
                        { "Company": "Siemens", "Country": "Germany", "Mkt Cap ($mn)": 164454, "Category": "Brain" },
                        { "Company": "Honeywell", "Country": "USA", "Mkt Cap ($mn)": 145963, "Category": "Body" },
                        { "Company": "Timken", "Country": "USA", "Mkt Cap ($mn)": 5533, "Category": "Body" },
                        { "Company": "CATL", "Country": "China", "Mkt Cap ($mn)": 155380, "Category": "Body" },
                        { "Company": "Nidec", "Country": "Japan", "Mkt Cap ($mn)": 19028, "Category": "Body" },
                        { "Company": "Tesla", "Country": "USA", "Mkt Cap ($mn)": 1261551, "Category": "Integrator" },
                        { "Company": "Apple", "Country": "USA", "Mkt Cap ($mn)": 3497145, "Category": "Integrator" },
                        { "Company": "Tencent", "Country": "China", "Mkt Cap ($mn)": 491611, "Category": "Integrator" },
                        { "Company": "Toyota", "Country": "Japan", "Mkt Cap ($mn)": 243296, "Category": "Integrator" },
                        { "Company": "ABB", "Country": "Switzerland", "Mkt Cap ($mn)": 100438, "Category": "Integrator" }
                    ];
                    setData(fallbackData);
                    renderMap(fallbackData);
                    return;
                }

                const parsedData = Papa.parse(fileContent, {
                    header: true,
                    dynamicTyping: true,
                    skipEmptyLines: true
                });

                console.log(`Loaded ${parsedData.data.length} records from dataset at ${successPath}`);
                setData(parsedData.data);
                renderMap(parsedData.data);
            } catch (error) {
                console.error('Error loading data:', error);

                // Create fallback data if there's an error
                console.warn('Using fallback data due to error:', error.message);
                const fallbackData = [
                    { "Company": "Palantir", "Country": "USA", "Mkt Cap ($mn)": 236526, "Category": "Brain" },
                    { "Company": "Oracle", "Country": "USA", "Mkt Cap ($mn)": 469582, "Category": "Brain" },
                    { "Company": "Microsoft", "Country": "USA", "Mkt Cap ($mn)": 3065550, "Category": "Brain" },
                    { "Company": "NVIDIA", "Country": "USA", "Mkt Cap ($mn)": 2905739, "Category": "Brain" },
                    { "Company": "TSMC", "Country": "Taiwan", "Mkt Cap ($mn)": 1058181, "Category": "Brain" },
                    { "Company": "Samsung", "Country": "Korea", "Mkt Cap ($mn)": 244701, "Category": "Brain" },
                    { "Company": "Siemens", "Country": "Germany", "Mkt Cap ($mn)": 164454, "Category": "Brain" },
                    { "Company": "Honeywell", "Country": "USA", "Mkt Cap ($mn)": 145963, "Category": "Body" },
                    { "Company": "Timken", "Country": "USA", "Mkt Cap ($mn)": 5533, "Category": "Body" },
                    { "Company": "CATL", "Country": "China", "Mkt Cap ($mn)": 155380, "Category": "Body" },
                    { "Company": "Nidec", "Country": "Japan", "Mkt Cap ($mn)": 19028, "Category": "Body" },
                    { "Company": "Tesla", "Country": "USA", "Mkt Cap ($mn)": 1261551, "Category": "Integrator" },
                    { "Company": "Apple", "Country": "USA", "Mkt Cap ($mn)": 3497145, "Category": "Integrator" },
                    { "Company": "Tencent", "Country": "China", "Mkt Cap ($mn)": 491611, "Category": "Integrator" },
                    { "Company": "Toyota", "Country": "Japan", "Mkt Cap ($mn)": 243296, "Category": "Integrator" },
                    { "Company": "ABB", "Country": "Switzerland", "Mkt Cap ($mn)": 100438, "Category": "Integrator" }
                ];
                setData(fallbackData);
                renderMap(fallbackData);

                // Set a warning instead of error
                setMapError(`Note: Using sample data. Original error: ${error.message}`);
            }
        };

        loadData();
    }, []);

    // Re-render map when category changes
    useEffect(() => {
        if (data.length > 0) {
            renderMap(data);
        }
    }, [selectedCategory, data]);

    const getThemeColors = () => {
        return {
            background: '#ffffff',
            land: '#f9fafb',
            border: '#d1d5db',
            bubbleStroke: '#3b82f6',
            bubbleFill: 'rgba(59, 130, 246, 0.5)'
        };
    };

    // Country coordinates mapping
    const countryCoordinates = {
        "USA": [-95.7129, 37.0902],
        "Germany": [10.4515, 51.1657],
        "China": [104.1954, 35.8617],
        "UK": [-3.4360, 55.3781],
        "Taiwan": [120.9605, 23.6978],
        "Korea": [127.7669, 35.9078],
        "France": [2.2137, 46.2276],
        "Sweden": [18.0686, 59.3293],
        "Canada": [-106.3468, 56.1304],
        "Japan": [138.2529, 36.2048],
        "Switzerland": [8.2275, 46.8182]
    };

    // Get bubble data - modified to show individual companies with improved jittering to avoid overlap
    const getBubbleData = (rawData) => {
        // Filter by category if needed
        const filteredData = selectedCategory === 'All'
            ? rawData
            : rawData.filter(item => item.Category === selectedCategory);

        // Group companies by country first to calculate offsets
        const countryCounts = {};
        filteredData.forEach(item => {
            const country = item.Country;
            if (!countryCounts[country]) {
                countryCounts[country] = 0;
            }
            countryCounts[country]++;
        });

        // Create a map for company positions to avoid duplicates
        const companyPositions = {};

        // Process each company individually
        return filteredData.map(item => {
            const country = item.Country;
            const companyKey = `${item.Company}_${country}`;

            // Calculate offset based on country company count
            let offsetX, offsetY;

            if (!companyPositions[companyKey]) {
                // Calculate a position around the country center
                const count = countryCounts[country];
                const index = Object.keys(companyPositions).filter(key =>
                    key.endsWith(`_${country}`)
                ).length;

                if (count === 1) {
                    // If only one company, add a slight random jitter even for single companies
                    // This helps when multiple countries have single companies in the same category
                    offsetX = (Math.random() - 0.5) * 5;
                    offsetY = (Math.random() - 0.5) * 5;
                } else {
                    // Arrange companies in a spiral pattern around the country center
                    // for better distribution when there are many companies
                    const spiralAngle = (index / count) * 2 * Math.PI * 2;

                    // Scale radius based on company count and add some variation
                    // Larger radius for countries with more companies
                    const baseRadius = Math.min(15, Math.max(5, count * 1.5));
                    const radius = baseRadius * (0.5 + (index / count));

                    // Calculate position with some additional random jitter
                    offsetX = Math.cos(spiralAngle) * radius + (Math.random() - 0.5) * 3;
                    offsetY = Math.sin(spiralAngle) * radius + (Math.random() - 0.5) * 3;
                }

                companyPositions[companyKey] = [offsetX, offsetY];
            } else {
                [offsetX, offsetY] = companyPositions[companyKey];
            }

            // Ensure we have coordinates for this country
            if (!countryCoordinates[country]) {
                console.warn(`No coordinates for country: ${country}`);
                return null;
            }

            return {
                country: country,
                company: item.Company,
                value: item['Mkt Cap ($mn)'],
                category: item.Category,
                product: item.Product || '',
                coordinates: countryCoordinates[country],
                // Add calculated offset for better positioning
                displayCoordinates: [
                    countryCoordinates[country][0] + offsetX,
                    countryCoordinates[country][1] + offsetY
                ]
            };
        }).filter(item => item !== null); // Remove any null items (countries without coordinates)
    };

    const renderMap = async (rawData) => {
        if (!rawData || rawData.length === 0) {
            console.warn('No data available to render map');
            setMapError('No data available to render map');
            setIsLoading(false);
            return;
        }

        if (!svgRef.current) {
            console.warn('SVG reference not available');
            return;
        }

        // Get the container dimensions to make the map responsive
        const container = svgRef.current.parentElement;
        const viewW = container.clientWidth;
        const viewH = container.clientHeight;

        const svg = d3
            .select(svgRef.current)
            .attr('viewBox', `0 0 ${viewW} ${viewH}`)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .attr('width', viewW)
            .attr('height', viewH);

        svg.selectAll('*').remove();

        try {
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
                .precision(0.1)
                .scale(viewW / 6)
                .center([0, 10])
                .translate([viewW / 2, viewH / 2]);

            // ─── World Map with Country Outlines ──────────────────────────────────
            try {
                // Fetch the TopoJSON world data
                const resp = await fetch('https://unpkg.com/world-atlas@2/countries-110m.json');
                if (!resp.ok) throw new Error(`Status ${resp.status}`);
                const world = await resp.json();

                let countries = topojson
                    .feature(world, world.objects.countries)
                    .features
                    .filter(d => {
                        // Filter out Antarctica and very southern areas
                        if (d.id === 10 || d.id === 170) return false;
                        if (d.properties?.name?.match(/Antarct/)) return false;
                        const hasBelow = coords =>
                            Array.isArray(coords[0])
                                ? coords.some(hasBelow)
                                : coords[1] < -60;
                        return !hasBelow(d.geometry.coordinates);
                    });

                // Create a path generator
                const path = d3.geoPath().projection(projection);

                // Create a group for the countries with drop shadow
                const countryGroup = svg.append('g')
                    .attr('class', 'countries')
                    .attr('filter', 'url(#drop-shadow)');

                // Add all country paths
                countryGroup.selectAll('path.country')
                    .data(countries)
                    .enter()
                    .append('path')
                    .attr('class', 'country')
                    .attr('d', path)
                    .attr('fill', colors.land)
                    .attr('stroke', colors.border)
                    .attr('stroke-width', 0.5)
                    .on('mouseover', function (event, d) {
                        // Darken the highlighted country a bit
                        d3.select(this).attr('fill', '#e5e7eb');
                    })
                    .on('mouseout', function () {
                        d3.select(this).attr('fill', colors.land);
                    });
            } catch (err) {
                console.warn('Could not load detailed country outlines:', err);
                console.log('Falling back to simple world outline');

                // Create a simple world outline for reference
                const outline = svg.append("g")
                    .attr("class", "outline");

                outline.append("path")
                    .datum({ type: "Sphere" })
                    .attr("fill", "#f9fafb")
                    .attr("stroke", "#d1d5db")
                    .attr("stroke-width", 1)
                    .attr("d", d3.geoPath(projection));

                // Add graticules for better geographic reference
                const graticule = d3.geoGraticule()
                    .step([20, 20]);

                outline.append("path")
                    .datum(graticule)
                    .attr("fill", "none")
                    .attr("stroke", "#e5e7eb")
                    .attr("stroke-width", 0.5)
                    .attr("d", d3.geoPath(projection));
            }

            // ─── Bubble Chart Overlay ────────────────────────────────────────────────
            // Get bubble data
            const bubbleData = getBubbleData(rawData);

            // Calculate bubble sizes - scale values to reasonable bubble sizes
            const valueExtent = d3.extent(bubbleData, d => d.value);
            const bubbleScale = d3.scaleSqrt()
                .domain(valueExtent)
                .range([10, 60]); // Adjusted for visibility of market cap differences

            // Create a new group for bubbles
            const bubbleGroup = svg.append('g')
                .attr('class', 'bubbles');

            // Modify the projection to use displayCoordinates for better jittering
            bubbleGroup.selectAll('circle')
                .data(bubbleData)
                .enter()
                .append('circle')
                .attr('cx', d => projection(d.displayCoordinates)[0])  // Use the jittered coordinates
                .attr('cy', d => projection(d.displayCoordinates)[1])  // Use the jittered coordinates
                .attr('r', 0) // Start with radius 0 for animation
                .attr('fill', d => {
                    // Use color based on selected category with reduced opacity
                    if (selectedCategory === 'All') {
                        // Mixed color for all categories
                        return 'rgba(59, 130, 246, 0.4)'; // Blue with reduced opacity
                    } else if (selectedCategory === 'Brain') {
                        return 'rgba(248, 113, 113, 0.4)'; // Red with reduced opacity
                    } else if (selectedCategory === 'Body') {
                        return 'rgba(74, 222, 128, 0.4)'; // Green with reduced opacity
                    } else {
                        return 'rgba(250, 204, 21, 0.4)'; // Yellow with reduced opacity
                    }
                })
                .attr('stroke', d => {
                    // Matching darker stroke colors based on category
                    if (selectedCategory === 'All') {
                        return '#1d4ed8'; // Darker blue
                    } else if (selectedCategory === 'Brain') {
                        return '#dc2626'; // Darker red
                    } else if (selectedCategory === 'Body') {
                        return '#16a34a'; // Darker green
                    } else {
                        return '#ca8a04'; // Darker yellow
                    }
                })
                .attr('stroke-width', 2)
                .attr('filter', 'url(#glow)')
                .attr('opacity', 0.7)
                .on('mouseover', function (event, d) {
                    // Using native event handling to avoid d3 map errors
                    const element = this;

                    // Highlight bubble on hover - make it more visible but still semi-transparent
                    d3.select(element)
                        .attr('stroke-width', 3)
                        .attr('opacity', 0.85);

                    // Show tooltip with company info
                    const tooltipHTML = `
                        <strong>${d.company}</strong> (${d.country})<br>
                        Market Cap: ${formatMarketCap(d.value)}<br>
                        Category: ${d.category}
                        ${d.product ? `<br>Product: ${d.product}` : ''}
                    `;

                    setTooltipContent(tooltipHTML);
                    setTooltipPosition({
                        x: event.pageX || event.clientX,
                        y: event.pageY || event.clientY
                    });
                    setShowTooltip(true);
                })
                .on('mouseout', function () {
                    // Reset bubble appearance using direct element reference
                    d3.select(this)
                        .attr('stroke-width', 1.5)
                        .attr('opacity', 0.7);

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
                .attr('x', d => projection(d.displayCoordinates)[0])
                .attr('y', d => projection(d.displayCoordinates)[1] + bubbleScale(d.value) + 10)
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

            // Add legend with larger dimensions
            const legendGroup = svg.append('g')
                .attr('class', 'legend')
                .attr('transform', `translate(20, ${viewH - 150})`); // Moved higher up

            // Legend background with increased width and height
            legendGroup.append('rect')
                .attr('x', -15)
                .attr('y', -20)
                .attr('width', 350) // Increased from 250
                .attr('height', 140) // Increased from 110
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
                .text(`Market Cap by Country${selectedCategory !== 'All' ? ` (${selectedCategory})` : ''}`);

            // Legend bubbles - use the same color scheme as the bubbles
            const legendValues = [valueExtent[0], (valueExtent[0] + valueExtent[1]) / 2, valueExtent[1]];

            // Update legend colors with matching reduced opacity
            let fillColor, strokeColor;
            if (selectedCategory === 'All') {
                fillColor = 'rgba(59, 130, 246, 0.4)'; // Blue with reduced opacity
                strokeColor = '#1d4ed8'; // Darker blue
            } else if (selectedCategory === 'Brain') {
                fillColor = 'rgba(248, 113, 113, 0.4)'; // Red with reduced opacity
                strokeColor = '#dc2626'; // Darker red
            } else if (selectedCategory === 'Body') {
                fillColor = 'rgba(74, 222, 128, 0.4)'; // Green with reduced opacity
                strokeColor = '#16a34a'; // Darker green
            } else {
                fillColor = 'rgba(250, 204, 21, 0.4)'; // Yellow with reduced opacity
                strokeColor = '#ca8a04'; // Darker yellow
            }

            legendValues.forEach((value, i) => {
                // Increased spacing between legend bubbles
                const cy = 50; // Moved bubbles down
                const cx = i * 110 + 50; // Increased spacing from 80 to 110

                // Add bubble
                legendGroup.append('circle')
                    .attr('cx', cx)
                    .attr('cy', cy)
                    .attr('r', bubbleScale(value))
                    .attr('fill', fillColor)
                    .attr('stroke', strokeColor)
                    .attr('stroke-width', 2);

                // Add value label with more space
                legendGroup.append('text')
                    .attr('x', cx)
                    .attr('y', cy + bubbleScale(value) + 20) // Increased from +15 to +20
                    .attr('text-anchor', 'middle')
                    .attr('font-family', 'Helvetica, Arial, sans-serif')
                    .attr('font-size', '12px')
                    .text(formatMarketCap(value));
            });

            setIsLoading(false);
        } catch (err) {
            console.error('Error rendering map:', err);
            setMapError(err.message);
            setIsLoading(false);
        }
    };

    // ─── Styles ───────────────────────────────────────────────────────────────
    const containerStyle = {
        width: '100%',
        height: '100%',
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

    const warningStyle = {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(251, 191, 36, 0.9)',
        color: '#78350f',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '14px',
        maxWidth: '300px',
        zIndex: 1000,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };

    const warningContent = {
        textAlign: 'left',
        padding: '0',
        margin: 0
    };

    const tooltipStyle = {
        position: 'absolute',
        left: tooltipPosition.x + 10,
        top: tooltipPosition.y - 10,
        backgroundColor: 'rgba(0,0,0,0.75)',
        color: '#fff',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '14px',
        pointerEvents: 'none',
        opacity: showTooltip ? 1 : 0,
        transition: 'opacity 0.2s',
        zIndex: 1000,
        maxWidth: '300px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
    };

    return (
        <div style={containerStyle}>
            {isLoading && <div style={loadingStyle}>Loading map...</div>}
            {mapError && (
                <div style={warningStyle}>
                    <p style={warningContent}>
                        <strong>Note:</strong> {mapError}
                    </p>
                </div>
            )}
            <svg ref={svgRef} style={svgStyle} />
            <div
                style={tooltipStyle}
                dangerouslySetInnerHTML={{ __html: tooltipContent }}
            />
        </div>
    );
};

export default WorldMap;