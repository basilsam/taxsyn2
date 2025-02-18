const initMap = () => {
    const map = L.map('map').setView([10.043413, 76.344153], 12);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    return map;
};

// Drawing controls setup
const setupDrawControls = (map) => {
    const drawnFeatures = new L.FeatureGroup().addTo(map);

    const drawControl = new L.Control.Draw({
        edit: {
            featureGroup: drawnFeatures,
            remove: true
        },
        draw: {
            polygon: {
                allowIntersection: false,
                shapeOptions: { color: 'purple' }
            },
            polyline: {
                shapeOptions: { color: 'red' }
            },
            rectangle: {
                shapeOptions: { color: 'green' }
            },
            circle: {
                shapeOptions: { color: 'steelblue' }
            },
            marker: true,
            circlemarker: false
        }
    });

    map.addControl(drawControl);
    return drawnFeatures;
};

// Search functionality
const setupSearch = (map) => {
    const searchInput = document.getElementById('searchInput');
    const suggestionsContainer = document.getElementById('suggestions');
    let debounceTimer;

    const debounce = (func, delay) => {
        return (...args) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(this, args), delay);
        };
    };

    const fetchSuggestions = async (query) => {
        if (query.length < 3) {
            suggestionsContainer.innerHTML = '';
            return;
        }

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(query)}`
            );
            
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            displaySuggestions(data);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            suggestionsContainer.innerHTML = '<div class="autocomplete-suggestion">Error fetching results</div>';
        }
    };

    const displaySuggestions = (suggestions) => {
        suggestionsContainer.innerHTML = suggestions.length ? 
            suggestions.map(item => `
                <div class="autocomplete-suggestion" 
                     data-lat="${item.lat}" 
                     data-lon="${item.lon}">
                    ${item.display_name}
                </div>
            `).join('') :
            '<div class="autocomplete-suggestion">No results found</div>';
    };

    const handleSuggestionClick = (event) => {
        const suggestion = event.target.closest('.autocomplete-suggestion');
        if (!suggestion) return;

        const lat = parseFloat(suggestion.dataset.lat);
        const lon = parseFloat(suggestion.dataset.lon);

        if (!isNaN(lat) && !isNaN(lon)) {
            map.setView([lat, lon], 14);
            searchInput.value = suggestion.textContent.trim();
            suggestionsContainer.innerHTML = '';
        }
    };

    // Event listeners
    searchInput.addEventListener('input', debounce(e => fetchSuggestions(e.target.value.trim()), 300));
    suggestionsContainer.addEventListener('click', handleSuggestionClick);

    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            suggestionsContainer.innerHTML = '';
        }
    });
};

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize map
        const map = initMap();

        // Setup drawing controls
        const drawnFeatures = setupDrawControls(map);

        // Setup event listeners for drawn features
        map.on('draw:created', (e) => {
            const layer = e.layer;
            const geoJSON = layer.toGeoJSON();
            
            layer.bindPopup(`
                <pre style="max-height: 200px; overflow: auto;">
                    ${JSON.stringify(geoJSON, null, 2)}
                </pre>
            `);
            
            drawnFeatures.addLayer(layer);
        });

        map.on('draw:edited', (e) => {
            e.layers.eachLayer((layer) => {
                const geoJSON = layer.toGeoJSON();
                layer.setPopupContent(`
                    <pre style="max-height: 200px; overflow: auto;">
                        ${JSON.stringify(geoJSON, null, 2)}
                    </pre>
                `);
            });
        });

        // Setup search functionality
        setupSearch(map);

    } catch (error) {
        console.error('Error initializing map application:', error);
        document.body.innerHTML = `
            <div style="padding: 20px; text-align: center;">
                <h2>Error loading map</h2>
                <p>Please try refreshing the page. If the problem persists, contact support.</p>
            </div>
        `;
    }
});