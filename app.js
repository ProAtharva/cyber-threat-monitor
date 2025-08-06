// Cyber Threat Monitor Application
class ThreatMonitor {
    constructor() {
        this.currentView = 'dashboard';
        this.threats = [];
        this.alerts = [];
        this.charts = {};
        this.updateInterval = null;
        
        // Sample data from provided JSON
        this.threatTypes = ["Malware", "Phishing", "DDoS", "Botnet", "Ransomware", "Trojan", "Spyware", "Adware"];
        this.severityLevels = ["Critical", "High", "Medium", "Low"];
        this.countries = ["US", "CN", "RU", "DE", "FR", "GB", "JP", "KR", "BR", "IN"];
        this.sources = ["VirusTotal", "AbuseIPDB", "URLVoid", "ThreatCrowd", "OTX", "MISP"];
        
        this.init();
    }
    
    init() {
        this.generateInitialData();
        this.setupEventListeners();
        this.initCharts();
        this.startRealTimeUpdates();
        this.updateDashboard();
        this.updateThreatFeed();
        this.updateAlerts();
        this.updateAnalytics();
    }
    
    generateInitialData() {
        // Generate initial threat data
        for (let i = 0; i < 50; i++) {
            this.threats.push(this.generateThreat());
        }
        
        // Generate initial alerts
        for (let i = 0; i < 10; i++) {
            this.alerts.push(this.generateAlert());
        }
    }
    
    generateThreat() {
        const now = new Date();
        const pastTime = new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000);
        
