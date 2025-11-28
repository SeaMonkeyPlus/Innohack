import { DEFAULT_LANGUAGE, LANGUAGES } from '@constants/languages';
import { useColorScheme } from '@hooks/use-color-scheme';
import React, { useState } from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Language } from '../../types/language';

interface LanguageSelectorProps {
  onLanguageChange?: (language: Language) => void;
}

export function LanguageSelector({ onLanguageChange }: LanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [isOpen, setIsOpen] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    setIsOpen(false);
    onLanguageChange?.(language);
  };

  return (
    <View style={styles.container}>
      {/* Toggle Button */}
      <TouchableOpacity
        style={[
          styles.toggleButton,
          { backgroundColor: isDark ? '#333' : '#f0f0f0' },
        ]}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}>
        <Text style={styles.languageText}>Language</Text>
        <Text style={styles.arrow}>{isOpen ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
          <View style={styles.dropdownContainer}>
            <View
              style={[
                styles.dropdown,
                { backgroundColor: isDark ? '#1c1c1c' : '#ffffff' },
              ]}>
              {LANGUAGES.map((language) => (
                <TouchableOpacity
                  key={language.code}
                  style={[
                    styles.languageItem,
                    selectedLanguage.code === language.code && styles.selectedItem,
                    { borderBottomColor: isDark ? '#333' : '#e0e0e0' },
                  ]}
                  onPress={() => handleLanguageSelect(language)}
                  activeOpacity={0.7}>
                  <Text style={styles.flag}>{language.flag}</Text>
                  <View style={styles.languageInfo}>
                    <Text
                      style={[
                        styles.nativeName,
                        { color: isDark ? '#fff' : '#000' },
                      ]}>
                      {language.nativeName}
                    </Text>
                    <Text
                      style={[
                        styles.englishName,
                        { color: isDark ? '#999' : '#666' },
                      ]}>
                      {language.name}
                    </Text>
                  </View>
                  {selectedLanguage.code === language.code && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
    minWidth: 120,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  arrow: {
    fontSize: 10,
    color: '#007AFF',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    paddingTop: 60,
    paddingLeft: 16,
  },
  dropdownContainer: {
    alignSelf: 'flex-start',
  },
  dropdown: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 220,
    maxHeight: 400,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
    borderBottomWidth: 1,
  },
  selectedItem: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  flag: {
    fontSize: 24,
  },
  languageInfo: {
    flex: 1,
  },
  nativeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  englishName: {
    fontSize: 12,
  },
  checkmark: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: 'bold',
  },
});
