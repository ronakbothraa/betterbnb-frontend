import Image from "next/image"
import Link from "next/link"
import SearchFilters from "./SearchFilters"
import UserNav from "./UserNav"
import AddPropertyButton from "./AddPropertyButton"
import { getAuthCookies } from "@/app/lib/actions"

const Navbar = async () => {

    const user = await getAuthCookies()

  return (
    <nav className="w-full fixed top-0 left-0 py-6 border-b bg-white z-10">
        <div className="max-w-[1500px] mx-auto px-6 ">
            <div className="flex justify-between items-center">
                <Link className="flex flex-row justify-between items-center" href="/">
                    <Image src="/image_1_.svg" alt="Logo" width={50} height={38} />
                    <div className="w-2"></div>
                    <main className="text-airbnb font-bold text-2xl">bettrbnb</main>
                </Link>

                <div className="flex space-x-6">
                    <SearchFilters />
                </div>

                <div className="flex items-center space-x-6">
                    <AddPropertyButton
                        user={user}
                    />
                    
                    <UserNav
                        user={user}
                    />
                </div>
            </div>
        </div>
    </nav>
  )
}

export default Navbar