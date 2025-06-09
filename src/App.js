import React, { useState, useEffect } from 'react';
import WorldMap from './WorldMap';
import Papa from 'papaparse';

function App() {
    // State for category, subcategory, country selection, and view mode
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedSubcategory, setSelectedSubcategory] = useState('All');
    const [selectedCountries, setSelectedCountries] = useState(['All']); // Array to support multi-select
    const [viewMode, setViewMode] = useState('map'); // 'map' or 'table'
    const [availableSubcategories, setAvailableSubcategories] = useState([]);
    const [availableCountries, setAvailableCountries] = useState([]);
    const [data, setData] = useState([]);

    // Load data once on component mount to get subcategories and countries
    useEffect(() => {
        const loadData = async () => {
            try {
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

                setData(parsedData.data);
                
                // Extract unique subcategories
                const subcategories = [...new Set(
                    parsedData.data
                        .map(item => item['Products Grouped'])
                        .filter(Boolean)
                )].sort();
                
                setAvailableSubcategories(subcategories);

                // Extract unique countries
                const countries = [...new Set(
                    parsedData.data
                        .map(item => item.Country)
                        .filter(Boolean)
                )].sort();
                
                setAvailableCountries(countries);
            } catch (error) {
                console.error('Error loading data for subcategories and countries:', error);
                // Fallback data if there's an error - complete dataset matching CSV
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

                // Fallback subcategories
                setAvailableSubcategories([
                    'AI & Software',
                    'Automation Software',
                    'Automotive/Transportation',
                    'Consumer/Internet',
                    'Electronics',
                    'Energy & Power',
                    'Industrial/Automation',
                    'Mechanical & Motion',
                    'Mechanical (Cast/Frames)',
                    'Other',
                    'Other Systems',
                    'Robotics',
                    'Semiconductor & Compute',
                    'Sensors',
                    'Sensors/Electronics',
                    'Software/Simulation',
                    'Telecommunications'
                ]);
                
                // Fallback countries
                setAvailableCountries([
                    'Canada', 'China', 'France', 'Germany', 'Japan', 
                    'Korea', 'Sweden', 'Switzerland', 'Taiwan', 'UK', 'USA'
                ]);
            }
        };

        loadData();
    }, []);

    // Get filtered subcategories based on selected category and countries
    const getFilteredSubcategories = () => {
        if (selectedCategory === 'All') {
            return availableSubcategories;
        }
        
        // Filter subcategories based on the selected category and countries
        let filteredData = data.filter(item => item.Category === selectedCategory);
        
        // Further filter by selected countries if not "All"
        if (!selectedCountries.includes('All')) {
            filteredData = filteredData.filter(item => 
                selectedCountries.includes(item.Country)
            );
        }
            
        const categoryFiltered = filteredData
            .map(item => item['Products Grouped'])
            .filter(Boolean);
            
        return [...new Set(categoryFiltered)].sort();
    };

    // Event handler for category change
    const handleCategoryChange = (event) => {
        console.log('Selected Category:', event.target.value);
        setSelectedCategory(event.target.value);
        // Reset subcategory when category changes
        setSelectedSubcategory('All');
    };

    // Event handler for subcategory change
    const handleSubcategoryChange = (event) => {
        console.log('Selected Subcategory:', event.target.value);
        setSelectedSubcategory(event.target.value);
    };

    // Event handler for country selection change
    const handleCountryChange = (event) => {
        const value = event.target.value;
        console.log('Country selection changed:', value);
        
        if (value === 'All') {
            setSelectedCountries(['All']);
        } else {
            setSelectedCountries(prev => {
                // Remove 'All' if it's selected and we're adding a specific country
                const withoutAll = prev.filter(country => country !== 'All');
                
                if (withoutAll.includes(value)) {
                    // Remove the country if it's already selected
                    const updated = withoutAll.filter(country => country !== value);
                    // If no countries left, default to 'All'
                    return updated.length === 0 ? ['All'] : updated;
                } else {
                    // Add the country
                    return [...withoutAll, value];
                }
            });
        }
        
        // Reset subcategory when countries change
        setSelectedSubcategory('All');
    };

    // Function to clear all country selections (reset to All)
    const clearCountrySelection = () => {
        setSelectedCountries(['All']);
        setSelectedSubcategory('All');
    };

    // Generate matrix data for table view
    const generateMatrixData = () => {
        if (!data.length) return { matrix: {}, subcategories: [], countries: [], countryTotals: {} };

        // Filter data based on current selections (but ignore subcategory for matrix)
        let filteredData = selectedCategory === 'All'
            ? data
            : data.filter(item => item.Category === selectedCategory);

        // Apply country filter
        if (!selectedCountries.includes('All')) {
            filteredData = filteredData.filter(item => 
                selectedCountries.includes(item.Country)
            );
        }

        // Get unique subcategories from filtered data
        const subcategories = [...new Set(
            filteredData
                .map(item => item['Products Grouped'])
                .filter(Boolean)
        )].sort();

        // Get countries and calculate total company count for each
        const baseCountries = selectedCountries.includes('All') 
            ? availableCountries 
            : selectedCountries;

        // Calculate total unique companies per country
        const countryTotals = {};
        baseCountries.forEach(country => {
            const companies = new Set();
            filteredData
                .filter(item => item.Country === country)
                .forEach(item => companies.add(item.Company));
            countryTotals[country] = companies.size;
        });

        // Sort countries by total company count (descending)
        const countries = baseCountries.sort((a, b) => countryTotals[b] - countryTotals[a]);

        // Create matrix: subcategory -> country -> company count
        const matrix = {};
        
        subcategories.forEach(subcategory => {
            matrix[subcategory] = {};
            countries.forEach(country => {
                // Count unique companies in this subcategory and country
                const companies = new Set();
                filteredData
                    .filter(item => 
                        item['Products Grouped'] === subcategory && 
                        item.Country === country
                    )
                    .forEach(item => companies.add(item.Company));
                
                matrix[subcategory][country] = companies.size;
            });
        });

        return { matrix, subcategories, countries, countryTotals };
    };

    // Table view component
    const TableView = () => {
        const { matrix, subcategories, countries, countryTotals } = generateMatrixData();

        if (!subcategories.length || !countries.length) {
            return (
                <div style={{ 
                    padding: '40px', 
                    textAlign: 'center', 
                    color: '#666',
                    fontSize: '16px'
                }}>
                    No data available for the current filter selection.
                </div>
            );
        }

        return (
            <div style={{ 
                padding: '20px', 
                overflow: 'auto', 
                height: '100%',
                backgroundColor: '#f9fafb',
                paddingBottom: '60px'
            }}>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    marginBottom: '40px'
                }}>
                    <div style={{
                        padding: '16px 20px',
                        borderBottom: '1px solid #e5e7eb',
                        backgroundColor: '#f8f9fa'
                    }}>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                            Company Count Matrix
                        </h3>
                        <p style={{ margin: '4px 0 0', color: '#666', fontSize: '14px' }}>
                            Number of companies by product group and country
                        </p>
                    </div>
                    
                    <div style={{ overflow: 'auto', maxHeight: 'calc(100vh - 350px)' }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            fontSize: '14px'
                        }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8f9fa' }}>
                                    <th style={{
                                        padding: '12px 16px',
                                        textAlign: 'left',
                                        fontWeight: '600',
                                        borderBottom: '2px solid #e5e7eb',
                                        position: 'sticky',
                                        left: 0,
                                        backgroundColor: '#f8f9fa',
                                        zIndex: 10,
                                        minWidth: '200px'
                                    }}>
                                        Product Group
                                    </th>
                                    {countries.map(country => (
                                        <th key={country} style={{
                                            padding: '12px 16px',
                                            textAlign: 'center',
                                            fontWeight: '600',
                                            borderBottom: '2px solid #e5e7eb',
                                            minWidth: '80px'
                                        }}>
                                            <div>{country}</div>
                                            <div style={{ 
                                                fontSize: '12px', 
                                                fontWeight: '400', 
                                                color: '#666',
                                                marginTop: '2px'
                                            }}>
                                                ({countryTotals[country]} total)
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {subcategories.map((subcategory, index) => (
                                    <tr key={subcategory} style={{
                                        backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb'
                                    }}>
                                        <td style={{
                                            padding: '12px 16px',
                                            fontWeight: '500',
                                            borderBottom: '1px solid #e5e7eb',
                                            position: 'sticky',
                                            left: 0,
                                            backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb',
                                            zIndex: 5
                                        }}>
                                            {subcategory}
                                        </td>
                                        {countries.map(country => {
                                            const count = matrix[subcategory][country] || 0;
                                            return (
                                                <td key={country} style={{
                                                    padding: '12px 16px',
                                                    textAlign: 'center',
                                                    borderBottom: '1px solid #e5e7eb',
                                                    color: count === 0 ? '#9ca3af' : '#111827',
                                                    fontWeight: count > 0 ? '600' : 'normal'
                                                }}>
                                                    {count === 0 ? '—' : count}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Bottom spacing to prevent last row cutoff */}
                    <div style={{ height: '80px' }}></div>
                </div>
            </div>
        );
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
        // If a specific subcategory is selected, show its definition
        if (selectedSubcategory !== 'All') {
            return getSubcategoryDescription(selectedCategory, selectedSubcategory);
        }

        // Otherwise show the general category description
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

    // Get subcategory definitions
    const getSubcategoryDescription = (category, subcategory) => {
        const subcategoryDefinitions = {
            'Body': {
                'Mechanical & Motion': 'Physical components that enable motion or transmit force in robotic systems.',
                'Mechanical (Cast/Frames)': 'Structural or metallic components that provide the framework of a robot.',
                'Sensors': 'Hardware modules specifically designed to gather data from the environment.',
                'Sensors/Electronics': 'Advanced sensor or electronic subsystems, including integrated sensing, capturing, or control boards.',
                'Energy & Power': 'Components that store or supply power for robotic operations.',
                'Industrial/Automation': 'Broad or integrated hardware solutions used in industrial or automated manufacturing contexts.',
                'Electronics': 'General or broad electronic components that may not be specialized sensors or semiconductors.',
                'Other Systems': 'Miscellaneous or specialized hardware systems that don\'t naturally fit into other groupings.',
                'Software/Simulation': 'Software tools used to simulate mechanical or system-level behavior in a robotics context.',
                'Other': 'Any product within the "Body" category that hasn\'t been explicitly classified above.'
            },
            'Brain': {
                'AI & Software': 'Higher-level software capabilities, from foundational AI models to data analytics.',
                'Automation Software': 'Software for orchestrating large-scale or complex automation processes.',
                'Semiconductor & Compute': 'Hardware or IP cores related to chips, memory, or specialized computing engines (like GPUs for AI).',
                'Sensors/Electronics': 'Electronics or sensor solutions that require specialized processing or semiconductor design.',
                'Mechanical & Motion': 'Motor-control firmware or integrated driver chips.',
                'Software/Simulation': 'Simulation or modeling tools specifically for AI, control loops, or digital twins.',
                'Other': 'Any "Brain" product that doesn\'t neatly fit in the above groups.'
            },
            'Integrator': {
                'Automotive/Transportation': 'Full vehicle or mobility integrators, including traditional cars and new aerial eVTOL concepts.',
                'Consumer/Internet': 'Companies or products catering to consumer tech, e-commerce, and internet services.',
                'Mechanical & Motion': 'Integrators or final systems emphasizing mechanical solutions or motion control at a high level.',
                'Electronics': 'Companies delivering integrated electronic systems or platforms.',
                'Energy & Power': 'Systems or integrators supplying full-scale energy solutions.',
                'Robotics': 'Broad integrators that deliver complete robotic solutions (hardware + software).',
                'Telecommunications': 'Communications networks or satellite solutions.',
                'Semiconductor & Compute': 'Integrators that handle or produce large-scale chip manufacturing or memory at a systems level.',
                'Sensors/Electronics': 'Final integrators focusing on sensor solutions or advanced electronics.',
                'Other': 'Any "Integrator" product not placed into a main grouping.'
            }
        };

        // Return the specific subcategory definition, or a fallback if not found
        return subcategoryDefinitions[category]?.[subcategory] || 
               `${subcategory} products within the ${category} category`;
    };

    // Get current view description
    const getCurrentViewDescription = () => {
        let description = selectedCategory;
        if (selectedSubcategory !== 'All') {
            description += ` → ${selectedSubcategory}`;
        }
        
        // Add country information
        if (!selectedCountries.includes('All')) {
            const countryText = selectedCountries.length === 1 
                ? selectedCountries[0]
                : `${selectedCountries.length} countries (${selectedCountries.slice(0, 2).join(', ')}${selectedCountries.length > 2 ? '...' : ''})`;
            description += ` | ${countryText}`;
        }
        
        return description;
    };

    const filteredSubcategories = getFilteredSubcategories();

    return (
        <div className="App" style={appStyle}>
            <header style={headerStyle}>
                <h1>Humanoid Robot Value Chain</h1>
                <p style={{ margin: '5px 0 0', color: '#666' }}>
                    Market capitalization data for individual robotics companies by category, product group, and country
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

                <div>
                    <span style={labelStyle}>Product Group:</span>
                    <select
                        style={selectStyle}
                        value={selectedSubcategory}
                        onChange={handleSubcategoryChange}
                        disabled={filteredSubcategories.length === 0}
                    >
                        <option value="All">All Product Groups</option>
                        {filteredSubcategories.map(subcategory => (
                            <option key={subcategory} value={subcategory}>
                                {subcategory}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <span style={labelStyle}>Countries:</span>
                    <select
                        style={selectStyle}
                        value="" // Always empty to allow repeated selections
                        onChange={handleCountryChange}
                    >
                        <option value="">Select countries...</option>
                        <option value="All">All Countries</option>
                        {availableCountries.map(country => (
                            <option key={country} value={country}>
                                {country} {selectedCountries.includes(country) ? '✓' : ''}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Country selection display and clear button */}
                {!selectedCountries.includes('All') && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ 
                            padding: '4px 8px', 
                            backgroundColor: '#e3f2fd', 
                            borderRadius: '4px', 
                            fontSize: '12px',
                            border: '1px solid #90caf9'
                        }}>
                            {selectedCountries.length === 1 
                                ? selectedCountries[0]
                                : `${selectedCountries.length} countries selected`
                            }
                        </div>
                        <button
                            onClick={clearCountrySelection}
                            style={{
                                padding: '2px 6px',
                                fontSize: '12px',
                                backgroundColor: '#f44336',
                                color: 'white',
                                border: 'none',
                                borderRadius: '3px',
                                cursor: 'pointer'
                            }}
                            title="Clear country selection"
                        >
                            Clear
                        </button>
                    </div>
                )}

                <div style={{ marginLeft: 'auto', fontSize: '14px' }}>
                    <strong>Current View:</strong> {getCurrentViewDescription()} - {getCategoryDescription()}
                </div>

                {/* View Toggle Button */}
                <div style={{ marginLeft: '15px' }}>
                    <button
                        onClick={() => setViewMode(viewMode === 'map' ? 'table' : 'map')}
                        style={{
                            padding: '8px 16px',
                            fontSize: '14px',
                            backgroundColor: viewMode === 'map' ? '#2563eb' : '#16a34a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: '500'
                        }}
                        title={`Switch to ${viewMode === 'map' ? 'table' : 'map'} view`}
                    >
                        {viewMode === 'map' ? 'Show Table' : 'Show Map'}
                    </button>
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
                    <strong>How to use:</strong> Select category, product group, and countries to filter companies. 
                    Click on countries multiple times to select/deselect them for comparison.
                    Use the <strong>Show Table</strong> button to view a matrix that highlights gaps (countries with 0 companies in specific areas).
                    In map view: Hover over bubbles to see company details. 
                    Each bubble represents a company, with size indicating market capitalization.
                    Colors indicate company category: <span style={{ color: '#dc2626' }}>Brain</span> (red),
                    <span style={{ color: '#16a34a' }}> Body</span> (green), or
                    <span style={{ color: '#ca8a04' }}> Integrator</span> (yellow).
                </p>
            </div>

            {/* Main Content Container */}
            <div style={mapContainerStyle}>
                {viewMode === 'map' ? (
                    <WorldMap 
                        selectedCategory={selectedCategory} 
                        selectedSubcategory={selectedSubcategory}
                        selectedCountries={selectedCountries}
                    />
                ) : (
                    <TableView />
                )}
            </div>
        </div>
    );
}

export default App;