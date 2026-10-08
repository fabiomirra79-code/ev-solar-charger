import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

const statCards = [
  { label: 'PV Output', value: '3.8 kW', accent: '#00e5ff' },
  { label: 'House Load', value: '2.1 kW', accent: '#7c9cff' },
  { label: 'EV Charge', value: '2.3 kW', accent: '#7af5b7' },
  { label: 'Surplus', value: '1.7 kW', accent: '#ffbd59' },
];

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#081420" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Smart energy</Text>
            <Text style={styles.title}>EV Solar Charger</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Solar mode</Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Live solar balance</Text>
          <Text style={styles.heroValue}>+1.7 kW</Text>
          <Text style={styles.heroSub}>Enough surplus to charge your EV efficiently.</Text>
        </View>

        <View style={styles.grid}>
          {statCards.map((card) => (
            <View key={card.label} style={[styles.card, { borderColor: card.accent }]}>
              <Text style={styles.cardLabel}>{card.label}</Text>
              <Text style={[styles.cardValue, { color: card.accent }]}>{card.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Charge control</Text>
          <Text style={styles.sectionMeta}>72%</Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.primaryButton, styles.shadow]}>
            <Text style={styles.primaryButtonText}>Start Charging</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Pause</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.timelineCard}>
          <Text style={styles.timelineTitle}>Today</Text>
          <Text style={styles.timelineText}>Generated 18.6 kWh</Text>
          <Text style={styles.timelineText}>Charge session 2.3 kW</Text>
          <Text style={styles.timelineText}>Target at 80%</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#081420',
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  eyebrow: {
    color: '#8ec5ff',
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: {
    color: '#f4f9ff',
    fontSize: 28,
    fontWeight: '700',
  },
  badge: {
    backgroundColor: '#0d293b',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#1cf0b0',
  },
  badgeText: {
    color: '#7af5b7',
    fontSize: 11,
    fontWeight: '700',
  },
  heroCard: {
    backgroundColor: '#0e2030',
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: '#214b68',
    marginBottom: 18,
  },
  heroLabel: {
    color: '#a9bfd0',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  heroValue: {
    color: '#ffffff',
    fontSize: 38,
    fontWeight: '800',
    marginTop: 6,
  },
  heroSub: {
    marginTop: 8,
    color: '#d8e5f0',
    fontSize: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  card: {
    width: '48%',
    backgroundColor: '#0d1b2a',
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  cardLabel: {
    color: '#b7c9d9',
    fontSize: 12,
    marginBottom: 8,
  },
  cardValue: {
    fontWeight: '700',
    fontSize: 20,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#f4f9ff',
    fontSize: 20,
    fontWeight: '700',
  },
  sectionMeta: {
    color: '#8ec5ff',
    fontSize: 14,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#1ac0a8',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButton: {
    flex: 0.45,
    backgroundColor: '#112738',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2d4966',
  },
  primaryButtonText: {
    color: '#04150f',
    fontWeight: '800',
  },
  secondaryButtonText: {
    color: '#e7f6ff',
    fontWeight: '700',
  },
  timelineCard: {
    backgroundColor: '#0d1b2a',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#213d54',
  },
  timelineTitle: {
    color: '#f4f9ff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  timelineText: {
    color: '#d7e4f2',
    fontSize: 14,
    marginBottom: 4,
  },
  shadow: {
    shadowColor: '#1ac0a8',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
});
