import Image from "next/image";
import Navbar from "@/components/Navbar";
import Body from "@/components/Body";
import AuthPage from "@/components/Auth";
export default function Home() {
  const user={
  name: 'Bhavesh',
  imageUrl: '/user-icon.png'
};
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar/>
      <Body user={user} />
      {/* <AuthPage /> */}
    </div>
  );
}
