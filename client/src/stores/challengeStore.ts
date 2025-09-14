import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Challenge, TrickAttempt } from '@shared/schema';

interface ChallengeStore {
  // Current user (mock)
  currentUserId: string;
  
  // Challenges
  challenges: Challenge[];
  currentChallenge: Challenge | null;
  
  // Trick attempts
  trickAttempts: Record<string, TrickAttempt[]>;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setChallenges: (challenges: Challenge[]) => void;
  setCurrentChallenge: (challenge: Challenge | null) => void;
  updateChallenge: (challengeId: string, updates: Partial<Challenge>) => void;
  addChallenge: (challenge: Challenge) => void;
  setTrickAttempts: (challengeId: string, attempts: TrickAttempt[]) => void;
  addTrickAttempt: (attempt: TrickAttempt) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Challenge actions
  earnLetter: (challengeId: string, userId: string, letter: string) => void;
  joinChallenge: (challengeId: string, userId: string) => void;
}

export const useChallengeStore = create<ChallengeStore>()(
  persist(
    (set, get) => ({
      currentUserId: 'user1', // Mock current user
      challenges: [],
      currentChallenge: null,
      trickAttempts: {},
      isLoading: false,
      error: null,

      setChallenges: (challenges) => set({ challenges }),
      
      setCurrentChallenge: (challenge) => set({ currentChallenge: challenge }),
      
      updateChallenge: (challengeId, updates) => {
        const { challenges, currentChallenge } = get();
        const updatedChallenges = challenges.map(c => 
          c.id === challengeId ? { ...c, ...updates } : c
        );
        
        set({
          challenges: updatedChallenges,
          currentChallenge: currentChallenge?.id === challengeId 
            ? { ...currentChallenge, ...updates }
            : currentChallenge
        });
      },
      
      addChallenge: (challenge) => {
        const { challenges } = get();
        set({ challenges: [challenge, ...challenges] });
      },
      
      setTrickAttempts: (challengeId, attempts) => {
        const { trickAttempts } = get();
        set({
          trickAttempts: {
            ...trickAttempts,
            [challengeId]: attempts
          }
        });
      },
      
      addTrickAttempt: (attempt) => {
        const { trickAttempts } = get();
        const challengeAttempts = trickAttempts[attempt.challengeId] || [];
        set({
          trickAttempts: {
            ...trickAttempts,
            [attempt.challengeId]: [...challengeAttempts, attempt]
          }
        });
      },
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      earnLetter: (challengeId, userId, letter) => {
        const { challenges, currentUserId } = get();
        const challenge = challenges.find(c => c.id === challengeId);
        if (!challenge) return;

        const isCreator = challenge.creatorId === userId;
        const lettersField = isCreator ? 'creatorLetters' : 'opponentLetters';
        const currentLetters = challenge[lettersField];
        
        if (!currentLetters.includes(letter)) {
          const newLetters = currentLetters + letter;
          get().updateChallenge(challengeId, {
            [lettersField]: newLetters,
            // Switch turns
            currentTurn: isCreator ? challenge.opponentId : challenge.creatorId,
            // Check if game is complete
            status: newLetters === 'SKATE' ? 'completed' : challenge.status
          });
        }
      },
      
      joinChallenge: (challengeId, userId) => {
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        get().updateChallenge(challengeId, {
          opponentId: userId,
          status: 'active',
          currentTurn: userId,
          expiresAt
        });
      }
    }),
    {
      name: 'skate-challenge-store',
      partialize: (state) => ({
        challenges: state.challenges,
        trickAttempts: state.trickAttempts,
        currentUserId: state.currentUserId,
      }),
    }
  )
);
