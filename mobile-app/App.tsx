import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: '#081420',
  backgroundGradientTo: '#0d1f2d',
  color: (opacity = 1) => `rgba(154, 205, 255, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
};

const mockData = {
  solar: {
    power_kw: 3.8,
    energy_today_kwh: 18.6,
    energy_total_kwh: 12480.4,
  },
  charger: {
    connected: true,
    charging: true,
    power_kw: 2.3,
    battery_level: 72,
    target_level: 80,
  },
  automation: {
    surplus_kw: 1.7,
    should_charge: true,
    reason: 'Surplus available (1.7 kW). Charge active.',
  },
};

export default function App() {
  const [loading, setLoading] = useState(false);
  const [automationActive, setAutomationActive] = useState(true);
  const [data, setData] = useState(mockData);
  const [chargeHistory, setChargeHistory] = useState([
    { time: '08:00', kw: 0 },
    { time: '09:00', kw: 1.2 },
    { time: '10:00', kw: 2.5 },
    { time: '11:00', kw: 2.3 },
    { time: '12:00', kw: 2.3 },
  ]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // In production, replace with real API calls
      // const response = await fetch('http://your-api.com/api/automation/decision');
      // const json = await response.json();
      // setData(json);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleStartCharge = async () => {
    setLoading(true);
    try {
      // API call: POST /api/charger/command
      setData(prev => ({
        ...prev,
        charger: { ...prev.charger, charging: true }
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleStopCharge = async () => {
    setLoading(true);
    try {
      // API call: POST /api/charger/command
      setData(prev => ({
        ...prev,
        charger: { ...prev.charger, charging: false }
      }));
    } finally {
      setLoading(false);
    }
  };

  const lineChartData = {
    labels: chargeHistory.map(d => d.time),
    datasets: [
      {
        data: chargeHistory.map(d => d.kw),
        strokeWidth: 2,
      },
    ],
  };

  const efficiencyData = [
    { name: 'Used', value: data.charger.battery_level, color: '#1ac0a8', legendFontColor: '#7af5b7' },
    { name: 'Available', value: 100 - data.charger.battery_level, color: '#0d293b', legendFontColor: '#8ec5ff' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#081420" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Smart Energy Management</Text>
            <Text style={styles.title}>EV Solar Charger</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.badge,
              automationActive ? styles.badgeActive : styles.badgeInactive,
            ]}
            onPress={() => setAutomationActive(!automationActive)}
          >
            <Text style={styles.badgeText}>
              {automationActive ? '⚡ Auto' : '⏸ Manual'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* MAIN HERO CARD */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <Text style={styles.heroLabel}>Solar Balance</Text>
            <Text style={styles.heroTimestamp}>Live</Text>
          </View>
          <Text style={styles.heroValue}>{data.automation.surplus_kw.toFixed(1)} kW</Text>
          <Text style={styles.heroSub}>{data.automation.reason}</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(data.automation.surplus_kw / 5) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.heroFooter}>Optimal for charging</Text>
        </View>

        {/* STATS GRID */}
        <View style={styles.statsGrid}>
          <StatCard
            label="Solar Power"
            value={data.solar.power_kw.toFixed(1)}
            unit="kW"
            icon="☀️"
            color="#ffbd59"
          />
          <StatCard
            label="House Load"
            value="2.1"
            unit="kW"
            icon="🏠"
            color="#7c9cff"
          />
          <StatCard
            label="EV Charge"
            value={data.charger.power_kw.toFixed(1)}
            unit="kW"
            icon="🔌"
            color="#7af5b7"
          />
          <StatCard
            label="Battery Level"
            value={data.charger.battery_level}
            unit="%"
            icon="🔋"
            color="#00e5ff"
          />
        </View>

        {/* CHARGER CONTROL SECTION */}
        <Text style={styles.sectionTitle}>Charge Control</Text>
        <View style={styles.chargerCard}>
          <View style={styles.chargerStatusRow}>
            <View>
              <Text style={styles.chargerLabel}>Current Status</Text>
              <Text style={styles.chargerStatus}>
                {data.charger.charging ? '🟢 Charging' : '⚪ Idle'}
              </Text>
            </View>
            <View style={styles.chargerMeterContainer}>
              <Text style={styles.chargerMeter}>{data.charger.battery_level}%</Text>
              <Text style={styles.chargerMeterLabel}>of {data.charger.target_level}%</Text>
            </View>
          </View>

          <View style={styles.chargerPowerInfo}>
            <View style={styles.powerBox}>
              <Text style={styles.powerLabel}>Power Draw</Text>
              <Text style={styles.powerValue}>{data.charger.power_kw.toFixed(1)} kW</Text>
            </View>
            <View style={styles.powerBox}>
              <Text style={styles.powerLabel}>Time Remaining</Text>
              <Text style={styles.powerValue}>~45 min</Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                data.charger.charging ? styles.buttonStop : styles.buttonStart,
              ]}
              onPress={data.charger.charging ? handleStopCharge : handleStartCharge}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.actionButtonText}>
                  {data.charger.charging ? '⏹ Stop Charge' : '▶ Start Charge'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => {}}
            >
              <Text style={styles.settingsButtonText}>⚙ Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ENERGY CHART */}
        <Text style={styles.sectionTitle}>Charge History</Text>
        <View style={styles.chartContainer}>
          <LineChart
            data={lineChartData}
            width={screenWidth - 36}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        {/* BATTERY GAUGE */}
        <Text style={styles.sectionTitle}>Battery Status</Text>
        <View style={styles.gaugeContainer}>
          <PieChart
            data={efficiencyData}
            width={screenWidth - 36}
            height={200}
            chartConfig={chartConfig}
            accessor="value"
            backgroundColor="transparent"
            paddingLeft="15"
          />
        </View>

        {/* DAILY STATS */}
        <Text style={styles.sectionTitle}>Today's Summary</Text>
        <View style={styles.summaryCard}>
          <SummaryRow
            label="Solar Generated"
            value={data.solar.energy_today_kwh.toFixed(1)}
            unit="kWh"
            icon="☀️"
          />
          <SummaryRow
            label="EV Charged"
            value="2.1"
            unit="kWh"
            icon="⚡"
          />
          <SummaryRow
            label="Self-Consumption"
            value="87.5"
            unit="%"
            icon="📊"
          />
          <SummaryRow
            label="CO₂ Saved"
            value="4.2"
            unit="kg"
            icon="🌱"
          />
        </View>

        {/* AUTOMATION RULES */}
        <Text style={styles.sectionTitle}>Automation Rules</Text>
        <View style={styles.rulesCard}>
          <RuleRow
            rule="Min Surplus"
            value="0.5 kW"
            active
          />
          <RuleRow
            rule="Target Level"
            value={`${data.charger.target_level}%`}
            active
          />
          <RuleRow
            rule="Smart Scheduling"
            value="Enabled"
            active
          />
          <RuleRow
            rule="Night Charging"
            value="Disabled"
            active={false}
          />
        </View>

        {/* NOTIFICATIONS */}
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.notificationCard}>
          <NotificationItem
            time="12:34"
            message="Charging started - Surplus available"
            type="success"
          />
          <NotificationItem
            time="11:22"
            message="Battery level reached 72%"
            type="info"
          />
          <NotificationItem
            time="10:15"
            message="Solar production peaked at 3.8 kW"
            type="success"
          />
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Last update: Just now</Text>
          <Text style={styles.footerVersion}>v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Stat Card Component
function StatCard({ label, value, unit, icon, color }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>
        {value} <Text style={styles.statUnit}>{unit}</Text>
      </Text>
    </View>
  );
}

// Summary Row Component
function SummaryRow({ label, value, unit, icon }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryIcon}>{icon}</Text>
      <View style={styles.summaryTextContainer}>
        <Text style={styles.summaryLabel}>{label}</Text>
        <Text style={styles.summaryValue}>
          {value} <Text style={styles.summaryUnit}>{unit}</Text>
        </Text>
      </View>
    </View>
  );
}

// Rule Row Component
function RuleRow({ rule, value, active }) {
  return (
    <View style={styles.ruleRow}>
      <View style={styles.ruleContent}>
        <Text style={styles.ruleLabel}>{rule}</Text>
        <Text style={styles.ruleValue}>{value}</Text>
      </View>
      <View style={[styles.ruleStatus, active && styles.ruleStatusActive]}>
        <Text style={styles.ruleStatusText}>{active ? '✓' : '✗'}</Text>
      </View>
    </View>
  );
}

// Notification Item Component
function NotificationItem({ time, message, type }) {
  const bgColor = type === 'success' ? '#0d2a1f' : '#0d1f2a';
  const borderColor = type === 'success' ? '#1ac0a8' : '#00a8d8';
  const icon = type === 'success' ? '✓' : 'ℹ';

  return (
    <View style={[styles.notificationItem, { backgroundColor: bgColor, borderColor }]}>
      <Text style={[styles.notificationIcon, { color: borderColor }]}>{icon}</Text>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationMessage}>{message}</Text>
        <Text style={styles.notificationTime}>{time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#081420',
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  eyebrow: {
    color: '#8ec5ff',
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 6,
    fontWeight: '600',
  },
  title: {
    color: '#f4f9ff',
    fontSize: 32,
    fontWeight: '800',
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  badgeActive: {
    backgroundColor: '#0d2a1f',
    borderColor: '#1ac0a8',
  },
  badgeInactive: {
    backgroundColor: '#2a0d0d',
    borderColor: '#c01010',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  heroCard: {
    backgroundColor: '#0e2030',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1d4a6a',
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  heroLabel: {
    color: '#a9bfd0',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    fontWeight: '600',
  },
  heroTimestamp: {
    color: '#00d9ff',
    fontSize: 11,
    fontWeight: '700',
  },
  heroValue: {
    color: '#ffffff',
    fontSize: 44,
    fontWeight: '900',
    marginBottom: 6,
  },
  heroSub: {
    color: '#d8e5f0',
    fontSize: 14,
    marginBottom: 14,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#0a1a28',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1ac0a8',
    borderRadius: 4,
  },
  heroFooter: {
    color: '#7af5b7',
    fontSize: 12,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#0d1b2a',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1a3a52',
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  statLabel: {
    color: '#9bafe5',
    fontSize: 11,
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  statUnit: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.8,
  },
  sectionTitle: {
    color: '#f4f9ff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 8,
  },
  chargerCard: {
    backgroundColor: '#0e2030',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1d4a6a',
  },
  chargerStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  chargerLabel: {
    color: '#7fa5c7',
    fontSize: 12,
    marginBottom: 4,
  },
  chargerStatus: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  chargerMeterContainer: {
    alignItems: 'flex-end',
  },
  chargerMeter: {
    color: '#00e5ff',
    fontSize: 32,
    fontWeight: '900',
  },
  chargerMeterLabel: {
    color: '#8ec5ff',
    fontSize: 11,
    marginTop: 2,
  },
  chargerPowerInfo: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  powerBox: {
    flex: 1,
    backgroundColor: '#0a1420',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1a2f42',
  },
  powerLabel: {
    color: '#7fa5c7',
    fontSize: 11,
    marginBottom: 4,
  },
  powerValue: {
    color: '#7af5b7',
    fontSize: 16,
    fontWeight: '700',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStart: {
    backgroundColor: '#1ac0a8',
  },
  buttonStop: {
    backgroundColor: '#c01010',
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14,
  },
  settingsButton: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: '#0a1420',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1a3a52',
    justifyContent: 'center',
  },
  settingsButtonText: {
    color: '#7af5b7',
    fontWeight: '700',
    fontSize: 12,
  },
  chartContainer: {
    backgroundColor: '#0e2030',
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1d4a6a',
    overflow: 'hidden',
  },
  chart: {
    borderRadius: 12,
  },
  gaugeContainer: {
    backgroundColor: '#0e2030',
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1d4a6a',
    alignItems: 'center',
  },
  summaryCard: {
    backgroundColor: '#0e2030',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1d4a6a',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#0a1420',
  },
  summaryIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  summaryTextContainer: {
    flex: 1,
  },
  summaryLabel: {
    color: '#9bafe5',
    fontSize: 12,
  },
  summaryValue: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  summaryUnit: {
    fontSize: 12,
    opacity: 0.7,
  },
  rulesCard: {
    backgroundColor: '#0e2030',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1d4a6a',
  },
  ruleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#0a1420',
  },
  ruleContent: {
    flex: 1,
  },
  ruleLabel: {
    color: '#9bafe5',
    fontSize: 13,
    fontWeight: '600',
  },
  ruleValue: {
    color: '#ffffff',
    fontSize: 12,
    marginTop: 2,
  },
  ruleStatus: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0a1420',
    borderWidth: 1,
    borderColor: '#1a2f42',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ruleStatusActive: {
    backgroundColor: '#0d2a1f',
    borderColor: '#1ac0a8',
  },
  ruleStatusText: {
    color: '#7af5b7',
    fontWeight: '700',
    fontSize: 14,
  },
  notificationCard: {
    backgroundColor: '#0e2030',
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1d4a6a',
  },
  notificationItem: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  notificationIcon: {
    fontSize: 18,
    fontWeight: '700',
    marginRight: 10,
  },
  notificationContent: {
    flex: 1,
  },
  notificationMessage: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '500',
  },
  notificationTime: {
    color: '#8ec5ff',
    fontSize: 11,
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#0a1420',
  },
  footerText: {
    color: '#7fa5c7',
    fontSize: 12,
  },
  footerVersion: {
    color: '#4a6080',
    fontSize: 11,
    marginTop: 4,
  },
});
