import { useState } from 'react';
import { Modal, Pressable, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type FormValues = {
  company: string;
  role: string;
  url: string;
};

export function ApplicationFormModal({
  visible,
  initialValues,
  onSubmit,
  onClose,
  onDelete,
}: {
  visible: boolean;
  initialValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  onClose: () => void;
  onDelete?: () => void;
}) {
  const theme = useTheme();
  const [company, setCompany] = useState(initialValues?.company ?? '');
  const [role, setRole] = useState(initialValues?.role ?? '');
  const [url, setUrl] = useState(initialValues?.url ?? '');

  const inputStyle = [
    styles.input,
    { backgroundColor: theme.background, color: theme.text, borderColor: theme.backgroundSelected },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <ThemedView style={styles.overlay}>
        <ThemedView type="backgroundElement" style={styles.sheet}>
          <ThemedText type="subtitle">{initialValues ? 'Editar candidatura' : 'Nova candidatura'}</ThemedText>

          <TextInput
            value={company}
            onChangeText={setCompany}
            placeholder="Empresa"
            placeholderTextColor={theme.textSecondary}
            style={inputStyle}
          />
          <TextInput
            value={role}
            onChangeText={setRole}
            placeholder="Vaga"
            placeholderTextColor={theme.textSecondary}
            style={inputStyle}
          />
          <TextInput
            value={url}
            onChangeText={setUrl}
            placeholder="Link (opcional)"
            placeholderTextColor={theme.textSecondary}
            style={inputStyle}
          />

          <Pressable style={styles.saveButton} onPress={() => onSubmit({ company, role, url })}>
            <ThemedText style={styles.saveButtonText}>Salvar</ThemedText>
          </Pressable>

          {onDelete && (
            <Pressable style={styles.deleteButton} onPress={onDelete}>
              <ThemedText style={styles.deleteButtonText}>Apagar</ThemedText>
            </Pressable>
          )}

          <Pressable onPress={onClose}>
            <ThemedText type="small">Cancelar</ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    padding: Spacing.four,
    borderTopLeftRadius: Spacing.four,
    borderTopRightRadius: Spacing.four,
    gap: Spacing.three,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    padding: Spacing.three,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#111',
    borderRadius: Spacing.two,
    padding: Spacing.three,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  deleteButton: {
    borderRadius: Spacing.two,
    padding: Spacing.three,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#d33',
  },
});
