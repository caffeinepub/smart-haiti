import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

const SESSION_TOKEN_KEY = 'admin_session_token';

export function useAdminAuth() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const sessionToken = sessionStorage.getItem(SESSION_TOKEN_KEY);

  const verifySession = useQuery({
    queryKey: ['adminSession', sessionToken],
    queryFn: async () => {
      if (!actor || !sessionToken) return false;
      return actor.verifyAdminSession(sessionToken);
    },
    enabled: !!actor && !!sessionToken,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      if (!actor) throw new Error('Actor not available');
      const token = await actor.adminLogin(username, password);
      return token;
    },
    onSuccess: (token) => {
      sessionStorage.setItem(SESSION_TOKEN_KEY, token);
      queryClient.invalidateQueries({ queryKey: ['adminSession'] });
      queryClient.invalidateQueries({ queryKey: ['isCallerAdmin'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !sessionToken) return;
      await actor.adminLogout(sessionToken);
    },
    onSuccess: () => {
      sessionStorage.removeItem(SESSION_TOKEN_KEY);
      queryClient.clear();
    },
  });

  const isAuthenticated = verifySession.data === true;
  const isLoading = verifySession.isLoading;

  return {
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isAuthenticated,
    isLoading,
    isLoginError: loginMutation.isError,
    loginError: loginMutation.error,
    isLoggingIn: loginMutation.isPending,
    sessionToken,
  };
}

export function useIsAdminConfigured() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['isAdminConfigured'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isAdminConfigured();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetAdminCredentials() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.setAdminCredentials(username, password);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isAdminConfigured'] });
    },
  });
}