        return {
            id: `THR-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            timestamp: pastTime.toISOString(),
            ip: this.generateIP(),
            country: this.countries[Math.floor(Math.random() * this.countries.length)],
            threat_type: this.threatTypes[Math.floor(Math.random() * this.threatTypes.length)],
            severity: this.severityLevels[Math.floor(Math.random() * this.severityLevels.length)],
            confidence: Math.floor(Math.random() * 40) + 60,
            source: this.sources[Math.floor(Math.random() * this.sources.length)],
            description: this.generateDescription(),
            status: Math.random() > 0.7 ? 'Investigating' : 'Active'
        };
    }
    
    generateAlert() {
        const now = new Date();
        const pastTime = new Date(now.getTime() - Math.random() * 12 * 60 * 60 * 1000);
        const severities = ['Critical', 'High', 'Medium'];
        const severity = severities[Math.floor(Math.random() * severities.length)];
        
        return {
            id: `ALT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            timestamp: pastTime.toISOString(),
            title: this.generateAlertTitle(severity),
            description: this.generateAlertDescription(),
            severity: severity,
            acknowledged: Math.random() > 0.6,
            source: this.sources[Math.floor(Math.random() * this.sources.length)]
        };
    }
    
    generateIP() {
        return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    }
    
    generateDescription() {
        const descriptions = [
            "Suspicious network activity detected",
            "Known malicious IP identified",
            "Potential data exfiltration attempt",
            "Botnet communication detected",
            "Ransomware signature identified",
            "Phishing campaign in progress",
            "DDoS attack vector identified",
            "Trojan horse behavior detected"
        ];
        return descriptions[Math.floor(Math.random() * descriptions.length)];
    }
    
    generateAlertTitle(severity) {
        const titles = {
            'Critical': [
                "Active Ransomware Detected",
                "Data Breach Attempt",
                "Critical System Compromise",
                "Advanced Persistent Threat"
            ],
            'High': [
                "Suspicious Login Activity",
                "Malware Propagation Detected",
                "Network Intrusion Attempt",
                "Privilege Escalation Alert"
            ],
            'Medium': [
                "Unusual Traffic Pattern",
                "Policy Violation Detected",
                "Authentication Anomaly",
                "Configuration Drift Alert"
            ]
        };
        const titleArray = titles[severity];
        return titleArray[Math.floor(Math.random() * titleArray.length)];
    }
    
    generateAlertDescription() {
        const descriptions = [
            "Automated security systems have identified potential threat activity requiring immediate attention.",
            "Anomalous behavior patterns detected across multiple network segments.",
            "Security policy violations have been identified in system logs.",
            "Threat intelligence indicates elevated risk levels for your organization."
        ];
        return descriptions[Math.floor(Math.random() * descriptions.length)];
    }
    
    setupEventListeners() {
        // Navigation tabs - using event delegation to ensure it works
        document.addEventListener('click', (e) => {
            if (e.target.matches('.nav-tab') || e.target.closest('.nav-tab')) {
                const tab = e.target.matches('.nav-tab') ? e.target : e.target.closest('.nav-tab');
                const targetView = tab.dataset.tab;
                if (targetView) {
                    this.switchView(targetView);
                }
            }
        });
        
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
        
        // Modal close
        const modalClose = document.getElementById('modal-close');
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.closeModal();
            });
        }
        
        // Search functionality - prevent event bubbling issues
        const searchInput = document.getElementById('threat-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                e.stopPropagation();
                this.filterThreats(e.target.value);
            });
            
            searchInput.addEventListener('focus', (e) => {
                e.stopPropagation();
            });
            
            searchInput.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
        
        // Severity filter
        const severityFilter = document.getElementById('severity-filter');
        if (severityFilter) {
            severityFilter.addEventListener('change', (e) => {
                this.filterThreatsBySeverity(e.target.value);
            });
        }
        
        // Export button
        const exportBtn = document.getElementById('export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportThreats();
            });
        }
        
        // Alert filter
        const alertFilter = document.getElementById('alert-filter');
        if (alertFilter) {
            alertFilter.addEventListener('change', (e) => {
                this.filterAlerts(e.target.value);
            });
        }
        
        // Close modal when clicking outside
        const modal = document.getElementById('threat-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target.id === 'threat-modal') {
                    this.closeModal();
                }
            });
        }
        
        // Handle threat row clicks using event delegation
        document.addEventListener('click', (e) => {
            const threatRow = e.target.closest('#threat-table-body tr');
            if (threatRow && !e.target.matches('button') && !e.target.closest('button')) {
                const threatId = threatRow.dataset.threatId;
                if (threatId) {
                    this.showThreatDetails(threatId);
                }
            }
        });
    }
    
    switchView(viewName) {
        console.log('Switching to view:', viewName); // Debug log
        
        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        
        // Remove active class from all tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Show target view
        const targetView = document.getElementById(viewName);
        const targetTab = document.querySelector(`[data-tab="${viewName}"]`);
        
        if (targetView) {
            targetView.classList.add('active');
        }
        
        if (targetTab) {
            targetTab.classList.add('active');
        }
        
        this.currentView = viewName;
        
        // Update the view content when switching
        setTimeout(() => {
            this.updateCurrentView();
        }, 100);
    }
    
    toggleTheme() {
        const body = document.body;
        const currentTheme = body.dataset.colorScheme;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.dataset.colorScheme = newTheme;
        
        const themeIcon = document.querySelector('#theme-toggle i');
        if (themeIcon) {
            themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        // Note: For cybersecurity theme, we'll keep it predominantly dark
        if (newTheme === 'light') {
            this.showToast('Light Theme', 'Switched to light mode', 'info');
        } else {
            this.showToast('Dark Theme', 'Switched to dark mode', 'success');
        }
    }
    
    initCharts() {
        // Wait a bit to ensure DOM is ready
        setTimeout(() => {
            this.initThreatDistributionChart();
            this.initTrendsChart();
            this.initSourcesChart();
        }, 500);
    }
    
    initThreatDistributionChart() {
        const canvas = document.getElementById('threat-distribution-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const threatCounts = this.getThreatTypeCounts();
        
        this.charts.distribution = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(threatCounts),
                datasets: [{
                    data: Object.values(threatCounts),
                    backgroundColor: [
                        '#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', 
                        '#5D878F', '#DB4545', '#D2BA4C', '#964325'
                    ],
                    borderWidth: 2,
                    borderColor: '#333333'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#e0e0e0',
                            font: {
                                family: 'Courier New, monospace'
                            }
                        }
                    }
                }
            }
        });
    }
    
    initTrendsChart() {
        const canvas = document.getElementById('trends-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const trendsData = this.generateTrendsData();
        
        this.charts.trends = new Chart(ctx, {
            type: 'line',
            data: {
                labels: trendsData.labels,
                datasets: [{
                    label: 'Threats Detected',
                    data: trendsData.data,
                    borderColor: '#00ff00',
                    backgroundColor: 'rgba(0, 255, 0, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        ticks: { color: '#e0e0e0' },
                        grid: { color: '#333333' }
                    },
                    y: {
                        ticks: { color: '#e0e0e0' },
                        grid: { color: '#333333' }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#e0e0e0',
                            font: { family: 'Courier New, monospace' }
                        }
                    }
                }
            }
        });
    }
    
    initSourcesChart() {
        const canvas = document.getElementById('sources-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const sourceCounts = this.getSourceCounts();
        
        this.charts.sources = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(sourceCounts),
                datasets: [{
                    label: 'Detections',
                    data: Object.values(sourceCounts),
                    backgroundColor: [
                        '#1FB8CD', '#FFC185', '#B4413C', 
                        '#5D878F', '#DB4545', '#D2BA4C'
                    ],
                    borderWidth: 1,
                    borderColor: '#333333'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        ticks: { color: '#e0e0e0' },
                        grid: { color: '#333333' }
                    },
                    y: {
                        ticks: { color: '#e0e0e0' },
                        grid: { color: '#333333' }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#e0e0e0',
                            font: { family: 'Courier New, monospace' }
                        }
                    }
                }
            }
        });
    }
    
    getThreatTypeCounts() {
        const counts = {};
        this.threatTypes.forEach(type => counts[type] = 0);
        
        this.threats.forEach(threat => {
            if (counts.hasOwnProperty(threat.threat_type)) {
                counts[threat.threat_type]++;
            }
        });
        
        return counts;
    }
    
    getSourceCounts() {
        const counts = {};
        this.sources.forEach(source => counts[source] = 0);
        
        this.threats.forEach(threat => {
            if (counts.hasOwnProperty(threat.source)) {
                counts[threat.source]++;
            }
        });
        
        return counts;
    }
    
    generateTrendsData() {
        const labels = [];
        const data = [];
        const now = new Date();
        
        for (let i = 23; i >= 0; i--) {
            const time = new Date(now.getTime() - i * 60 * 60 * 1000);
            labels.push(time.getHours().toString().padStart(2, '0') + ':00');
            data.push(Math.floor(Math.random() * 50) + 10);
        }
        
        return { labels, data };
    }
    
    updateDashboard() {
        // Update threat counter
        const threatCounter = document.getElementById('threat-counter');
        if (threatCounter) {
            const activeThreats = this.threats.filter(t => t.status === 'Active').length;
            threatCounter.textContent = activeThreats.toLocaleString();
        }
        
        // Update activity feed
        this.updateActivityFeed();
        
        // Update charts
        if (this.charts.distribution) {
            const threatCounts = this.getThreatTypeCounts();
            this.charts.distribution.data.datasets[0].data = Object.values(threatCounts);
            this.charts.distribution.update();
        }
    }
    
    updateActivityFeed() {
        const feed = document.getElementById('activity-feed');
        if (!feed) return;
        
        const recentThreats = this.threats
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 10);
        
        feed.innerHTML = recentThreats.map(threat => `
            <div class="activity-item">
                <div class="activity-icon ${threat.severity.toLowerCase()}">
                    <i class="fas fa-shield-alt"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${threat.threat_type} Detected</div>
                    <div class="activity-details">${threat.ip} - ${threat.description}</div>
                </div>
                <div class="activity-time">${this.formatTime(threat.timestamp)}</div>
            </div>
        `).join('');
    }
    
    updateThreatFeed() {
        const tbody = document.getElementById('threat-table-body');
        if (!tbody) return;
        
        tbody.innerHTML = this.threats.map(threat => `
            <tr data-threat-id="${threat.id}" style="cursor: pointer;">
                <td>${this.formatDateTime(threat.timestamp)}</td>
                <td class="ip-address">${threat.ip}</td>
                <td><span class="country-flag">${this.getCountryFlag(threat.country)}</span>${threat.country}</td>
                <td>${threat.threat_type}</td>
                <td><span class="status-badge ${threat.severity.toLowerCase()}">${threat.severity}</span></td>
                <td>${threat.source}</td>
                <td>${threat.status}</td>
                <td>
                    <button class="btn btn--sm btn--outline" onclick="event.stopPropagation(); threatMonitor.blockIP('${threat.ip}')">
                        Block
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    updateAlerts() {
        // Update critical alerts
        const criticalAlerts = this.alerts.filter(alert => alert.severity === 'Critical');
        const criticalContainer = document.getElementById('critical-alerts');
        
        if (criticalContainer) {
            criticalContainer.innerHTML = criticalAlerts.map(alert => `
                <div class="alert-item">
                    <div class="alert-content">
                        <div class="alert-title">${alert.title}</div>
                        <div class="alert-description">${alert.description}</div>
                        <div class="alert-meta">
                            <span>Source: ${alert.source}</span>
                            <span>Time: ${this.formatDateTime(alert.timestamp)}</span>
                        </div>
                    </div>
                    <div class="alert-actions">
                        <button class="btn btn--sm btn--primary" onclick="threatMonitor.acknowledgeAlert('${alert.id}')">
                            ${alert.acknowledged ? 'Acknowledged' : 'Acknowledge'}
                        </button>
                    </div>
                </div>
            `).join('');
        }
        
        // Update alert history
        const historyContainer = document.getElementById('alert-history');
        if (historyContainer) {
            historyContainer.innerHTML = this.alerts.map(alert => `
                <div class="alert-item">
                    <div class="alert-content">
                        <div class="alert-title">
                            <span class="status-badge ${alert.severity.toLowerCase()}">${alert.severity}</span>
                            ${alert.title}
                        </div>
                        <div class="alert-description">${alert.description}</div>
                        <div class="alert-meta">
                            <span>Source: ${alert.source}</span>
                            <span>Time: ${this.formatDateTime(alert.timestamp)}</span>
                            ${alert.acknowledged ? '<span class="status-badge low">Acknowledged</span>' : ''}
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }
    
    updateAnalytics() {
        // Update metric cards
        const blockedAttacks = document.getElementById('blocked-attacks');
        const avgResponse = document.getElementById('avg-response');
        const threatSources = document.getElementById('threat-sources');
        
        if (blockedAttacks) {
            blockedAttacks.textContent = (Math.floor(Math.random() * 1000) + 2000).toLocaleString();
        }
        if (avgResponse) {
            avgResponse.textContent = Math.floor(Math.random() * 20 + 5) + 's';
        }
        if (threatSources) {
            threatSources.textContent = Math.floor(Math.random() * 20 + 40);
        }
        
        // Update charts
        if (this.charts.trends) {
            const trendsData = this.generateTrendsData();
            this.charts.trends.data.labels = trendsData.labels;
            this.charts.trends.data.datasets[0].data = trendsData.data;
            this.charts.trends.update();
        }
        
        if (this.charts.sources) {
            const sourceCounts = this.getSourceCounts();
            this.charts.sources.data.datasets[0].data = Object.values(sourceCounts);
            this.charts.sources.update();
        }
    }
    
    showThreatDetails(threatId) {
        const threat = this.threats.find(t => t.id === threatId);
        if (!threat) return;
        
        const modal = document.getElementById('threat-modal');
        const modalBody = document.getElementById('modal-body');
        
        if (!modal || !modalBody) return;
        
        modalBody.innerHTML = `
            <div class="threat-details">
                <div class="detail-row" style="margin-bottom: 12px;">
                    <strong>Threat ID:</strong> ${threat.id}
                </div>
                <div class="detail-row" style="margin-bottom: 12px;">
                    <strong>IP Address:</strong> <span class="ip-address">${threat.ip}</span>
                </div>
                <div class="detail-row" style="margin-bottom: 12px;">
                    <strong>Country:</strong> ${this.getCountryFlag(threat.country)} ${threat.country}
                </div>
                <div class="detail-row" style="margin-bottom: 12px;">
                    <strong>Threat Type:</strong> ${threat.threat_type}
                </div>
                <div class="detail-row" style="margin-bottom: 12px;">
                    <strong>Severity:</strong> <span class="status-badge ${threat.severity.toLowerCase()}">${threat.severity}</span>
                </div>
                <div class="detail-row" style="margin-bottom: 12px;">
                    <strong>Confidence:</strong> ${threat.confidence}%
                </div>
                <div class="detail-row" style="margin-bottom: 12px;">
                    <strong>Source:</strong> ${threat.source}
                </div>
                <div class="detail-row" style="margin-bottom: 12px;">
                    <strong>Status:</strong> ${threat.status}
                </div>
                <div class="detail-row" style="margin-bottom: 12px;">
                    <strong>Timestamp:</strong> ${this.formatDateTime(threat.timestamp)}
                </div>
                <div class="detail-row" style="margin-bottom: 12px;">
                    <strong>Description:</strong> ${threat.description}
                </div>
            </div>
            <div class="modal-actions" style="margin-top: 20px; display: flex; gap: 12px;">
                <button class="btn btn--primary" onclick="threatMonitor.blockIP('${threat.ip}')">Block IP</button>
                <button class="btn btn--outline" onclick="threatMonitor.investigateThreat('${threat.id}')">Investigate</button>
            </div>
        `;
        
        modal.classList.remove('hidden');
    }
    
    closeModal() {
        const modal = document.getElementById('threat-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }
    
    blockIP(ip) {
        this.showToast('IP Blocked', `${ip} has been added to the blocklist`, 'success');
        this.closeModal();
    }
    
    investigateThreat(threatId) {
        const threat = this.threats.find(t => t.id === threatId);
        if (threat) {
            threat.status = 'Investigating';
            this.updateThreatFeed();
            this.showToast('Investigation Started', `Threat ${threatId} is now under investigation`, 'info');
        }
        this.closeModal();
    }
    
    acknowledgeAlert(alertId) {
        const alert = this.alerts.find(a => a.id === alertId);
        if (alert) {
            alert.acknowledged = true;
            this.updateAlerts();
            this.showToast('Alert Acknowledged', `Alert ${alertId} has been acknowledged`, 'success');
        }
    }
    
    filterThreats(searchTerm) {
        const rows = document.querySelectorAll('#threat-table-body tr');
        const term = searchTerm.toLowerCase();
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes(term)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
    
    filterThreatsBySeverity(severity) {
        const rows = document.querySelectorAll('#threat-table-body tr');
        
        rows.forEach(row => {
            if (!severity) {
                row.style.display = '';
            } else {
                const severityBadge = row.querySelector('.status-badge');
                if (severityBadge && severityBadge.textContent === severity) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            }
        });
    }
    
    filterAlerts(filter) {
        // Implementation for alert filtering
        this.showToast('Filter Applied', `Showing ${filter || 'all'} alerts`, 'info');
    }
    
    exportThreats() {
        const csv = this.convertToCSV(this.threats);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `threat_report_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        this.showToast('Export Complete', 'Threat data exported successfully', 'success');
    }
    
    convertToCSV(data) {
        const headers = ['ID', 'Timestamp', 'IP', 'Country', 'Threat Type', 'Severity', 'Confidence', 'Source', 'Status', 'Description'];
        const rows = data.map(threat => [
            threat.id,
            threat.timestamp,
            threat.ip,
            threat.country,
            threat.threat_type,
            threat.severity,
            threat.confidence,
            threat.source,
            threat.status,
            threat.description
        ]);
        
        return [headers, ...rows].map(row => 
            row.map(field => `"${field}"`).join(',')
        ).join('\n');
    }
    
    showToast(title, message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        toast.innerHTML = `
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        `;
        
        container.appendChild(toast);
        
        // Remove toast after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 5000);
    }
    
    startRealTimeUpdates() {
        this.updateInterval = setInterval(() => {
            // Add new threat occasionally
            if (Math.random() > 0.7) {
                const newThreat = this.generateThreat();
                this.threats.unshift(newThreat);
                
                // Keep only last 100 threats
                if (this.threats.length > 100) {
                    this.threats = this.threats.slice(0, 100);
                }
                
                // Show notification for critical threats
                if (newThreat.severity === 'Critical') {
                    this.showToast('Critical Threat', `${newThreat.threat_type} detected from ${newThreat.ip}`, 'error');
                }
            }
            
            // Add new alert occasionally
            if (Math.random() > 0.8) {
                const newAlert = this.generateAlert();
                this.alerts.unshift(newAlert);
                
                if (this.alerts.length > 50) {
                    this.alerts = this.alerts.slice(0, 50);
                }
            }
            
            // Update current view
            this.updateCurrentView();
            
        }, 5000);
    }
    
    updateCurrentView() {
        switch (this.currentView) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'threat-feed':
                this.updateThreatFeed();
                break;
            case 'alerts':
                this.updateAlerts();
                break;
            case 'analytics':
                this.updateAnalytics();
                break;
        }
    }
    
    formatTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString();
    }
    
    formatDateTime(timestamp) {
        return new Date(timestamp).toLocaleString();
    }
    
    getCountryFlag(countryCode) {
        const flags = {
            'US': '🇺🇸', 'CN': '🇨🇳', 'RU': '🇷🇺', 'DE': '🇩🇪', 'FR': '🇫🇷',
            'GB': '🇬🇧', 'JP': '🇯🇵', 'KR': '🇰🇷', 'BR': '🇧🇷', 'IN': '🇮🇳'
        };
        return flags[countryCode] || '🏁';
    }
    
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        // Destroy charts
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.threatMonitor = new ThreatMonitor();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.threatMonitor) {
        window.threatMonitor.destroy();
    }
});