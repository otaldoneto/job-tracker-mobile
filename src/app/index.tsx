import { useEffect, useState } from 'react';
import { ActivityIndicator, SectionList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { Application, fetchApplications } from '@/lib/api';
import { STATUS_LABELS, STATUSES } from '@/lib/status';

export default function HomeScreen() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications()
      .then(setApplications)
      .catch(() => setError('Não foi possível carregar as candidaturas'))
      .finally(() => setIsLoading(false));
  }, []);

  const sections = STATUSES.map((status) => ({
    title: STATUS_LABELS[status],
    data: applications.filter((application) => application.status === status),
  }));

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="subtitle">Candidaturas</ThemedText>

        {isLoading && <ActivityIndicator style={styles.spinner} />}
        {error && <ThemedText type="small">{error}</ThemedText>}

        <SectionList
          sections={sections}
          keyExtractor={(application) => application.id}
          contentContainerStyle={styles.list}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section }) => (
            <ThemedText type="smallBold" style={styles.sectionHeader}>
              {section.title} ({section.data.length})
            </ThemedText>
          )}
          renderItem={({ item }) => (
            <ThemedView type="backgroundElement" style={styles.card}>
              <ThemedText type="smallBold">{item.company}</ThemedText>
              <ThemedText type="small">{item.role}</ThemedText>
            </ThemedView>
          )}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  spinner: {
    marginTop: Spacing.four,
  },
  list: {
    gap: Spacing.two,
    paddingBottom: Spacing.four,
  },
  sectionHeader: {
    marginTop: Spacing.three,
    marginBottom: Spacing.two,
  },
  card: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.one,
    marginBottom: Spacing.two,
  },
});
