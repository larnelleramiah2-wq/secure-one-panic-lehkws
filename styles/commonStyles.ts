
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

export const colors = {
  background: '#f0f2f5',
  text: '#262626',
  textSecondary: '#717784',
  primary: '#007bff',
  secondary: '#6c757d',
  accent: '#ffc107',
  card: '#ffffff',
  highlight: '#e9ecef',
  danger: '#dc3545',
  success: '#28a745',
  online: '#28a745',
  border: '#dee2e6',
};

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondary: {
    backgroundColor: colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  danger: {
    backgroundColor: colors.danger,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  text: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  textSecondary: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  section: {
    marginBottom: 16,
  },
});
