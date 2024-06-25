import Navbar from "@/components/Navbar";
import { TypewriteEffect } from "@/components/TypewriteEffect";
import { WavyBackgroundDemo } from "@/components/WavyBackgroundDemo";



export default function Home() {
  return (
    <div>
     
      <div className="w-full border-b-1 drop-shadow-lg shadow-lg shadow-zinc-100/10 z-50">
        <Navbar/>
      </div>
      {/* <div><WavyBackgroundDemo/></div> */}
      
      <div className=" w-full ">
        <TypewriteEffect/>
      </div>
      <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
    </div>
  );
}
