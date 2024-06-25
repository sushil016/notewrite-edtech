import Navbar from "@/components/Navbar";
import { TypewriteEffect } from "@/components/TypewriteEffect";
import { WavyBackgroundDemo } from "@/components/WavyBackgroundDemo";



export default function Home() {
  return (
    <div>
     
      <div className="w-full border-b-2 drop-shadow-lg shadow-lg shadow-zinc-100/20 ">
        <Navbar/>
      </div>
      {/* <div><WavyBackgroundDemo/></div> */}
      
      <div className=" w-full ">
        <TypewriteEffect/>
      </div>
    </div>
  );
}
