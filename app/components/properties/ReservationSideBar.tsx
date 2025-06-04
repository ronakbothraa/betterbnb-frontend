"use client";

import useLoginModal from "@/app/hooks/useLoginModal";
import { Range } from "react-date-range";
import { useEffect, useState, useCallback } from "react";
import DatePicker from "../Calendar";
import { differenceInDays, addDays, format, eachDayOfInterval } from "date-fns";
import apiService from "@/app/services/apiService";

const initialDateRange = {
  startDate: new Date(),
  endDate: addDays(new Date(), 1),
  key: "selection",
};

type Property = {
  id: string;
  price_per_night: number;
  guests: number;
};

interface ReservationSideBarProps {
  user: string | null;
  property: Property;
}

// Fix: Remove 'any' type and make more specific
interface Reservation {
  start_date: string;
  end_date: string;
}

interface BookingResponse {
  success?: boolean;
  data?: {
    booking_id?: string;
    message?: string;
  };
  error?: string;
  message?: string;
}

interface ReservationsResponse {
  data: Reservation[];
}

const ReservationSideBar: React.FC<ReservationSideBarProps> = ({
  property,
  user,
}) => {
  const loginModal = useLoginModal();

  const [fee, setFee] = useState<number>(0);
  const [nights, setNights] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<number>(
    property.price_per_night
  );
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);
  const [guests, setGuests] = useState<string>("1");
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  
  const guestRange = Array.from({ length: property.guests }, (_, i) => i + 1);

  // Fix: Use useCallback to memoize the function
  const getReservations = useCallback(async () => {
    try {
      const reservations: ReservationsResponse = await apiService.get(
        `api/properties/${property.id}/reservations/`
      );

      let dates: Date[] = [];

      if (reservations.data && Array.isArray(reservations.data)) {
        reservations.data.forEach((element: Reservation) => {
          try {
            const startDate = new Date(element.start_date);
            const endDate = new Date(element.end_date);
            
            // Validate dates before processing
            if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
              const range = eachDayOfInterval({
                start: startDate,
                end: endDate,
              });
              dates = [...dates, ...range];
            }
          } catch (error) {
            console.error("Error processing reservation date:", error);
          }
        });
      }
      
      setBookedDates(dates);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  }, [property.id]);

  const performBooking = async () => {
    if (!user) {
      loginModal.openModal();
      return;
    }

    if (!dateRange.startDate || !dateRange.endDate) {
      setError("Please select valid dates");
      return;
    }

    // Validate booking dates aren't in the past
    if (dateRange.startDate < new Date()) {
      setError("Cannot book dates in the past");
      return;
    }

    // Check if selected dates overlap with booked dates
    const selectedDates = eachDayOfInterval({
      start: dateRange.startDate,
      end: dateRange.endDate,
    });

    const hasOverlap = selectedDates.some(date => 
      bookedDates.some(bookedDate => 
        date.toDateString() === bookedDate.toDateString()
      )
    );

    if (hasOverlap) {
      setError("Selected dates are not available");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("guests", guests);
      formData.append("start_date", format(dateRange.startDate, "yyyy-MM-dd"));
      formData.append("end_date", format(dateRange.endDate, "yyyy-MM-dd"));
      formData.append("number_of_nights", nights.toString());
      formData.append("total_price", (totalPrice + fee).toString());

      const response: BookingResponse = await apiService.post(
        `api/properties/${property.id}/book/`, 
        formData
      );
      
      if (response.success) {
        console.log("Booking successful");
        // Refresh reservations to update booked dates
        await getReservations();
        // Reset form or show success message
        setError("");
      } else {
        console.error("Booking failed", response.data);
        setError(response.error || response.message || "Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      setError("An error occurred while booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const _setDateChange = (selection: Range) => {
    const newStartDate = new Date(selection.startDate || new Date());
    const newEndDate = new Date(selection.endDate || addDays(new Date(), 1));

    if (newEndDate <= newStartDate) {
      newEndDate.setDate(newStartDate.getDate() + 1);
    }

    setDateRange({
      ...dateRange,
      startDate: newStartDate,
      endDate: newEndDate,
    });
    setError(""); // Clear errors when dates change
  };

  // Fix: Add getReservations to dependency array
  useEffect(() => {
    getReservations();
  }, [getReservations]);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const nightsCount = differenceInDays(
        dateRange.endDate,
        dateRange.startDate
      );

      if (nightsCount > 0 && property.price_per_night) {
        const _fee = Math.round(property.price_per_night * nightsCount * 0.05);
        const _totalPrice = property.price_per_night * nightsCount;
        setNights(nightsCount);
        setTotalPrice(_totalPrice);
        setFee(_fee);
      } else {
        // Reset values for invalid date ranges
        setNights(1);
        setTotalPrice(property.price_per_night);
        setFee(Math.round(property.price_per_night * 0.05));
      }
    }
  }, [dateRange, property.price_per_night]);

  return (
    <div className="mt-6 col-span-2 rounded-xl border border-gray-300 p-6 shadow-xl">
      <p className="text-2xl">₹{property.price_per_night}/night</p>
      
      <DatePicker
        value={dateRange}
        onChange={(ranges) => _setDateChange(ranges.selection)}
        BookedDates={bookedDates}
      />
      
      <div className="mb-6 p-3 border border-gray-400 rounded-lg">
        <label htmlFor="guests" className="mb-2 block font-bold text-xs">
          Guests
        </label>
        <select
          id="guests"
          className="w-full -ml-1 text-sm focus:outline-none focus:ring-2 focus:ring-airbnb"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          disabled={isLoading}
        >
          {guestRange.map((guest) => (
            <option key={guest} value={guest}>
              {guest} {guest === 1 ? 'Guest' : 'Guests'}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        onClick={performBooking}
        disabled={isLoading || !dateRange.startDate || !dateRange.endDate}
        className="w-full mb-6 p-4 text-center bg-airbnb hover:bg-airbnb-dark rounded-xl text-white font-semibold transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? "Booking..." : "Book"}
      </button>

      <div className="mb-4 flex justify-between items-center">
        <p>Price:</p>
        <p>₹{property.price_per_night} x {nights} nights</p>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <p>Fee:</p>
        <div className="flex flex-col text-right">
          <span>₹{fee}</span>
          <span className="text-xs text-gray-500">5% of ₹{totalPrice}</span>
        </div>
      </div>

      <hr className="my-4" />

      <div className="mb-4 flex justify-between items-center font-semibold">
        <p>Total:</p>
        <p>₹{totalPrice + fee}</p>
      </div>
    </div>
  );
};

export default ReservationSideBar;