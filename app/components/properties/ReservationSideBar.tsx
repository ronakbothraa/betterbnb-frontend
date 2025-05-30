"use client";

import useLoginModal from "@/app/hooks/useLoginModal";
import { Range } from "react-date-range";
import { useEffect, useState } from "react";
import DatePicker from "../Calendar";
import { differenceInDays, addDays, format } from "date-fns";
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
  const [minDate, setMinDate] = useState<Date>(new Date());
  const [guests, setGuests] = useState<string>("1");
  const guestRange = Array.from({ length: property.guests }, (_, i) => i + 1);

  const performBooking = async () => {
    if (!user) {
      loginModal.openModal();
      return;
    }

    if (!dateRange.startDate || !dateRange.endDate) {
      console.error("Please select valid dates");
      return;
    }

    const formData = new FormData();
    formData.append("guests", guests);
    formData.append("start_date", format(dateRange.startDate, "yyyy-MM-dd"));
    formData.append("end_date", format(dateRange.endDate, "yyyy-MM-dd"));
    formData.append("number_of_nights", nights.toString());
    formData.append("total_price", totalPrice.toString());    

    const resposne  = await apiService.post('api/properties/' + property.id + '/book/', formData)
    
    if (resposne.success) {
      console.log("Booking successful");
    } else {
      console.error("Booking failed", resposne.data);
    }
  };

  const _setDateChange = (selection: any) => {
    const newStartDate = new Date(selection.startDate);
    const newEndDate = new Date(selection.endDate);

    if (newEndDate <= newStartDate) {
      newEndDate.setDate(newStartDate.getDate() + 1);
    }

    setDateRange({
      ...dateRange,
      startDate: newStartDate,
      endDate: newEndDate,
    });
  };

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const nightsCount = differenceInDays(
        dateRange.endDate,
        dateRange.startDate
      );

      if (nightsCount && property.price_per_night) {
        const _fee = Math.round(property.price_per_night * nightsCount * 0.05);
        const _totalPrice = property.price_per_night * nightsCount;
        setNights(nightsCount);
        setTotalPrice(_totalPrice);
        setFee(_fee);
      }
    }
  }, [dateRange]);

  return (
    <div className="mt-6 col-span-2 rounded-xl border border-gray-300 p-6 shadow-xl">
      <p className="text-2xl">₹{property.price_per_night}/night</p>
      <DatePicker
        value={dateRange}
        onChange={(ranges) => _setDateChange(ranges.selection)}
        BookedDates={[]}
      />
      <div className="mb-6 p-3 border border-gray-400 rounded-lg">
        <label htmlFor="checkin" className="mb-2 block font-bold text-xs">
          Guests
        </label>
        <select
          id="guests"
          className="w-full -ml-1  text-xm"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
        >
          {guestRange.map((guest) => (
            <option key={guest} value={guest}>
              {guest}
            </option>
          ))}
        </select>
      </div>{" "}
      <div
        onClick={performBooking}
        className="cursor-pointer w-full mb-6 p-4 text-center bg-airbnb hover:bg-airbnb-dark rounded-xl text-white font-semibold transition"
      >
        Book
      </div>
      <div className="mb-4 flex justify-between align-center">
        <p>Price:</p>
        <p>
          ₹{property.price_per_night} x {nights}
        </p>
      </div>
      <div className="mb-4 flex justify-between align-center">
        <p>Fee:</p>
        <div className="flex flex-col">
          <span className="ml-auto">₹{fee}</span>
          <span className="text-xs">5% of {totalPrice}</span>
        </div>
      </div>
      <hr />
      <div className="mb-4 flex justify-between align-center">
        <p>Total:</p>
        <p>{totalPrice + fee}</p>
      </div>
    </div>
  );
};

export default ReservationSideBar;
