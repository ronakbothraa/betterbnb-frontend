type Property = {
  id: string;
  price_per_night: number;
}

interface ReservationSideBarProps {
  property: Property;
}

const ReservationSideBar:React.FC<ReservationSideBarProps> = ({property}) => {
  return (
    <div className="mt-6 col-span-2 rounded-xl border border-gray-300 p-6 shadow-xl">
      <p className="text-2xl font-semibold">₹{property.price_per_night} per night</p>
      <div className="h-4"></div>
      <div className="mb-6 p-3 border border-gray-400 rounded-lg">
        <label htmlFor="checkin" className="mb-2 block font-bold text-xs">Guests</label>
        <select id="guests" className="w-full -ml-1 text-xm" defaultValue="">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4+">4+</option>
        </select>
      </div>

      <div className="w-full mb-6 p-4 text-center bg-airbnb hover:bg-airbnb-dark rounded-xl text-white font-semibold transition">
        Book
      </div>

      <div className="flex flex-row items-center justify-between space-y-2">
        <div className="flex text-lg text-gray-500">
            Price:  
        </div>
        <div className="flex text-lg text-gray-500">
            <span className="font-semibold">$200</span>
        </div>
      </div>
      <div className="mb-4 flex flex-row items-center justify-between space-y-2">
        <div className="flex text-lg text-gray-500">
            Fee:  
        </div>
        <div className="flex text-lg text-gray-500">
            <span className="font-semibold">$10</span>
        </div>
      </div>

      <hr />
    
        <div className="flex flex-row items-center justify-between space-y-2">
        <div className="flex text-lg text-gray-500">
            Total:  
        </div>
        <div className="flex text-lg text-gray-500">
            <span className="font-semibold">$210</span>
        </div>
      </div>


    </div>
  );
};

export default ReservationSideBar;
