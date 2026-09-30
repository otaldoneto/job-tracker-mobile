import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SectionList,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ApplicationFormModal } from "@/components/application-form-modal";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import {
  Application,
  createApplication,
  deleteApplication,
  fetchApplications,
  updateApplication,
} from "@/lib/api";
import { STATUS_LABELS, STATUSES } from "@/lib/status";

export default function HomeScreen() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingApplication, setEditingApplication] =
    useState<Application | null>(null);

  useEffect(() => {
    fetchApplications()
      .then(setApplications)
      .catch(() => setError("Não foi possível carregar as candidaturas"))
      .finally(() => setIsLoading(false));
  }, []);

  const sections = STATUSES.map((status) => ({
    title: STATUS_LABELS[status],
    data: applications.filter((application) => application.status === status),
  }));

  async function handleCreate(values: {
    company: string;
    role: string;
    url: string;
  }) {
    const created = await createApplication({
      ...values,
      url: values.url || null,
    });
    setApplications((current) => [...current, created]);
    setIsCreateOpen(false);
  }

  async function handleUpdate(values: {
    company: string;
    role: string;
    url: string;
  }) {
    if (!editingApplication) return;
    const updated = await updateApplication(editingApplication.id, {
      ...values,
      url: values.url || null,
    });
    setApplications((current) =>
      current.map((application) =>
        application.id === updated.id ? updated : application,
      ),
    );
    setEditingApplication(null);
  }

  async function handleDelete() {
    if (!editingApplication) return;
    await deleteApplication(editingApplication.id);
    setApplications((current) =>
      current.filter((application) => application.id !== editingApplication.id),
    );
    setEditingApplication(null);
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.header}>
          <ThemedText type="subtitle">Candidaturas</ThemedText>
          <Pressable
            style={styles.addButton}
            onPress={() => setIsCreateOpen(true)}
          >
            <ThemedText style={styles.addButtonText}>+ Nova</ThemedText>
          </Pressable>
        </ThemedView>

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
            <Pressable onPress={() => setEditingApplication(item)}>
              <ThemedView type="backgroundElement" style={styles.card}>
                <ThemedText type="smallBold">{item.company}</ThemedText>
                <ThemedText type="small">{item.role}</ThemedText>
              </ThemedView>
            </Pressable>
          )}
        />
      </SafeAreaView>

      <ApplicationFormModal
        visible={isCreateOpen}
        onSubmit={handleCreate}
        onClose={() => setIsCreateOpen(false)}
      />

      <ApplicationFormModal
        key={editingApplication?.id ?? "edit-modal"}
        visible={!!editingApplication}
        initialValues={
          editingApplication
            ? {
                company: editingApplication.company,
                role: editingApplication.role,
                url: editingApplication.url ?? "",
              }
            : undefined
        }
        onSubmit={handleUpdate}
        onClose={() => setEditingApplication(null)}
        onDelete={handleDelete}
      />
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#111",
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
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
