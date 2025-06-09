# Humanoid Robot Value Chain

An interactive visualization tool for analyzing the global humanoid robotics industry ecosystem, mapping companies across the entire value chain from brain (AI/software) to body (hardware) to integrators (complete systems).

## 🌟 Features

### **Interactive World Map**
- **Geographic Visualization**: Companies plotted on a world map with market cap-sized bubbles
- **Company Consolidation**: Multiple product lines from the same company are intelligently combined
- **Smart Tooltips**: Hover over bubbles to see detailed company information
- **Category Color Coding**: Brain (red), Body (green), Integrator (yellow)

### **Advanced Filtering System**
- **Category Filter**: Brain, Body, Integrator, or All
- **Product Group Filter**: 19+ subcategories (AI & Software, Sensors/Electronics, etc.)
- **Country Multi-Select**: Compare specific countries or regions
- **Dynamic Filtering**: Filters work together to provide precise views

### **Matrix Table View**
- **Gap Analysis**: Easily spot countries with zero companies in specific areas
- **Country Comparison**: Side-by-side comparison of robotics capabilities
- **Company Counts**: Number of companies per product group per country
- **Sorted by Impact**: Countries ordered by total company count

## 🚀 How to Use

### **Basic Navigation**
1. **Map View**: Default view showing companies as bubbles on world map
2. **Table View**: Click "Show Table" to switch to matrix comparison view
3. **Filters**: Use dropdowns to narrow down your analysis

### **Filtering Options**
- **Category**: Select Brain, Body, or Integrator to focus on specific value chain segments
- **Product Group**: Drill down to specific technologies (e.g., "AI & Software", "Energy & Power")
- **Countries**: Click countries multiple times to select/deselect for comparison

### **Finding Insights**
- **Market Gaps**: Look for "—" symbols in table view to find underserved markets
- **Competitive Landscape**: Compare country strengths across product categories
- **Market Size**: Bubble size indicates company market capitalization
- **Geographic Clusters**: Identify regional technology hubs

## 📊 Product Categories

### **Brain Companies** (Software, AI, Computing)
- AI & Software
- Automation Software  
- Semiconductor & Compute
- Sensors/Electronics
- Software/Simulation

### **Body Companies** (Hardware, Components)
- Mechanical & Motion
- Energy & Power
- Sensors/Electronics
- Industrial/Automation
- Mechanical (Cast/Frames)

### **Integrator Companies** (Complete Systems)
- Automotive/Transportation
- Consumer/Internet
- Robotics
- Electronics
- Telecommunications

## 🛠 Technology Stack

- **Frontend**: React.js
- **Visualization**: D3.js for maps and data visualization
- **Mapping**: TopoJSON for world geography
- **Data Processing**: Papa Parse for CSV handling
- **Styling**: Vanilla CSS with responsive design

## 📁 Data Source

The visualization uses `public/data/full_dataset.csv` containing:
- **135+ companies** across the robotics value chain
- **Market capitalization data** for bubble sizing
- **Geographic distribution** across 11+ countries
- **Product categorization** with 19+ subcategories

## 🌐 GitHub Pages Deployment

This project is configured to deploy to GitHub Pages automatically. The live site is available at:
**https://nssokada.github.io/QuadJapan_HumanoidRobot/**

### **Automatic Deployment (Recommended)**
The repository includes a GitHub Actions workflow that automatically deploys when you push to the `main` branch:

1. **Push your changes** to the `main` branch
2. **GitHub Actions** will automatically:
   - Install dependencies
   - Build the project (creates `docs` folder)
   - Deploy to `gh-pages` branch
3. **Your site updates** within a few minutes

### **Manual Deployment**
If you prefer manual deployment:

```bash
# Build the project (creates docs folder)
npm run build

# The docs folder is ready for GitHub Pages
# Commit and push the docs folder to main branch
git add docs
git commit -m "Update build"
git push origin main
```

### **GitHub Pages Setup**
If setting up for the first time:

1. Go to your repository **Settings**
2. Navigate to **"Pages"** section  
3. Set **Source** to "Deploy from a branch"
4. Select **`gh-pages`** branch and **`/ (root)`** folder
5. Save settings
6. Your site will be live at the homepage URL in a few minutes

### **Local Testing**
```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

## 🎯 Use Cases

### **Business Intelligence**
- **Market Entry Strategy**: Identify countries with gaps in specific technologies
- **Competitive Analysis**: Compare your country's capabilities vs competitors
- **Supply Chain Planning**: Find potential partners across the value chain

### **Investment Research**
- **Market Opportunities**: Spot underserved geographic markets
- **Industry Trends**: Analyze market cap concentration by country/category
- **Due Diligence**: Research company landscapes in target markets

### **Policy & Research**
- **Economic Development**: Identify areas for industrial policy focus
- **Innovation Ecosystems**: Compare national robotics capabilities
- **Academic Research**: Analyze global technology distribution patterns

## 📱 Responsive Design

- **Desktop**: Full-featured map and table views
- **Mobile**: Optimized tooltips and responsive layout
- **Touch-Friendly**: Large buttons and touch targets
- **Cross-Browser**: Works on all modern browsers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Data Sources**: Market capitalization and company categorization research
- **Mapping**: World Atlas TopoJSON data
- **Design**: Inspired by modern data visualization best practices

---

**Built for analyzing the global humanoid robotics ecosystem** 🤖 