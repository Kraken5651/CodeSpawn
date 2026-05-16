import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { languages } from '../data/curriculum';

const INITIAL_PROFILE = {
  name: 'Developer',
  xp: 0,
  level: 1,
  streak: 1,
  completed: [],
  selectedLanguage: null,
};

const sanitizeProfile = (profile) => {
  if (profile.selectedLanguage && !languages.find((language) => language.id === profile.selectedLanguage)) {
    return { ...profile, selectedLanguage: null };
  }

  return profile;
};

export const useProfileStore = create(
  persist(
    (set) => ({
      profile: INITIAL_PROFILE,
      selectLanguage: (selectedLanguage) => set((state) => ({
        profile: sanitizeProfile({ ...state.profile, selectedLanguage }),
      })),
      updateProfile: (updates) => set((state) => ({
        profile: sanitizeProfile({ ...state.profile, ...updates }),
      })),
      resetLanguage: () => set((state) => ({
        profile: { ...state.profile, selectedLanguage: null },
      })),
    }),
    {
      name: 'codespawn-profile-store',
      version: 1,
      partialize: (state) => ({ profile: sanitizeProfile(state.profile) }),
      migrate: (persistedState) => {
        if (persistedState?.profile) {
          return { profile: sanitizeProfile({ ...INITIAL_PROFILE, ...persistedState.profile }) };
        }

        return { profile: INITIAL_PROFILE };
      },
    }
  )
);
