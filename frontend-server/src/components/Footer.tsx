"use client";
import React from "react";
import Line from "./effects/Line";
import SubHeading from "./headersComponent/SubHeading";
import Heading from "./headersComponent/Heading";
import Link from "next/link";
import { FaInstagram, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { useRouter } from "next/navigation";

const Footer = () => {
  const navigate = useRouter();
  return (
    <>
      <main className="w-full">
        <Line />
        <div className="flex justify-center items-center w-full  text-2xl">
          We are Engineers & we can do Anything
        </div>
        <div className="w-full h-[60vh] flex">
          <div className="w-[30vw]  h-full flex justify-center  flex-col">
            {" "}
            <p className="text-3xl ml-[138px]">@Robonauts</p>
            <span className="ml-20">
              <SubHeading
                value={"An Edtech platform for Engineering college"}
              />
            </span>
          </div>
          <div className="w-[20vw] flex justify-center items-center flex-col  h-full ">
            <Heading value={"Catalog"} />

            <div className="w-full flex justify-center flex-col ml-[14rem] mt-2 gap-2 ">
              <h2>College Works</h2>
              <h2>Web Devlopment</h2>
            </div>
          </div>
          <div className="w-[20vw]  h-full flex flex-col justify-center gap-2">
            <Heading value={"Resources"} />
            <span className="ml-[6rem] gap-5">
              <li>ClassNotes</li>
              <li>Assignments</li>
              <li>PYQs</li>
              <li>TextBooks</li>
            </span>

            <div></div>
          </div>
          <div className="w-[30vw]  h-full flex justify-center flex-col items-center gap-6">
            <div>
              <Link href="/about">
                <button className="text-2xl text-neutral-300 hover:text-neutral-100">
                  About us
                </button>
              </Link>
            </div>
            <div className="">
              {" "}
              <span className="py-5 mb-4">
                <Heading value={"Follow us on"} />
              </span>
              <div>
                <button
                  onClick={() => {
                    navigate.push(
                      "https://x.com/Sushil_Sahani37?t=zyiO3kvkcvORJMSkmqI45g&s=09"
                    );
                  }}
                  className=" hover:scale-150 duration-300 px-4"
                >
                  <FaXTwitter />
                </button>

                <button
                  onClick={() => {
                    navigate.push(
                      "https://www.instagram.com/sushil______16?igsh=MW52cTl1ZTlvODk1dw=="
                    );
                  }}
                  className="hover:scale-150 duration-300"
                >
                  <FaInstagram />
                </button>
                <button
                  onClick={() => {
                    navigate.push(
                      "https://www.linkedin.com/in/sushil-sahani-46235527b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                    );
                  }}
                  className=" hover:scale-150 duration-300 px-4"
                >
                  <FaLinkedin />
                </button>
              </div>
            </div>
            <span className="text-neutral-400 hover:text-neutral-300">
              @support
            </span>
          </div>
        </div>
        <div className="w-full h-[5vh] bg-zinc-950 flex justify-center items-center gap-3">
          <p className="text-white">Copyright © 2024</p>
          <h2>Starting NoteWrite </h2>
          <span>By @sushil.sahani</span>
        </div>
      </main>
    </>
  );
};

export default Footer;
