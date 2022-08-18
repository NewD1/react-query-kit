import type {
  MutationFunction,
  MutationKey,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query'
import { parseMutationArgs, useMutation } from '@tanstack/react-query'

export type CreateMutationOptions<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
> = UseMutationOptions<TData, TError, TVariables, TContext>

interface CreateMutationResult<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
> {
  (
    options: Omit<
      UseMutationOptions<TData, TError, TVariables, TContext>,
      'mutationFn' | 'mutationKey'
    >
  ): UseMutationResult<TData, TError, TVariables, TContext>
  getKey: () => MutationKey | undefined
  mutationFn: Required<
    UseMutationOptions<TData, TError, TVariables, TContext>
  >['mutationFn']
}

export function createMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>
): CreateMutationResult<TData, TError, TVariables, TContext>
export function createMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  mutationFn: MutationFunction<TData, TVariables>,
  options?: Omit<
    UseMutationOptions<TData, TError, TVariables, TContext>,
    'mutationFn'
  >
): CreateMutationResult<TData, TError, TVariables, TContext>
export function createMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  mutationKey: MutationKey,
  options?: Omit<
    UseMutationOptions<TData, TError, TVariables, TContext>,
    'mutationKey'
  >
): CreateMutationResult<TData, TError, TVariables, TContext>
export function createMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  mutationKey: MutationKey,
  mutationFn?: MutationFunction<TData, TVariables>,
  options?: Omit<
    UseMutationOptions<TData, TError, TVariables, TContext>,
    'mutationKey' | 'mutationFn'
  >
): CreateMutationResult<TData, TError, TVariables, TContext>
export function createMutation<
  TData = unknown,
  TError = unknown,
  TVariables = void,
  TContext = unknown
>(
  arg1:
    | MutationKey
    | MutationFunction<TData, TVariables>
    | UseMutationOptions<TData, TError, TVariables, TContext>,
  arg2?:
    | MutationFunction<TData, TVariables>
    | UseMutationOptions<TData, TError, TVariables, TContext>,
  arg3?: UseMutationOptions<TData, TError, TVariables, TContext>
): CreateMutationResult<TData, TError, TVariables, TContext> {
  const defaultOptions = parseMutationArgs(arg1, arg2, arg3)
  const getKey = () => defaultOptions.mutationKey

  function useGeneratedMutation(
    options: Omit<
      UseMutationOptions<TData, TError, TVariables, TContext>,
      'mutationFn' | 'mutationKey'
    >
  ) {
    return useMutation({
      ...defaultOptions,
      ...options,
    })
  }

  useGeneratedMutation.getKey = getKey
  useGeneratedMutation.mutationFn = defaultOptions.mutationFn as Required<
    UseMutationOptions<TData, TError, TVariables, TContext>
  >['mutationFn']

  return useGeneratedMutation
}