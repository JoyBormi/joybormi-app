import { BottomSheetModal } from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/common';
import {
  Reservation,
  ReservationBottomSheet,
  ReservationFilterSheet,
  ReservationFilters,
  ReservationList,
  fetchReservations,
} from '@/views/reservation';

export default function ReservationsScreen() {
  const { colors } = useColorScheme();

  // State
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [filters, setFilters] = useState<ReservationFilters>({
    dateRange: {
      start: dayjs().format('YYYY-MM-DD'),
      end: dayjs().add(1, 'month').format('YYYY-MM-DD'),
    },
    statuses: [],
    types: [],
  });

  // Refs
  const detailSheetRef = useRef<BottomSheetModal>(null);
  const filterSheetRef = useRef<BottomSheetModal>(null);

  // Data Fetching
  const loadData = useCallback(
    async (reset = false) => {
      if (isLoading || (!reset && !hasMore)) return;

      setIsLoading(true);
      const currentPage = reset ? 0 : page;

      try {
        const newData = await fetchReservations(currentPage, filters);

        if (reset) {
          setReservations(newData);
          setPage(1);
        } else {
          setReservations((prev) => [...prev, ...newData]);
          setPage((prev) => prev + 1);
        }

        setHasMore(newData.length > 0);
      } catch (error) {
        console.error('Failed to fetch reservations:', error);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [isLoading, hasMore, page, filters],
  );

  useEffect(() => {
    loadData(true);
  }, [filters]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadData(true);
  }, [loadData]);

  const handleLoadMore = useCallback(() => {
    loadData();
  }, [loadData]);

  // Handlers
  const handleReservationPress = useCallback((reservation: Reservation) => {
    setSelectedReservation(reservation);
    detailSheetRef.current?.present();
  }, []);

  const handleFilterPress = useCallback(() => {
    filterSheetRef.current?.present();
  }, []);

  const handleApplyFilters = useCallback((newFilters: ReservationFilters) => {
    setFilters(newFilters);
  }, []);

  return (
    <SafeAreaView className="safe-area" edges={['top']}>
      <View className="main-area">
        <ReservationList
          reservations={reservations}
          onReservationPress={handleReservationPress}
          onFilterPress={handleFilterPress}
          filters={filters}
          isLoading={isLoading}
          onLoadMore={handleLoadMore}
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
        />

        {/* Detail Sheet */}
        <ReservationBottomSheet
          ref={detailSheetRef}
          reservation={selectedReservation}
          onClose={() => setSelectedReservation(null)}
        />

        {/* Filter Sheet */}
        <ReservationFilterSheet
          ref={filterSheetRef}
          filters={filters}
          onApply={handleApplyFilters}
          onClose={() => filterSheetRef.current?.dismiss()}
        />
      </View>
    </SafeAreaView>
  );
}
