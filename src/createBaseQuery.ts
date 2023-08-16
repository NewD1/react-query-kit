import type { SetDataOptions, UseBaseQueryOptions } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import type {
  AdditionalCreateOptions,
  AdditionalQueryHookOptions,
  Updater,
} from './types'

interface CreateQueryOptions
  extends Omit<UseBaseQueryOptions, 'queryKey' | 'queryFn' | 'enabled'>,
    AdditionalCreateOptions<any, any> {
  useDefaultOptions?: () => QueryBaseHookOptions
}

type QueryBaseHookOptions = Omit<
  UseBaseQueryOptions,
  'queryKey' | 'queryFn' | 'enabled'
> &
  AdditionalQueryHookOptions<any, any>

export function createBaseQuery(
  initialOptions: any,
  useRQHook: (options: any, queryClient?: any) => any,
  queryClient?: any,
  overrideOptions?: QueryBaseHookOptions
): any {
  const {
    primaryKey,
    queryFn,
    queryKeyHashFn,
    useDefaultOptions,
    ...defaultOptions
  } = initialOptions as CreateQueryOptions

  const getPrimaryKey = () => primaryKey

  const getKey = (variables?: any) =>
    variables === undefined ? [primaryKey] : [primaryKey, variables]

  const useGeneratedQuery = (options: QueryBaseHookOptions) => {
    const { enabled, variables, ...mergedOptions } = {
      ...defaultOptions,
      ...useDefaultOptions?.(),
      ...options,
      ...overrideOptions,
    } as QueryBaseHookOptions

    const queryKey = getKey(variables)

    const client = useQueryClient(
      // compatible with ReactQuery v4
      // @ts-ignore
      mergedOptions.context ? { context: mergedOptions.context } : queryClient
    )

    const result = useRQHook(
      {
        ...mergedOptions,
        enabled:
          typeof enabled === 'function'
            ? enabled(client.getQueryData(queryKey), variables)
            : enabled,
        queryKeyHashFn,
        queryFn,
        queryKey,
      },
      client
    )

    return Object.assign(result, {
      queryKey,
      variables,
      setData: (updater: Updater<any, any>, setDataOptions?: SetDataOptions) =>
        client.setQueryData(queryKey, updater, setDataOptions),
    })
  }

  return Object.assign(useGeneratedQuery, {
    getPrimaryKey,
    getKey,
    queryFn,
    queryKeyHashFn,
  })
}
