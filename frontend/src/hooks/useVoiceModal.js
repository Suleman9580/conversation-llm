import { create } from 'zustand'

const useVoiceModal = create((set) => ({
  isVoiceModalOpen: false,
  openModal: () => set({ isVoiceModalOpen: true }),
  closeModal: () => set({ isVoiceModalOpen: false }),
  toggleModal: () => set((state) => ({ isVoiceModalOpen: !state.isVoiceModalOpen })),
}))

export default useVoiceModal