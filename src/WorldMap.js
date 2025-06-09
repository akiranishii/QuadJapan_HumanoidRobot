import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import Papa from 'papaparse';

const WorldMap = ({ selectedCategory, selectedSubcategory, selectedCountries }) => {
    const svgRef = useRef(null);
    const [tooltipContent, setTooltipContent] = useState('');
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [showTooltip, setShowTooltip] = useState(false);
    const [mapError, setMapError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);
    const [errorDismissed, setErrorDismissed] = useState(false);

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
                // Load CSV from public directory using fetch
                const response = await fetch('./data/full_dataset.csv');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const csvText = await response.text();
                
                const parsedData = Papa.parse(csvText, {
                    header: true,
                    dynamicTyping: true,
                    skipEmptyLines: true
                });

                console.log(`Loaded ${parsedData.data.length} records from CSV dataset`);
                console.log('Sample data:', parsedData.data.slice(0, 3));
                
                setData(parsedData.data);
                // Don't call renderMap directly here - let the useEffect handle it
            } catch (error) {
                console.error('Error loading CSV data:', error);

                // Create fallback data if there's an error - complete dataset matching CSV
                console.warn('Using fallback data due to error:', error.message);
                const fallbackData = [
                    { "Company": "Palantir", "Country": "USA", "Mkt Cap ($mn)": 236526, "Category": "Brain", "Product": "Data Science & Analytics", "Products Grouped": "AI & Software" },
                    { "Company": "Oracle", "Country": "USA", "Mkt Cap ($mn)": 469582, "Category": "Brain", "Product": "Data Science & Analytics", "Products Grouped": "AI & Software" },
                    { "Company": "Siemens", "Country": "Germany", "Mkt Cap ($mn)": 164454, "Category": "Brain", "Product": "Diversified Automation", "Products Grouped": "Automation Software" },
                    { "Company": "Siemens", "Country": "Germany", "Mkt Cap ($mn)": 164454, "Category": "Brain", "Product": "Simulation", "Products Grouped": "Software/Simulation" },
                    { "Company": "Siemens", "Country": "Germany", "Mkt Cap ($mn)": 164454, "Category": "Brain", "Product": "Sensors", "Products Grouped": "Sensors/Electronics" },
                    { "Company": "Siemens", "Country": "Germany", "Mkt Cap ($mn)": 164454, "Category": "Brain", "Product": "Vision", "Products Grouped": "Sensors/Electronics" },
                    { "Company": "Siemens", "Country": "Germany", "Mkt Cap ($mn)": 164454, "Category": "Brain", "Product": "Motors", "Products Grouped": "Mechanical & Motion" },
                    { "Company": "Baidu", "Country": "China", "Mkt Cap ($mn)": 25998, "Category": "Brain", "Product": "Foundational Models", "Products Grouped": "AI & Software" },
                    { "Company": "Meta", "Country": "USA", "Mkt Cap ($mn)": 1784347, "Category": "Brain", "Product": "Foundational Models", "Products Grouped": "AI & Software" },
                    { "Company": "Meta", "Country": "USA", "Mkt Cap ($mn)": 1784347, "Category": "Brain", "Product": "Simulation", "Products Grouped": "Software/Simulation" },
                    { "Company": "Alphabet Inc.", "Country": "USA", "Mkt Cap ($mn)": 2525679, "Category": "Brain", "Product": "Foundational Models", "Products Grouped": "AI & Software" },
                    { "Company": "Alphabet Inc.", "Country": "USA", "Mkt Cap ($mn)": 2525679, "Category": "Brain", "Product": "Simulation", "Products Grouped": "Software/Simulation" },
                    { "Company": "Microsoft", "Country": "USA", "Mkt Cap ($mn)": 3065550, "Category": "Brain", "Product": "Foundational Models", "Products Grouped": "AI & Software" },
                    { "Company": "Microsoft", "Country": "USA", "Mkt Cap ($mn)": 3065550, "Category": "Brain", "Product": "Data Science & Analytics", "Products Grouped": "AI & Software" },
                    { "Company": "Intel", "Country": "USA", "Mkt Cap ($mn)": 83526, "Category": "Brain", "Product": "Semis (Compute)", "Products Grouped": "Semiconductor & Compute" },
                    { "Company": "Intel", "Country": "USA", "Mkt Cap ($mn)": 83526, "Category": "Brain", "Product": "Vision", "Products Grouped": "Sensors/Electronics" },
                    { "Company": "Intel", "Country": "USA", "Mkt Cap ($mn)": 83526, "Category": "Brain", "Product": "Lidar", "Products Grouped": "Sensors/Electronics" },
                    { "Company": "Intel", "Country": "USA", "Mkt Cap ($mn)": 83526, "Category": "Brain", "Product": "Semis (Fab)", "Products Grouped": "Semiconductor & Compute" },
                    { "Company": "NVIDIA", "Country": "USA", "Mkt Cap ($mn)": 2905739, "Category": "Brain", "Product": "Semis (Compute)", "Products Grouped": "Semiconductor & Compute" },
                    { "Company": "NVIDIA", "Country": "USA", "Mkt Cap ($mn)": 2905739, "Category": "Brain", "Product": "Foundational Models", "Products Grouped": "AI & Software" },
                    { "Company": "NVIDIA", "Country": "USA", "Mkt Cap ($mn)": 2905739, "Category": "Brain", "Product": "Simulation", "Products Grouped": "Software/Simulation" },
                    { "Company": "Synopsys", "Country": "USA", "Mkt Cap ($mn)": 80980, "Category": "Brain", "Product": "Semis (Design)", "Products Grouped": "Semiconductor & Compute" },
                    { "Company": "Cadence Design Systems", "Country": "USA", "Mkt Cap ($mn)": 82188, "Category": "Brain", "Product": "Semis (Design)", "Products Grouped": "Semiconductor & Compute" },
                    { "Company": "Arm Holdings", "Country": "UK", "Mkt Cap ($mn)": 170472, "Category": "Brain", "Product": "Semis (Design)", "Products Grouped": "Semiconductor & Compute" },
                    { "Company": "TSMC", "Country": "Taiwan", "Mkt Cap ($mn)": 1058181, "Category": "Brain", "Product": "Semis (Fab)", "Products Grouped": "Semiconductor & Compute" },
                    { "Company": "Samsung Electronics", "Country": "Korea", "Mkt Cap ($mn)": 244701, "Category": "Brain", "Product": "Semis (Memory)", "Products Grouped": "Semiconductor & Compute" },
                    { "Company": "Samsung Electronics", "Country": "Korea", "Mkt Cap ($mn)": 244701, "Category": "Brain", "Product": "Semis (Fab)", "Products Grouped": "Semiconductor & Compute" },
                    { "Company": "Micron", "Country": "USA", "Mkt Cap ($mn)": 101011, "Category": "Brain", "Product": "Semis (Memory)", "Products Grouped": "Semiconductor & Compute" },
                    { "Company": "SK Hynix", "Country": "Korea", "Mkt Cap ($mn)": 90010, "Category": "Brain", "Product": "Semis (Memory)", "Products Grouped": "Semiconductor & Compute" },
                    { "Company": "SK Hynix", "Country": "Korea", "Mkt Cap ($mn)": 90010, "Category": "Brain", "Product": "Sensors", "Products Grouped": "Sensors/Electronics" },
                    { "Company": "SK Hynix", "Country": "Korea", "Mkt Cap ($mn)": 90010, "Category": "Brain", "Product": "Vision", "Products Grouped": "Sensors/Electronics" },
                    { "Company": "Horizon Robotics", "Country": "China", "Mkt Cap ($mn)": 1449, "Category": "Brain", "Product": "Semis (Vision)", "Products Grouped": "Semiconductor & Compute" },
                    { "Company": "Ambarella", "Country": "USA", "Mkt Cap ($mn)": 3187, "Category": "Brain", "Product": "Semis (Vision)", "Products Grouped": "Semiconductor & Compute" },
                    { "Company": "Mobileye", "Country": "USA", "Mkt Cap ($mn)": 12912, "Category": "Brain", "Product": "Semis (Vision)", "Products Grouped": "Semiconductor & Compute" },
                    { "Company": "Qualcomm", "Country": "USA", "Mkt Cap ($mn)": 191277, "Category": "Brain", "Product": "Semis (Vision)", "Products Grouped": "Semiconductor & Compute" },
                    { "Company": "Dassault Systemes", "Country": "France", "Mkt Cap ($mn)": 55446, "Category": "Brain", "Product": "Simulation", "Products Grouped": "Software/Simulation" },
                    { "Company": "Dassault Systemes", "Country": "France", "Mkt Cap ($mn)": 55446, "Category": "Brain", "Product": "Vision & Reality Capture Software", "Products Grouped": "AI & Software" },
                    { "Company": "Hexagon", "Country": "Sweden", "Mkt Cap ($mn)": 31659, "Category": "Brain", "Product": "Vision", "Products Grouped": "Sensors/Electronics" },
                    { "Company": "Hexagon", "Country": "Sweden", "Mkt Cap ($mn)": 31659, "Category": "Brain", "Product": "Simulation", "Products Grouped": "Software/Simulation" },
                    { "Company": "Hexagon", "Country": "Sweden", "Mkt Cap ($mn)": 31659, "Category": "Brain", "Product": "Vision & Reality Capture Software", "Products Grouped": "AI & Software" },
                    { "Company": "Valeo", "Country": "France", "Mkt Cap ($mn)": 2613, "Category": "Body", "Product": "ADAS (Radar, etc.)", "Products Grouped": "Sensors" },
                    { "Company": "Xusheng", "Country": "China", "Mkt Cap ($mn)": 2050, "Category": "Body", "Product": "Aluminum Castings", "Products Grouped": "Mechanical (Cast/Frames)" },
                    { "Company": "Magna", "Country": "Canada", "Mkt Cap ($mn)": 10850, "Category": "Body", "Product": "Aluminum Castings", "Products Grouped": "Mechanical (Cast/Frames)" },
                    { "Company": "Magna", "Country": "Canada", "Mkt Cap ($mn)": 10850, "Category": "Body", "Product": "ADAS (Radar, etc.)", "Products Grouped": "Sensors" },
                    { "Company": "EVE Energy", "Country": "China", "Mkt Cap ($mn)": 11883, "Category": "Body", "Product": "Batteries (Complete)", "Products Grouped": "Energy & Power" },
                    { "Company": "Samsung SDI", "Country": "Korea", "Mkt Cap ($mn)": 12802, "Category": "Body", "Product": "Batteries (Complete)", "Products Grouped": "Energy & Power" },
                    { "Company": "LG Energy Solution", "Country": "Korea", "Mkt Cap ($mn)": 53265, "Category": "Body", "Product": "Batteries (Complete)", "Products Grouped": "Energy & Power" },
                    { "Company": "CATL", "Country": "China", "Mkt Cap ($mn)": 155380, "Category": "Body", "Product": "Batteries (Complete)", "Products Grouped": "Energy & Power" },
                    { "Company": "Shuanglin", "Country": "China", "Mkt Cap ($mn)": 1987, "Category": "Body", "Product": "Bearings", "Products Grouped": "Mechanical & Motion" },
                    { "Company": "Schaeffler", "Country": "Germany", "Mkt Cap ($mn)": 4070, "Category": "Body", "Product": "Bearings", "Products Grouped": "Mechanical & Motion" },
                    { "Company": "Schaeffler", "Country": "Germany", "Mkt Cap ($mn)": 4070, "Category": "Body", "Product": "Linear Guides", "Products Grouped": "Mechanical & Motion" },
                    { "Company": "NSK", "Country": "Japan", "Mkt Cap ($mn)": 2018, "Category": "Body", "Product": "Bearings", "Products Grouped": "Mechanical & Motion" },
                    { "Company": "NSK", "Country": "Japan", "Mkt Cap ($mn)": 2018, "Category": "Body", "Product": "Screws", "Products Grouped": "Mechanical & Motion" },
                    { "Company": "Timken", "Country": "USA", "Mkt Cap ($mn)": 5533, "Category": "Body", "Product": "Bearings", "Products Grouped": "Mechanical & Motion" },
                    { "Company": "Timken", "Country": "USA", "Mkt Cap ($mn)": 5533, "Category": "Body", "Product": "Reducers", "Products Grouped": "Mechanical & Motion" },
                    { "Company": "Timken", "Country": "USA", "Mkt Cap ($mn)": 5533, "Category": "Body", "Product": "Complete Actuators", "Products Grouped": "Mechanical & Motion" },
                    { "Company": "RBC Bearings", "Country": "USA", "Mkt Cap ($mn)": 11597, "Category": "Body", "Product": "Bearings", "Products Grouped": "Mechanical & Motion" },
                    { "Company": "Tuopu", "Country": "China", "Mkt Cap ($mn)": 4348, "Category": "Body", "Product": "Complete Actuators", "Products Grouped": "Mechanical & Motion" },
                    { "Company": "Tuopu", "Country": "China", "Mkt Cap ($mn)": 4348, "Category": "Body", "Product": "Thermal (Pumps, Battery Cooling, etc.)", "Products Grouped": "Mechanical (Cast/Frames)" },
                    { "Company": "Sanhuan", "Country": "China", "Mkt Cap ($mn)": 15706, "Category": "Body", "Product": "Complete Actuators", "Products Grouped": "Mechanical & Motion" },
                    { "Company": "Shenzhen Inovance", "Country": "China", "Mkt Cap ($mn)": 22665, "Category": "Body", "Product": "Motors", "Products Grouped": "Mechanical & Motion" },
                    { "Company": "Moog", "Country": "USA", "Mkt Cap ($mn)": 5839, "Category": "Body", "Product": "Complete Actuators", "Products Grouped": "Mechanical & Motion" },
                    { "Company": "Moog", "Country": "USA", "Mkt Cap ($mn)": 5839, "Category": "Body", "Product": "Defense Platforms", "Products Grouped": "Other Systems" },
                    { "Company": "Rockwell Automation", "Country": "USA", "Mkt Cap ($mn)": 30557, "Category": "Body", "Product": "Diversified Automation", "Products Grouped": "Industrial/Automation" },
                    { "Company": "Honeywell", "Country": "USA", "Mkt Cap ($mn)": 145963, "Category": "Body", "Product": "Diversified Automation", "Products Grouped": "Industrial/Automation" },
                    { "Company": "Honeywell", "Country": "USA", "Mkt Cap ($mn)": 145963, "Category": "Body", "Product": "Vision", "Products Grouped": "Sensors/Electronics" },
                    { "Company": "Honeywell", "Country": "USA", "Mkt Cap ($mn)": 145963, "Category": "Body", "Product": "Avionics", "Products Grouped": "Sensors/Electronics" },
                    { "Company": "Siemens", "Country": "Germany", "Mkt Cap ($mn)": 164454, "Category": "Body", "Product": "Diversified Automation", "Products Grouped": "Industrial/Automation" },
                    { "Company": "Siemens", "Country": "Germany", "Mkt Cap ($mn)": 164454, "Category": "Body", "Product": "Simulation", "Products Grouped": "Software/Simulation" },
                    { "Company": "Siemens", "Country": "Germany", "Mkt Cap ($mn)": 164454, "Category": "Body", "Product": "Sensors", "Products Grouped": "Sensors" },
                    { "Company": "Siemens", "Country": "Germany", "Mkt Cap ($mn)": 164454, "Category": "Body", "Product": "Vision", "Products Grouped": "Sensors/Electronics" },
                    { "Company": "Siemens", "Country": "Germany", "Mkt Cap ($mn)": 164454, "Category": "Body", "Product": "Motors", "Products Grouped": "Mechanical & Motion" },
                    { "Company": "Hon Hai Precision (Foxconn)", "Country": "Taiwan", "Mkt Cap ($mn)": 69364, "Category": "Body", "Product": "Electronics Components", "Products Grouped": "Electronics" },
                    { "Company": "Novanta", "Country": "USA", "Mkt Cap ($mn)": 3212, "Category": "Body", "Product": "Sensors (Force)", "Products Grouped": "Sensors" },
                    { "Company": "Hota", "Country": "Taiwan", "Mkt Cap ($mn)": 497, "Category": "Body", "Product": "Gears/Reducers", "Products Grouped": "Mechanical & Motion" },
                    { "Company": "Harmonic Drive Systems", "Country": "Japan", "Mkt Cap ($mn)": 2776, "Category": "Body", "Product": "Gears/Reducers", "Products Grouped": "Mechanical & Motion" },
                    { "Company": "LeaderDrive", "Country": "China", "Mkt Cap ($mn)": 2119, "Category": "Body", "Product": "Gears/Reducers", "Products Grouped": "Mechanical & Motion" },
                    { "Company": "Shuanghuan", "Country": "China", "Mkt Cap ($mn)": 3970, "Category": "Body", "Product": "Gears/Reducers", "Products Grouped": "Mechanical & Motion" },
                    { "Company": "Nabtesco", "Country": "Japan", "Mkt Cap ($mn)": 2067, "Category": "Body", "Product": "Gears/Reducers", "Products Grouped": "Mechanical & Motion" },
                    { "Company": "Zhongda Leader", "Country": "China", "Mkt Cap ($mn)": 1162, "Category": "Body", "Product": "Motors", "Products Grouped": "Mechanical & Motion" },
                    { "Company": "Zhongda Leader", "Country": "China", "Mkt Cap ($mn)": 1162, "Category": "Body", "Product": "Gears/Reducers", "Products Grouped": "Mechanical & Motion" },
                    { "Company": "Leadshine", "Country": "China", "Mkt Cap ($mn)": 1421, "Category": "Body", "Product": "Motors", "Products Grouped": "Mechanical & Motion" },
                    { "Company": "Etsun", "Country": "China", "Mkt Cap ($mn)": 1135, "Category": "Body", "Product": "Motors", "Products Grouped": "Mechanical & Motion" },
                    { "Company": "Zhaowei", "Country": "China", "Mkt Cap ($mn)": 627, "Category": "Body", "Product": "Motors", "Products Grouped": "Mechanical & Motion" },
                    { "Company": "Moons Electric", "Country": "China", "Mkt Cap ($mn)": 3583, "Category": "Body", "Product": "Motors", "Products Grouped": "Mechanical & Motion" },
                    { "Company": "Regal Rexnord", "Country": "USA", "Mkt Cap ($mn)": 9334, "Category": "Body", "Product": "Motors", "Products Grouped": "Mechanical & Motion" },
                    { "Company": "Regal Rexnord", "Country": "USA", "Mkt Cap ($mn)": 9334, "Category": "Body", "Product": "Bearings", "Products Grouped": "Mechanical & Motion" },
                    { "Company": "Regal Rexnord", "Country": "USA", "Mkt Cap ($mn)": 9334, "Category": "Body", "Product": "Gears", "Products Grouped": "Mechanical & Motion" },
                    { "Company": "Regal Rexnord", "Country": "USA", "Mkt Cap ($mn)": 9334, "Category": "Body", "Product": "Complete Actuators", "Products Grouped": "Mechanical & Motion" },
                    { "Company": "Nidec", "Country": "Japan", "Mkt Cap ($mn)": 19028, "Category": "Body", "Product": "Motors", "Products Grouped": "Mechanical & Motion" },
                    { "Company": "Nidec", "Country": "Japan", "Mkt Cap ($mn)": 19028, "Category": "Body", "Product": "Encoders", "Products Grouped": "Sensors/Electronics" },
                    { "Company": "GAC Group", "Country": "China", "Mkt Cap ($mn)": 4071, "Category": "Integrator", "Product": "Autos", "Products Grouped": "Automotive/Transportation" },
                    { "Company": "GAC Group", "Country": "China", "Mkt Cap ($mn)": 4071, "Category": "Integrator", "Product": "Robotics", "Products Grouped": "Robotics" },
                    { "Company": "XPENG", "Country": "China", "Mkt Cap ($mn)": 13146, "Category": "Integrator", "Product": "Autos", "Products Grouped": "Automotive/Transportation" },
                    { "Company": "XPENG", "Country": "China", "Mkt Cap ($mn)": 13146, "Category": "Integrator", "Product": "Robotics", "Products Grouped": "Robotics" },
                    { "Company": "XPENG", "Country": "China", "Mkt Cap ($mn)": 13146, "Category": "Integrator", "Product": "EVTOL", "Products Grouped": "Automotive/Transportation" },
                    { "Company": "Hyundai", "Country": "Korea", "Mkt Cap ($mn)": 36405, "Category": "Integrator", "Product": "Autos", "Products Grouped": "Automotive/Transportation" },
                    { "Company": "Hyundai", "Country": "Korea", "Mkt Cap ($mn)": 36405, "Category": "Integrator", "Product": "Robotics", "Products Grouped": "Robotics" },
                    { "Company": "BYD", "Country": "China", "Mkt Cap ($mn)": 109785, "Category": "Integrator", "Product": "Autos", "Products Grouped": "Automotive/Transportation" },
                    { "Company": "BYD", "Country": "China", "Mkt Cap ($mn)": 109785, "Category": "Integrator", "Product": "Robotics", "Products Grouped": "Robotics" },
                    { "Company": "Toyota", "Country": "Japan", "Mkt Cap ($mn)": 243296, "Category": "Integrator", "Product": "Autos", "Products Grouped": "Automotive/Transportation" },
                    { "Company": "Toyota", "Country": "Japan", "Mkt Cap ($mn)": 243296, "Category": "Integrator", "Product": "Robotics", "Products Grouped": "Robotics" },
                    { "Company": "Tesla", "Country": "USA", "Mkt Cap ($mn)": 1261551, "Category": "Integrator", "Product": "Autos", "Products Grouped": "Automotive/Transportation" },
                    { "Company": "Tesla", "Country": "USA", "Mkt Cap ($mn)": 1261551, "Category": "Integrator", "Product": "Robotics", "Products Grouped": "Robotics" },
                    { "Company": "Tesla", "Country": "USA", "Mkt Cap ($mn)": 1261551, "Category": "Integrator", "Product": "Energy Storage", "Products Grouped": "Energy & Power" },
                    { "Company": "LG Electronics", "Country": "Korea", "Mkt Cap ($mn)": 9650, "Category": "Integrator", "Product": "Consumer Electronics", "Products Grouped": "Consumer/Internet" },
                    { "Company": "LG Electronics", "Country": "Korea", "Mkt Cap ($mn)": 9650, "Category": "Integrator", "Product": "Robotics", "Products Grouped": "Robotics" },
                    { "Company": "Xiaomi", "Country": "China", "Mkt Cap ($mn)": 127127, "Category": "Integrator", "Product": "Consumer Electronics", "Products Grouped": "Consumer/Internet" },
                    { "Company": "Xiaomi", "Country": "China", "Mkt Cap ($mn)": 127127, "Category": "Integrator", "Product": "Autos", "Products Grouped": "Automotive/Transportation" },
                    { "Company": "Apple", "Country": "USA", "Mkt Cap ($mn)": 3497145, "Category": "Integrator", "Product": "Consumer Electronics", "Products Grouped": "Consumer/Internet" },
                    { "Company": "Apple", "Country": "USA", "Mkt Cap ($mn)": 3497145, "Category": "Integrator", "Product": "Robotics", "Products Grouped": "Robotics" },
                    { "Company": "Alibaba", "Country": "China", "Mkt Cap ($mn)": 245066, "Category": "Integrator", "Product": "E-Commerce", "Products Grouped": "Consumer/Internet" },
                    { "Company": "Amazon", "Country": "USA", "Mkt Cap ($mn)": 2545426, "Category": "Integrator", "Product": "E-Commerce; Cloud", "Products Grouped": "Consumer/Internet" },
                    { "Company": "Amazon", "Country": "USA", "Mkt Cap ($mn)": 2545426, "Category": "Integrator", "Product": "Robotics", "Products Grouped": "Robotics" },
                    { "Company": "Amazon", "Country": "USA", "Mkt Cap ($mn)": 2545426, "Category": "Integrator", "Product": "Satellite Comms", "Products Grouped": "Telecommunications" },
                    { "Company": "Hon Hai Precision (Foxconn)", "Country": "Taiwan", "Mkt Cap ($mn)": 69364, "Category": "Integrator", "Product": "Electronic Components", "Products Grouped": "Electronics" },
                    { "Company": "Naver", "Country": "Korea", "Mkt Cap ($mn)": 22239, "Category": "Integrator", "Product": "Internet", "Products Grouped": "Consumer/Internet" },
                    { "Company": "Naver", "Country": "Korea", "Mkt Cap ($mn)": 22239, "Category": "Integrator", "Product": "Robotics", "Products Grouped": "Robotics" },
                    { "Company": "Tencent", "Country": "China", "Mkt Cap ($mn)": 491611, "Category": "Integrator", "Product": "Internet", "Products Grouped": "Consumer/Internet" },
                    { "Company": "Tencent", "Country": "China", "Mkt Cap ($mn)": 491611, "Category": "Integrator", "Product": "Robotics", "Products Grouped": "Robotics" },
                    { "Company": "Estun", "Country": "China", "Mkt Cap ($mn)": 2172, "Category": "Integrator", "Product": "Motors", "Products Grouped": "Mechanical & Motion" },
                    { "Company": "Estun", "Country": "China", "Mkt Cap ($mn)": 2172, "Category": "Integrator", "Product": "Robotics", "Products Grouped": "Robotics" },
                    { "Company": "Rainbow Robotics", "Country": "Korea", "Mkt Cap ($mn)": 1200, "Category": "Integrator", "Product": "Robotics", "Products Grouped": "Robotics" },
                    { "Company": "UBTech", "Country": "China", "Mkt Cap ($mn)": 600, "Category": "Integrator", "Product": "Robotics", "Products Grouped": "Robotics" },
                    { "Company": "Midea", "Country": "China", "Mkt Cap ($mn)": 77986, "Category": "Integrator", "Product": "Robotics", "Products Grouped": "Robotics" },
                    { "Company": "ABB", "Country": "Switzerland", "Mkt Cap ($mn)": 100438, "Category": "Integrator", "Product": "Robotics", "Products Grouped": "Robotics" },
                    { "Company": "ABB", "Country": "Switzerland", "Mkt Cap ($mn)": 100438, "Category": "Integrator", "Product": "Complete Actuators", "Products Grouped": "Mechanical & Motion" },
                    { "Company": "Samsung Electronics", "Country": "Korea", "Mkt Cap ($mn)": 244701, "Category": "Integrator", "Product": "Semis (Memory)", "Products Grouped": "Semiconductor & Compute" },
                    { "Company": "Samsung Electronics", "Country": "Korea", "Mkt Cap ($mn)": 244701, "Category": "Integrator", "Product": "Semis (Fab)", "Products Grouped": "Semiconductor & Compute" },
                    { "Company": "Teradyne", "Country": "USA", "Mkt Cap ($mn)": 18187, "Category": "Integrator", "Product": "Testing Equipment", "Products Grouped": "Other" },
                    { "Company": "Teradyne", "Country": "USA", "Mkt Cap ($mn)": 18187, "Category": "Integrator", "Product": "Robotics", "Products Grouped": "Robotics" },
                    { "Company": "Sony Group", "Country": "Japan", "Mkt Cap ($mn)": 133800, "Category": "Integrator", "Product": "Vision", "Products Grouped": "Sensors/Electronics" },
                    { "Company": "Sony Group", "Country": "Japan", "Mkt Cap ($mn)": 133800, "Category": "Integrator", "Product": "Robotics", "Products Grouped": "Robotics" }
                ];
                setData(fallbackData);
                // Don't call renderMap directly here either - let the useEffect handle it

                // Set a warning instead of error
                setMapError(`Using static JSON data. Could not load dynamic CSV file: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    // Re-render map when category, subcategory, or countries change
    useEffect(() => {
        if (data.length > 0) {
            renderMap(data);
        }
    }, [selectedCategory, selectedSubcategory, selectedCountries, data]);

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

    // Get bubble data - modified to combine duplicate companies and show comma-separated categories/products
    const getBubbleData = (rawData) => {
        // Filter by category if needed
        let filteredData = selectedCategory === 'All'
            ? rawData
            : rawData.filter(item => item.Category === selectedCategory);

        // Filter by subcategory if needed
        if (selectedSubcategory && selectedSubcategory !== 'All') {
            filteredData = filteredData.filter(item => 
                item['Products Grouped'] === selectedSubcategory
            );
        }

        // Filter by countries if needed
        if (selectedCountries && !selectedCountries.includes('All')) {
            filteredData = filteredData.filter(item => 
                selectedCountries.includes(item.Country)
            );
        }

        // Group companies by company name and country to combine duplicates
        const companyGroups = {};
        
        filteredData.forEach(item => {
            const key = `${item.Company}_${item.Country}`;
            
            if (!companyGroups[key]) {
                companyGroups[key] = {
                    company: item.Company,
                    country: item.Country,
                    value: item['Mkt Cap ($mn)'], // Use the market cap from first occurrence
                    categories: new Set(),
                    productsGrouped: new Set(),
                    products: new Set()
                };
            }
            
            // Add unique categories, product groups, and products
            if (item.Category) companyGroups[key].categories.add(item.Category);
            if (item['Products Grouped']) companyGroups[key].productsGrouped.add(item['Products Grouped']);
            if (item.Product) companyGroups[key].products.add(item.Product);
        });

        // Convert sets to sorted comma-separated strings and create final data array
        const consolidatedData = Object.values(companyGroups).map(group => ({
            company: group.company,
            country: group.country,
            value: group.value,
            category: Array.from(group.categories).sort().join(', '),
            productsGrouped: Array.from(group.productsGrouped).sort().join(', '),
            product: Array.from(group.products).sort().join(', ')
        }));

        // Group companies by country for positioning
        const countryCounts = {};
        consolidatedData.forEach(item => {
            const country = item.country;
            if (!countryCounts[country]) {
                countryCounts[country] = 0;
            }
            countryCounts[country]++;
        });

        // Create a map for company positions to avoid duplicates
        const companyPositions = {};

        // Process each consolidated company
        return consolidatedData.map(item => {
            const country = item.country;
            const companyKey = `${item.company}_${country}`;

            // Calculate offset based on country company count
            let offsetX, offsetY;

            if (!companyPositions[companyKey]) {
                // Calculate a position around the country center
                const count = countryCounts[country];
                const index = Object.keys(companyPositions).filter(key =>
                    key.includes(`_${country}`)
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
                company: item.company,
                value: item.value,
                category: item.category,
                product: item.product,
                productsGrouped: item.productsGrouped,
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
            // Get bubble data (this will consolidate companies and apply all filters)
            const bubbleData = getBubbleData(rawData);

            // Check if we have any data after filtering
            if (bubbleData.length === 0) {
                console.warn('No companies match the current filter criteria');
                setIsLoading(false);
                return;
            }

            // Calculate bubble sizes - scale values to reasonable bubble sizes
            const valueExtent = d3.extent(bubbleData, d => d.value);
            const bubbleScale = d3.scaleSqrt()
                .domain(valueExtent)
                .range([4, 25]); // Reduced from [10, 60] to make circles smaller and differences more subtle

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
                .attr('stroke-width', 1.5) // Reduced from 2 to make stroke more subtle
                .attr('filter', 'url(#glow)')
                .attr('opacity', 0.7)
                .on('mouseover', function (event, d) {
                    // Using native event handling to avoid d3 map errors
                    const element = this;

                    // Highlight bubble on hover - make it more visible but still semi-transparent
                    d3.select(element)
                        .attr('stroke-width', 2.5) // Reduced from 3
                        .attr('opacity', 0.85);

                    // Show tooltip with company info including consolidated data
                    let tooltipHTML = `<strong>${d.company}</strong> (${d.country})<br>`;
                    tooltipHTML += `Market Cap: ${formatMarketCap(d.value)}<br>`;
                    
                    // Handle multiple categories
                    if (d.category) {
                        const categoryLabel = d.category.includes(',') ? 'Categories' : 'Category';
                        tooltipHTML += `${categoryLabel}: ${d.category}<br>`;
                    }
                    
                    // Handle multiple product groups
                    if (d.productsGrouped) {
                        const productGroupLabel = d.productsGrouped.includes(',') ? 'Product Groups' : 'Product Group';
                        tooltipHTML += `${productGroupLabel}: ${d.productsGrouped}<br>`;
                    }
                    
                    // Handle multiple products
                    if (d.product) {
                        const productLabel = d.product.includes(',') ? 'Products' : 'Product';
                        tooltipHTML += `${productLabel}: ${d.product}`;
                    }

                    setTooltipContent(tooltipHTML);
                    
                    // Calculate smart tooltip position with comprehensive boundary detection
                    const mouseX = event.pageX || event.clientX;
                    const mouseY = event.pageY || event.clientY;
                    
                    // Get window dimensions and detect mobile
                    const windowWidth = window.innerWidth;
                    const windowHeight = window.innerHeight;
                    const isMobile = windowWidth < 768;
                    
                    // Get scroll positions to handle scrolled content
                    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
                    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
                    
                    // Estimate tooltip dimensions more accurately (responsive based on screen size)
                    const estimatedLines = 5; // Approximate number of lines in tooltip
                    const lineHeight = isMobile ? 16 : 18;
                    const tooltipWidth = isMobile ? Math.min(windowWidth - 40, 280) : 320;
                    const tooltipHeight = estimatedLines * lineHeight + (isMobile ? 20 : 30); // padding
                    const margin = isMobile ? 12 : 20;
                    
                    // Calculate viewport boundaries (accounting for scroll)
                    const viewportLeft = scrollX;
                    const viewportRight = scrollX + windowWidth;
                    const viewportTop = scrollY;
                    const viewportBottom = scrollY + windowHeight;
                    
                    // Start with default positioning (right and above cursor)
                    let tooltipX = mouseX + margin;
                    let tooltipY = mouseY - tooltipHeight - margin;
                    
                    // Horizontal positioning with comprehensive boundary checks
                    if (tooltipX + tooltipWidth > viewportRight - margin) {
                        // Try positioning to the left of cursor
                        tooltipX = mouseX - tooltipWidth - margin;
                        
                        // If still doesn't fit, position against right edge
                        if (tooltipX < viewportLeft + margin) {
                            tooltipX = viewportRight - tooltipWidth - margin;
                        }
                    }
                    
                    // Ensure we don't go off the left edge
                    if (tooltipX < viewportLeft + margin) {
                        tooltipX = viewportLeft + margin;
                    }
                    
                    // Vertical positioning with comprehensive boundary checks
                    if (tooltipY < viewportTop + margin) {
                        // Try positioning below cursor
                        tooltipY = mouseY + margin;
                        
                        // If that goes off bottom, position against top edge
                        if (tooltipY + tooltipHeight > viewportBottom - margin) {
                            tooltipY = viewportTop + margin;
                        }
                    }
                    
                    // Ensure we don't go off the bottom edge
                    if (tooltipY + tooltipHeight > viewportBottom - margin) {
                        tooltipY = viewportBottom - tooltipHeight - margin;
                    }
                    
                    // Final safety check for very small screens
                    if (isMobile) {
                        // On mobile, prefer centering horizontally if there's space
                        if (windowWidth > tooltipWidth + 80) {
                            const centerX = (windowWidth - tooltipWidth) / 2 + scrollX;
                            const distanceFromMouse = Math.abs(centerX - mouseX);
                            
                            // Only center if mouse is reasonably close to center
                            if (distanceFromMouse < windowWidth * 0.3) {
                                tooltipX = centerX;
                            }
                        }
                        
                        // On mobile, ensure tooltip is not too close to edges
                        tooltipX = Math.max(viewportLeft + 10, Math.min(tooltipX, viewportRight - tooltipWidth - 10));
                        tooltipY = Math.max(viewportTop + 10, Math.min(tooltipY, viewportBottom - tooltipHeight - 10));
                    }
                    
                    setTooltipPosition({
                        x: tooltipX,
                        y: tooltipY
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

            // Add company labels near bubbles (changed from country names to company names)
            bubbleGroup.selectAll('text')
                .data(bubbleData)
                .enter()
                .append('text')
                .attr('x', d => projection(d.displayCoordinates)[0])
                .attr('y', d => projection(d.displayCoordinates)[1] + bubbleScale(d.value) + 8) // Reduced offset since circles are smaller
                .attr('text-anchor', 'middle')
                .attr('font-family', 'Helvetica, Arial, sans-serif')
                .attr('font-size', '8px') // Reduced from 10px since circles are smaller
                .attr('font-weight', 'bold')
                .attr('fill', '#333')
                .text(d => d.company) // Changed from d.country to d.company
                .each(function (d) {
                    // Create a background for the text for better readability
                    const bbox = this.getBBox();
                    const padding = 1.5; // Reduced padding

                    const rect = bubbleGroup.insert('rect', 'text')
                        .attr('x', bbox.x - padding)
                        .attr('y', bbox.y - padding)
                        .attr('width', bbox.width + (padding * 2))
                        .attr('height', bbox.height + (padding * 2))
                        .attr('fill', 'white')
                        .attr('opacity', 0.7)
                        .attr('rx', 1.5); // Reduced border radius
                });

            // Add legend with adjusted dimensions for smaller bubbles
            const legendGroup = svg.append('g')
                .attr('class', 'legend')
                .attr('transform', `translate(20, ${viewH - 120})`); // Adjusted position since bubbles are smaller

            // Legend background with adjusted width and height
            legendGroup.append('rect')
                .attr('x', -15)
                .attr('y', -20)
                .attr('width', 300) // Reduced from 350
                .attr('height', 110) // Reduced from 140
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
                .text(() => {
                    let title = 'Market Cap by Company';
                    
                    // Add category info
                    if (selectedCategory !== 'All') {
                        title += ` (${selectedCategory})`;
                    }
                    
                    // Add country info if specific countries are selected
                    if (selectedCountries && !selectedCountries.includes('All')) {
                        if (selectedCountries.length === 1) {
                            title += ` - ${selectedCountries[0]}`;
                        } else if (selectedCountries.length <= 3) {
                            title += ` - ${selectedCountries.join(', ')}`;
                        } else {
                            title += ` - ${selectedCountries.length} countries`;
                        }
                    }
                    
                    return title;
                });

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
                // Adjusted spacing for smaller bubbles
                const cy = 40; // Adjusted position
                const cx = i * 90 + 40; // Reduced spacing from 110 to 90

                // Add bubble
                legendGroup.append('circle')
                    .attr('cx', cx)
                    .attr('cy', cy)
                    .attr('r', bubbleScale(value))
                    .attr('fill', fillColor)
                    .attr('stroke', strokeColor)
                    .attr('stroke-width', 1.5); // Reduced to match main bubbles

                // Add value label with adjusted spacing
                legendGroup.append('text')
                    .attr('x', cx)
                    .attr('y', cy + bubbleScale(value) + 15) // Adjusted for smaller bubbles
                    .attr('text-anchor', 'middle')
                    .attr('font-family', 'Helvetica, Arial, sans-serif')
                    .attr('font-size', '11px') // Slightly reduced
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
        left: tooltipPosition.x,
        top: tooltipPosition.y,
        backgroundColor: 'rgba(0,0,0,0.9)',
        color: '#fff',
        padding: window.innerWidth < 768 ? '8px 12px' : '12px 16px',
        borderRadius: '8px',
        fontSize: window.innerWidth < 768 ? '12px' : '13px',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        lineHeight: window.innerWidth < 768 ? '1.3' : '1.4',
        pointerEvents: 'none',
        opacity: showTooltip ? 1 : 0,
        transition: 'opacity 0.15s ease-in-out',
        zIndex: 9999, // Higher z-index to ensure it's always on top
        maxWidth: window.innerWidth < 768 ? `${Math.min(window.innerWidth - 40, 280)}px` : '320px',
        minWidth: window.innerWidth < 768 ? '180px' : '200px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        border: '1px solid rgba(255,255,255,0.15)',
        // Ensure tooltip content wraps properly
        wordWrap: 'break-word',
        whiteSpace: 'normal',
        // Prevent tooltip from affecting page layout
        transform: 'translateZ(0)', // Force hardware acceleration
        willChange: 'opacity' // Optimize for animations
    };

    return (
        <div style={containerStyle}>
            {isLoading && <div style={loadingStyle}>Loading map...</div>}
            {mapError && !errorDismissed && (
                <div style={warningStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <p style={warningContent}>
                            <strong>Note:</strong> {mapError}
                        </p>
                        <button
                            onClick={() => setErrorDismissed(true)}
                            style={{
                                marginLeft: '8px',
                                padding: '2px 6px',
                                fontSize: '12px',
                                backgroundColor: '#78350f',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '3px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                flexShrink: 0
                            }}
                            title="Dismiss notification"
                        >
                            ×
                        </button>
                    </div>
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