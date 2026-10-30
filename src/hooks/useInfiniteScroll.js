import { useEffect, useRef } from 'react';

/**
 * Custom hook to handle infinite scrolling using the native Intersection Observer API.
 *
 * @param {Object} options
 * @param {Function} options.onLoadMore - Callback invoked when the sentinel element intersects
 * @param {boolean} [options.hasMore=true] - Whether more items remain to be loaded
 * @param {boolean} [options.isLoading=false] - Whether a batch fetch is currently in flight
 * @param {string} [options.rootMargin='100px'] - Margin around the root viewport
 * @param {number} [options.threshold=0.1] - Intersection threshold to trigger callback
 * @returns {{ sentinelRef: import('react').RefObject }} Ref object to attach to the sentinel DOM node
 */
export default function useInfiniteScroll({
  onLoadMore,
  hasMore = true,
  isLoading = false,
  rootMargin = '100px',
  threshold = 0.1,
}) {
  const sentinelRef = useRef(null);
  const onLoadMoreRef = useRef(onLoadMore);

  // Keep a fresh reference to the latest callback without forcing observer rebuild
  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  useEffect(() => {
    if (!hasMore || isLoading || !onLoadMore) return;

    const target = sentinelRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMoreRef.current?.();
        }
      },
      {
        root: null,
        rootMargin,
        threshold,
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoading, onLoadMore, rootMargin, threshold]);

  return { sentinelRef };
}
