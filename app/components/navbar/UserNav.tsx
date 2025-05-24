import { CircleUserRound, Menu } from "lucide-react"

const UserNav = () => {
  return (
    <div className="p-2 relative inline-block border rounded-full">
        <button className="flex items-center">
            <Menu />
            <CircleUserRound />
        </button>
    </div>
  )
}

export default UserNav