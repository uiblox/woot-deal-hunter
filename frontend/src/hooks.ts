import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { fetchFeed, getOffers, type Feed } from './api'

export const useFeed = (feed: Feed, page: number) =>
  useQuery({ queryKey: ['feed', feed, page], queryFn: () => fetchFeed(feed, page), placeholderData: keepPreviousData })

export const useGetOffers = (ids: string[]) =>
  useQuery({ queryKey: ['offers', ids], queryFn: () => getOffers(ids), enabled: ids.length > 0 })
